import * as mobx from "mobx";

export const mergeRules = (rules: any, required: boolean) => {
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

export const setObserverable = (
    target: unknown,
    key: string,
    value: unknown
) => {
    if (mobx.isObservable(target)) {
        mobx.set(target, key, value);
    }
};
