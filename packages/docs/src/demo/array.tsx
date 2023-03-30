import React from 'react';
import { ArrayField, FormItem, observer, useForm } from '@formable/react';
import { Form, FormItem as AntdFormItem } from '@formable/antd';
import { Button, Input, Row, Col, Card } from 'antd';
import ReactJson from 'react-json-view';
import { FormStore } from '@formable/core';

const FormDemo: React.FC<{ form: FormStore }> = ({ form }) => {
  return (
    <Form form={form} onSubmit={console.log}>
      <ArrayField
        name="items"
        decorator={[AntdFormItem]}
        label="Items"
        rules={[{ required: true }]}
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <>
                <FormItem
                  {...field}
                  decoratorProps={{
                    extra: (
                      <>
                        <Button type="link" onClick={() => remove(index)}>
                          删除{field.name} {field.initialValue}
                        </Button>
                      </>
                    ),
                  }}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter a value" />
                </FormItem>
              </>
            ))}
            <div>
              <Button type="dashed" onClick={() => add()}>
                尾部添加
              </Button>
              <Button type="dashed" onClick={() => add(999, 0)}>
                头部添加 初始值999
              </Button>
            </div>
          </>
        )}
      </ArrayField>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
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
    initialValues: {
      items: ['666'],
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
