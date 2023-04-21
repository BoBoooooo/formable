import React from 'react';
import { observer } from '@formable/react';
import { Row, Col, Card } from 'antd';
import ReactJson from 'react-json-view';
import type { FormStore } from '@formable/core';
import 'antd/dist/antd.css';
import { toJS } from 'mobx';
function deleteKey(obj: any, keyName: string, depth = 0) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        // 如果当前深度为1且找到了指定的key，则删除
        if (depth === 1 && prop === keyName) {
          delete obj[prop];
        } else if (depth < 1) {
          // 否则继续递归
          deleteKey(obj[prop], keyName, depth + 1);
        }
      }
    }
  }
  return obj;
}

type LayoutProps = {
  form: FormStore;
};

const JsonViewer: React.FC<LayoutProps> = observer(({ form }) => {
  const fieldMaps: any = toJS(form.fieldMap);
  deleteKey(fieldMaps, 'form');

  return (
    <>
      <Card title="Form">
        <ReactJson
          collapsed={1}
          src={{
            display: form.display,
            inialValues: toJS(form.initialValues),
            values: form.values,
            rules: form.rules,
            errors: form.errors,
            warnings: form.warnings,
          }}
        />
      </Card>
      <Card title="fields">
        <ReactJson collapsed={1} src={fieldMaps}></ReactJson>
      </Card>
    </>
  );
});
const FormPlayground: React.FC<LayoutProps> = ({ children, form }) => {
  return (
    <Row gutter={20}>
      <Col span={12}>{children}</Col>
      <Col span={12}>
        <JsonViewer form={form} />
      </Col>
    </Row>
  );
};

export default observer(FormPlayground);
