import { FormStore } from '@formable/core';
import type { FormProps, ColProps } from 'antd';
import { ReactNode } from 'react';

export const tuple = <T extends string[]>(...args: T) => args;

export type FormLabelAlign = 'left' | 'right';
export type RequiredMark = boolean | 'optional';

export type JSXComponent = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

export interface FormableProps<Values = any>
  extends Omit<FormProps, 'form' | 'onFinsih' | 'onFinsihFailed'> {
  form?: FormStore;
  onSubmit?: (values: Values) => void;
  component?: JSXComponent;
}
export interface FormLayoutContextProps {
  vertical: boolean;
  name?: string;
  colon?: boolean;
  labelAlign?: FormLabelAlign;
  labelWrap?: boolean;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  requiredMark?: RequiredMark;
}

export interface FormItemStatusContextProps {
  isFormItemInput?: boolean;
  status?: ValidateStatus;
  hasFeedback?: boolean;
  feedbackIcon?: ReactNode;
}
export interface FormItemPrefixContextProps {
  prefixCls: string;
  status?: ValidateStatus;
}

const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');

export type ValidateStatus = (typeof ValidateStatuses)[number];
