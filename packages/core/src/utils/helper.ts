import * as mobx from 'mobx';
import { IRule } from '../types';
import { path, assocPath } from 'ramda';

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

// object add observerable key
export const setObserverable = (target: Record<string, any>, key: string, value: any) => {
  if (mobx.isObservable(target)) {
    mobx.set(target, key, value);
  }
};

// https://lodash.com/docs/4.17.15#toPath
// https://ramdajs.com/docs/#path
// https://ramdajs.com/docs/#assocPath
export const getValueByNamePath = (name: string | string[], value: any) => {
  if (!name) {
    return value;
  }
  return path(parseStringNamePathToArray(name), value);
};

export const setValueByNamePath = (name: string | string[], value: any, target: any) =>
  assocPath(parseStringNamePathToArray(name), value, target);

/**
 * namePath Array to name string
 * @param namePathArray
 * @example
 * ["a", 0, "b", "c"] => "a[0].b.c"
 * @returns string
 */
export const parseArrayNamePathToString = (namePathArray: string | string[]) => {
  if (typeof namePathArray === 'string') {
    return namePathArray;
  }
  return namePathArray.reduce((result, key, index) => {
    if (index === 0) {
      result += key;
    } else {
      result += /\d+/.test(key) ? `[${key}]` : `.${key}`;
    }
    return result;
  }, '');
};

export const parseStringNamePathToArray = (namePathString: string | string[]) => {
  if (Array.isArray(namePathString)) {
    return namePathString;
  }
  return namePathString
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
    .map((key: any) => (isNaN(key) ? key : parseInt(key)));
};
