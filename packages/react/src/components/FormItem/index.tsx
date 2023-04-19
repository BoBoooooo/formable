import React from 'react';
import { IFormItemProps } from '../../types';
import { FormItem as AntdFormItem } from '@formable/antd';
import { Field } from '../Field';

export const FormItem: React.FC<IFormItemProps> = ({
  component,
  componentProps,
  display,
  initialValue,
  name,
  preserve,
  valuePropName,
  validateStatus,
  validateTrigger,
  label,
  trigger,
  rules,
  required,
  listeners,
  isListField,
  getValueFromEvent,
  children,
  ...decoratorProps
}) => {
  return (
    <Field
      name={name}
      component={component}
      componentProps={componentProps}
      display={display}
      initialValue={initialValue}
      preserve={preserve}
      valuePropName={valuePropName}
      validateStatus={validateStatus}
      validateTrigger={validateTrigger}
      label={label}
      trigger={trigger}
      rules={rules}
      required={required}
      listeners={listeners}
      isListField={isListField}
      getValueFromEvent={getValueFromEvent}
      decorator={[AntdFormItem, decoratorProps]}
    >
      {children}
    </Field>
  );
};
