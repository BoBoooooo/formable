import React from 'react';
import { observer } from '@formable/react';
import { Row, Col, Card } from 'antd';
import ReactJson from 'react-json-view';
import type { FormStore } from '@formable/core';
import 'antd/dist/antd.css';

type LayoutProps = {
  form: FormStore;
};

const JsonViewer: React.FC<LayoutProps> = observer(({ form }) => {
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
const FormPlayground: React.FC<LayoutProps> = ({ children, form }) => {
  return (
    <Row gutter={20}>
      <Col span={12}>{children}</Col>
      <Col span={12}>
        <Card>
          <JsonViewer form={form} />
        </Card>
      </Col>
    </Row>
  );
};

export default observer(FormPlayground);
