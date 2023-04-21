import React, { useState } from 'react';
import { Field, FormObserver, observer, useForm } from '@formable/react';
import { FormStore } from '@formable/core';
import { Form, FormItem } from '@formable/antd';
import { Button, Input, Radio, Select } from 'antd';
import FormPlayground from '../commom/playground';

const FormDemo: React.FC<{ form: FormStore }> = ({ form }) => {
  const [bool, setBool] = useState(false);
  return (
    <div className="examples-wrapper">
      <Form
        form={form}
        layout="horizontal"
        onSubmit={console.log}
        initialValues={{
          user: 'ou1t',
          username: {
            firstName: '测试',
          },
        }}
      >
        <Field
          decorator={[FormItem]}
          getValueFromEvent={(e) => {
            return e.target.value;
          }}
          required
          label={`user${bool ? '外部更新' : '初始'}`}
          name="user"
          initialValue="in"
        >
          <Input
            placeholder="请输入xxx"
            onChange={(e) => console.log('input-change', e)}
            onBlur={console.log}
          />
        </Field>
        <Field
          decorator={[FormItem]}
          listeners={[
            {
              watch: ['user'],
              condition: 'user.value === "666"',
              set: {
                value: 99999,
              },
            },
          ]}
          label="age"
          name="age"
          required
          initialValue="in"
        >
          <Input />
        </Field>
        <Field decorator={[FormItem]} required label="联动" name="radio">
          <Radio.Group
            options={[
              {
                label: '显示',
                value: 1,
              },
              {
                label: '隐藏',
                value: 0,
              },
            ]}
          />
        </Field>
        <Field decorator={[FormItem]} label="联动Field_listeners" name="dynamic_field2">
          <Input />
        </Field>
        <FormObserver>
          {(v) => {
            return v.radio === 1 ? (
              <Field
                preserve
                decorator={[FormItem]}
                label="联动Field_observer"
                name="dynamic_field"
                required
                initialValue="dynamic"
              >
                <Input />
              </Field>
            ) : null;
          }}
        </FormObserver>
        <Field>
          <Button.Group>
            <Button htmlType="submit">原生提交</Button>
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
        </Field>
      </Form>
    </div>
  );
};

const Layout = () => {
  const [form] = useForm({
    initialValues: {
      user: 'ou1t',
      username: {
        firstName: '测试',
      },
    },
    components: {
      Select,
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

export const Listener = observer(Layout);
