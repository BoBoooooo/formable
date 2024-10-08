# formable
简化 formily 语法，对齐 antd 表单语法，拓展 FormItem，Form 语法糖组件。

## 基本用法
```jsx
import React, { useState } from 'react';
import { FormItem, observer, useForm } from '@formable/react';
import { FormStore } from '@formable/core';
import { Form } from '@formable/antd';
import { Button, Input } from 'antd';
import FormPlayground from '../commom/playground';

const FormDemo: React.FC<{ form: FormStore }> = ({ form }) => {
  const [bool, setBool] = useState(false);
  return (
    <div className="examples-wrapper">
      bool state:
      <Form form={form} layout="horizontal" onSubmit={console.log}>
        <FormItem label="age" name="age" required initialValue="in">
          <Input />
        </FormItem>
        <FormItem label="age" name={['arr', 0, 'name']} required initialValue="in">
          <Input />
        </FormItem>
        <FormItem component="Input" label="age2" name="age2" required initialValue="in2"></FormItem>
        <FormItem>
          <Button.Group>
            <Button htmlType="submit">原生提交</Button>
            <Button type="primary" onClick={() => form.submit()}>
              API提交
            </Button>
            <Button onClick={() => form.reset()}>重置</Button>
            <Button onClick={() => form.clear()}>清空</Button>
            <Button
              onClick={() => {
                form.setFieldLayout('user', {
                  label: '联动 user!!!!!',
                  extra: '测试',
                  tooltip: <div>123</div>,
                });

                form.setFieldLayout('age', {
                  label: '联动 age!!!!!',
                });
              }}
            >
              联动修改UI
            </Button>
            <Button onClick={() => setBool(!bool)}>修改外部状态</Button>
          </Button.Group>
        </FormItem>
      </Form>
    </div>
  );
};

const Layout = () => {
  const [form] = useForm({
    components: {
      Input,
    },
  });

  form.registerListener(
    'radio',
    ['user'],
    () => {
      return form.getFieldValue('user') === '123';
    },
    () => {
      form.setFieldValue('radio', 0);
    }
  );

  form.registerListener('dynamic_field2', ['radio'], 'radio.value === 0', () => {
    form.fieldMap.dynamic_field2.display = 'none';
  });

  form.registerListener('age', ['radio'], 'radio.value === 0', { value: 666, required: false });

  return (
    <FormPlayground form={form}>
      <FormDemo form={form} />
    </FormPlayground>
  );
};

export const FormableItem = observer(Layout);
```
