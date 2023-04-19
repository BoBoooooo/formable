import type { Rule as IRule } from 'async-validator';
import { FieldStore } from './models';
export type { Rules as IRules, Rule as IRule } from 'async-validator';

export type ICondition = IListener['condition'];

export type FieldDisplayType = 'edit' | 'disabled' | 'preview' | 'hidden' | 'none' | '';
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating';
export type FormDisplayType = 'edit' | 'disabled' | 'preview' | '';

export enum FieldDisplayTypeEnum {
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
  display?: FieldDisplayType;
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

export type NamePath = string | (string | number)[];

export type IRegisterFieldParams = Partial<
  Pick<
    FieldStore,
    | 'name'
    | 'initialValue'
    | 'rules'
    | 'display'
    | 'required'
    | 'isListField'
    | 'validateStatus'
    | 'layout'
  > & {
    prefixName: NamePath;
    // 是否数组字段
    isArrayField: boolean;
    listeners: IListener[];
  }
>;
