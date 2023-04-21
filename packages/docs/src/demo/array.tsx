import React from 'react';
import { ArrayField, FormList, FormItem, observer, useForm } from '@formable/react';
import { Form, FormItem as AntdFormItem } from '@formable/antd';
import { Button, Input, Row, Col, Card, InputNumber } from 'antd';
import ReactJson from 'react-json-view';
import { FormStore } from '@formable/core';

const ButtonGroup = Button.Group;

const FormDemo: React.FC<{ form: FormStore }> = ({ form }) => {
  return (
    <Form form={form} onSubmit={console.log}>
      <ArrayField
        name="items"
        decorator={[AntdFormItem]}
        label="纯数组"
        rules={[{ required: true, type: 'array' }]}
        initialValue={[1, 2]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <>
                <FormItem
                  {...field}
                  extra={
                    <Button type="link" onClick={() => remove(index)}>
                      删除{field.name} {field.isListField && 'ListField'} 初始值{field.initialValue}
                    </Button>
                  }
                  rules={[{ required: true }]}
                >
                  <InputNumber placeholder="Enter a value" />
                </FormItem>
              </>
            ))}
            <div>
              <Button type="dashed" onClick={() => add(111)}>
                尾部添加
              </Button>
              <Button type="dashed" onClick={() => add(999, 0)}>
                头部添加 初始值prepend
              </Button>
            </div>
          </>
        )}
      </ArrayField>
      <ArrayField
        name="items_object"
        decorator={[AntdFormItem]}
        label="数组对象"
        rules={[{ required: true, type: 'array' }]}
        initialValue={[
          {
            age: '44',
            name: '王五',
            address: '北京',
            birth: '2022-01-01',
          },
        ]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <React.Fragment key={field.key}>
                <FormItem {...field} name={[...field.name, 'age']} rules={[{ required: true }]}>
                  <Input placeholder="Enter a age" />
                </FormItem>
                <FormItem {...field} name={[...field.name, 'name']} rules={[{ required: true }]}>
                  <Input placeholder="Enter a name" />
                </FormItem>
                <FormItem {...field} name={[...field.name, 'address']} rules={[{ required: true }]}>
                  <Input placeholder="Enter a address" />
                </FormItem>
                <FormItem {...field} name={[...field.name, 'birth']} rules={[{ required: true }]}>
                  <Input placeholder="Enter a birth" />
                </FormItem>
                <Button type="link" onClick={() => remove(index)}>
                  删除
                </Button>
              </React.Fragment>
            ))}
            <ButtonGroup>
              <Button type="dashed" onClick={() => add()}>
                尾部添加
              </Button>
              <Button
                type="dashed"
                onClick={() =>
                  add({ age: '33', name: '张三', address: '杭州', birth: '2020-01-01' }, 0)
                }
              >
                头部添加
              </Button>
            </ButtonGroup>
          </>
        )}
      </ArrayField>
      <FormList
        name="items_form_list"
        label="数组对象(FormList)"
        rules={[{ required: true, type: 'array' }]}
        initialValue={[
          {
            age: '44',
            name: '王五',
            address: '北京',
            birth: '2022-01-01',
          },
        ]}
      >
        <FormItem name={['age']} component="Input"></FormItem>
        <FormItem name={['name']} component="Input"></FormItem>
        <FormItem name={['birth']} component="Input"></FormItem>
        <FormItem name={['address']} component="Input"></FormItem>
      </FormList>
      <ButtonGroup>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button
          type="primary"
          onClick={() => {
            // form.getFieldInstance('items').move(0, 1);
            form.getFieldInstance('items_object').move(0, 1);
            // form.getFieldInstance('items_form_list').move(0, 1);
          }}
        >
          交换数组0和1顺序
        </Button>
      </ButtonGroup>
    </Form>
  );
};
const JsonViewer = observer(({ form }: any) => {
  return (
    <>
      <ReactJson
        src={{
          ...form.values,
        }}
      />
    </>
  );
});
const Layout = () => {
  const [form] = useForm({
    // initialValues: {
    //   items: [],
    // },
    components: {
      Input,
    },
  });

  return (
    <Row gutter={20}>
      <Col span={12}>
        <FormDemo form={form} />
      </Col>
      <Col span={12}>
        <Card>
          <JsonViewer form={form} />
        </Card>
      </Col>
    </Row>
  );
};

export const ArrayDemo = observer(Layout);
