import { FormStore } from "@formable/core";
import type { FormProps, ColProps } from "antd";

 type FormLabelAlign = 'left' | 'right';
 type RequiredMark = boolean | 'optional';

export type JSXComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

export interface FormableProps<Values = any> extends Omit<FormProps, 'form' |"onFinsih" | 'onFinsihFailed'> {
    form?: FormStore
    onSubmit?: (values: Values) => void;
    component?: JSXComponent
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

