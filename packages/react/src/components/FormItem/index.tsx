import React from 'react';
import { IFormItemProps } from '../../types';
import { Field } from '../Field';
import { FormItem as AntdFormItem } from '@formable/antd';

export const FormItem: React.FC<IFormItemProps> = ({ children, decoratorProps, ...restProps }) => {
  return (
    <Field {...restProps} decorator={[AntdFormItem, decoratorProps]}>
      {children}
    </Field>
  );
};
