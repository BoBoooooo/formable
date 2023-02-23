import React from "react";
import { FormLayoutContextProps, FormItemStatusContextProps } from "../types";

export interface FormItemPrefixContextProps {
    prefixCls: string;
    status?: ValidateStatus;
}
  
export const FormItemPrefixContext = React.createContext<FormItemPrefixContextProps>({
    prefixCls: '',
});

  
export const tuple = <T extends string[]>(...args: T) => args;

export const FormContext = React.createContext<FormLayoutContextProps>({
    labelAlign: 'right',
    vertical: false,
});

export { FormLayoutContextProps };
export const FormItemInputContext = React.createContext<FormItemStatusContextProps>({});

const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');

export type ValidateStatus = typeof ValidateStatuses[number];
