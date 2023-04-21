import * as mobx from 'mobx';
import { IRule, NamePath } from '../types';
import { path, assocPath } from 'ramda';

export const toArray = <T>(value: T | T[]): T[] => {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

export const mergeRules = (
  rules: IRule,
  required: boolean,
  isListField?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wrapperRules?: IRule
) => {
  // 校验 rules required拼接
  const r = Array.isArray(rules) ? rules : [];
  const requiredProp = required;
  if (requiredProp) {
    r.push({
      required: true,
    });
  }
  if (isListField) {
    // if (wrapperRules) {
    //   wrapperRules;
    // }
    // const rules = rules.map((rule: IRule) => {
    //   return {
    //     type: 'array',
    //     defaultField: { type: 'object', fields: {} },
    //   };
    // });
  }

  return r;
};

export function convertToRules(rules: Record<string, any>): Rules {
  const result: any = {};
  for (const key in rules) {
    const keys = key.split(/\.|\[(\d+)\]/).filter(Boolean);
    let node: any = result;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!node || !node[k]) {
        node[k] = {};
      }
      if (i === keys.length - 1) {
        node[k] = { ...rules[key][0] };
      } else {
        if (/\d+/.test(keys[i + 1])) {
          node[k] = {
            type: 'array',
            defaultField: { type: 'object', fields: {} },
          };
          i++; // skip array index
        } else {
          node[k] = { type: 'object', fields: {} };
        }
        node = node[k].fields!;
      }
    }
  }
  return result;
}

/**
 * object add observerable key
 * @param target
 * @param key
 * @param value
 * @param flat namePath a[0].b.c 不做转化，默认使用其作为字符串
 */
export const setObserverable = (
  target: Record<string, any>,
  key: NamePath,
  value: any,
  flat = false
) => {
  if (mobx.isObservable(target)) {
    // force use name path key
    const useStringNamePathAsKey = typeof key === 'string' && flat;
    const isMultiplePath = Array.isArray(key) || parseStringNamePathToArray(key).length > 1;
    mobx.runInAction(() => {
      if (useStringNamePathAsKey || !isMultiplePath) {
        mobx.set(target, key, value);
      } else {
        // a[0].b.c merge target
        const newValues = setValueByNamePath(key, value, target) ?? {};
        mobx.set(target, mobx.observable(newValues));
      }
    });
  }
};

// https://lodash.com/docs/4.17.15#toPath
// https://ramdajs.com/docs/#path
// https://ramdajs.com/docs/#assocPath
export const getValueByNamePath = (name: NamePath, value: any) => {
  if (!name) {
    return value;
  }
  // 非复杂数据结构直接return
  if (typeof value !== 'object') {
    return value;
  }
  return path(parseStringNamePathToArray(name), value);
};

export const setValueByNamePath = (name: NamePath, value: any, target: any) =>
  assocPath(parseStringNamePathToArray(name), value, target);

/**
 * namePath Array to name string
 * @param namePathArray
 * @example
 * ["a", 0, "b", "c"] => "a[0].b.c"
 * @returns NamePath string
 */
export const parseArrayNamePathToString = (namePathArray: NamePath) => {
  if (!Array.isArray(namePathArray)) {
    return namePathArray;
  }

  return namePathArray.reduce((result, key, index) => {
    if (index === 0) {
      result += key?.toString();
    } else {
      result += /\d+/.test(key?.toString()) ? `[${key}]` : `.${key}`;
    }
    return result;
  }, '') as string;
};

/**
 * namePath string to array
 * @param namePathArray
 * @example
 * "a[0].b.c" => ["a", 0, "b", "c"]
 * @returns NamePath array
 */
export const parseStringNamePathToArray = (namePathString: NamePath) => {
  if (Array.isArray(namePathString)) {
    return namePathString;
  }
  return namePathString
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
    .map((key: any) => (isNaN(key) ? key : parseInt(key)));
};

/**
 * 合并namePath
 * @param namePath1 namePath1
 * @param namePath2 namePath2
 * @returns newNamePath
 */
export const mergeNamePath = (namePath1: NamePath, namePath2: NamePath): NamePath => {
  const parts1 = Array.isArray(namePath1) ? namePath1 : [namePath1];
  const parts2 = Array.isArray(namePath2) ? namePath2 : [namePath2];
  return [...parts1, ...parts2];
};

/**
 * 互换数组元素
 * @param target array
 * @param from fromIndex
 * @param to toIndex
 * @returns newArray
 */
export const switchArrayItemByIndex = <T>(target: T[], from: number, to: number): T[] => {
  if (from < 0 || from >= target.length || to < 0 || to >= target.length) {
    throw new Error(
      `[Formable]: Index out of range: from=${from}, to=${to}, length=${target.length}`
    );
  }
  const newValue = [...target];
  [newValue[from], newValue[to]] = [newValue[to], newValue[from]];
  return newValue;
};
