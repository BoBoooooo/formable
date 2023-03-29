import * as mobx from 'mobx';
import { IRule, NamePath } from '../types';
import { path, assocPath } from 'ramda';
import type { Rules } from 'async-validator';

export const mergeRules = (rules: IRule, required: boolean) => {
  // 校验 rules required拼接
  const r = Array.isArray(rules) ? rules : [];
  const requiredProp = required;
  if (requiredProp) {
    r.push({
      required: true,
    });
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
      console.log('k', k);

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

// object add observerable key
export const setObserverable = (target: Record<string, any>, key: NamePath, value: any) => {
  if (mobx.isObservable(target)) {
    if (Array.isArray(key)) {
      // a[0].b.c merge target
      const newValues = setValueByNamePath(key, value, target) ?? {};
      mobx.runInAction(() => {
        target = newValues;
      });
    } else {
      mobx.set(target, key, value);
    }
  }
};

// https://lodash.com/docs/4.17.15#toPath
// https://ramdajs.com/docs/#path
// https://ramdajs.com/docs/#assocPath
export const getValueByNamePath = (name: NamePath, value: any) => {
  if (!name) {
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
 * @returns string
 */
export const parseArrayNamePathToString = (namePathArray: NamePath) => {
  if (!Array.isArray(namePathArray)) {
    return namePathArray;
  }

  return namePathArray.reduce((result, key, index) => {
    if (index === 0) {
      result += key.toString();
    } else {
      result += /\d+/.test(key.toString()) ? `[${key}]` : `.${key}`;
    }
    return result;
  }, '') as string;
};

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
