import React from 'react';
import { Button, Space } from 'antd';
import { ArrayField } from '../ArrayField';
import { FormItem as AntdFormItem } from '@formable/antd';
import { IFormListProps } from '../../types';
import { toArray } from '@formable/core';

// TODO: 补充一个 newRecordProps属性
export const FormList: React.FC<IFormListProps> = ({
  display,
  initialValue,
  name,
  preserve,
  validateStatus,
  validateTrigger,
  label,
  rules,
  required,
  listeners,
  children,
  ...decoratorProps
}) => {
  return (
    <ArrayField
      required={required}
      listeners={listeners}
      validateStatus={validateStatus}
      validateTrigger={validateTrigger}
      display={display}
      initialValue={initialValue}
      preserve={preserve}
      name={name}
      label={label}
      rules={rules}
      decorator={[AntdFormItem, decoratorProps]}
    >
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Space key={field.key} align="baseline">
              {React.Children.map(children as any, (child) =>
                React.cloneElement(child, {
                  ...field,
                  name: [index, ...toArray(child?.props?.name)],
                  key: field.name?.toString(),
                })
              )}
              <Button type="link" onClick={() => remove(index)}>
                删除
              </Button>
            </Space>
          ))}
          <Button onClick={() => add()}>添加</Button>
        </>
      )}
    </ArrayField>
  );
};
