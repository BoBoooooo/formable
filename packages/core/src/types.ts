import type { FormStore } from '@formable/core';

export type { Rule as IRule } from 'async-validator';
export type { Rules as IRules } from 'async-validator';

export type ICondition = string | ((params: FormStore) => boolean);

export type DisplayType = 'edit' | 'disabled' | 'preview' | 'hidden' | 'none' | '';

export type FormDisplayType = 'edit' | 'disabled' | 'preview' | '';

export enum DisplayTypeEnum {
  Editable = 'editable',
  Disabled = 'disabled',
  Preview = 'preview',
  Hidden = 'hidden',
  None = 'none',
}
