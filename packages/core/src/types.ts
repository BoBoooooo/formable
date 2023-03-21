import type { FieldStore, IRule } from '@formable/core';

export type { Rule as IRule } from 'async-validator';
export type { Rules as IRules } from 'async-validator';

export type ICondition = IListener['condition'];

export type DisplayType = 'edit' | 'disabled' | 'preview' | 'hidden' | 'none' | '';

export type FormDisplayType = 'edit' | 'disabled' | 'preview' | '';

export enum DisplayTypeEnum {
  Editable = 'editable',
  Disabled = 'disabled',
  Preview = 'preview',
  Hidden = 'hidden',
  None = 'none',
}

export type IListenerSet = {
  // 兼容set.ui set.value写法
  layout?: any;
  value?: any;
  required?: boolean;
  rules?: IRule;
  display?: DisplayType;
};

export type IListenerConditionFunction = (
  field: FieldStore,
  formValues: Record<string, any>
) => boolean;

export type IListenerSetFunction = (formValues: Record<string, any>) => IListenerSet;

export interface IListener {
  watch: string[];
  condition?: string | boolean | IListenerConditionFunction;
  set: IListenerSet | IListenerSetFunction;
}
