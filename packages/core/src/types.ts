import type { FormStore } from '@formable/core';

export type { Rule as IRule } from 'async-validator';
export type { Rules as IRules } from 'async-validator';
export type ICondition = string | ((params: FormStore) => boolean);
