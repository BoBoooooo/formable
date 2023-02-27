import React, { useState } from "react";
import { Field, FormObserver, observer, useForm } from "@formable/react";
import { Form, FormItem } from "@formable/antd";
import { Button, Input, Row, Col, Card, Switch , Radio} from "antd";
import "antd/dist/antd.css";
import ReactJson from "react-json-view";
import { FormStore } from "@formable/core";

const FormDemo: React.FC<{ form: FormStore }> = ({ form }) => {
    const [bool, setBool] = useState(false);
    return (
        <div className="examples-wrapper">
            bool state:
            {bool ? "true" : "false"}
            <Form
                form={form}
                layout="horizontal"
                onSubmit={console.log}
                initialValues={{
                    user: "ou1t",
                }}>
                <Field
                    decorator={[FormItem]}
                    getValueFromEvent={(e) => {
                        return e.target.value;
                    }}
                    required
                    label={`user${bool ? "外部更新" : "初始"}`}
                    name="user"
                    initialValue="in">
                    <Input
                        placeholder="请输入xxx"
                        onChange={(e) => console.log("input-change", e)}
                        onBlur={console.log} />
                </Field>
                <Field
                    decorator={[FormItem]}
                    label="age"
                    name="age"
                    required
                    initialValue="in">
                    <Input />
                </Field>
                <Field
                    decorator={[FormItem]}
                    label="switch"
                    name="trigger"
                    valuePropName="checked"
                    getValueFromEvent={(e) => {
                        return e;
                    }}>
                    <Switch />
                </Field>
                <FormObserver>
                    {(form) => {
                        return JSON.stringify(form.values) || "无";
                    }}
                </FormObserver>
                <Field
                    decorator={[FormItem]}
                    required
                    label="联动"
                    name="radio">
                    <Radio.Group options={[
                        {
                            label: '显示',
                            value: 1
                        },
                        {
                            label: '隐藏',
                            value: 0 
                        }
                    ]} />
                </Field>
                <FormObserver>
                    {(form) => {
                        return form.values.radio === 1 ? (
                            <Field
                                preserve
                                decorator={[FormItem]}
                                label="联动Field"
                                name="dynamic_field"
                                required
                                initialValue="dynamic">
                                <Input />
                            </Field>  
                        ) : (
                            null
                        );
                    }}
                </FormObserver>
                <Field>
                    <Button.Group>
                        <Button htmlType="submit">原生提交</Button>
                        <Button type="primary" onClick={() => form.submit()}>
                            API提交
                        </Button>
                        <Button onClick={() => form.reset()}>重置</Button>
                        <Button onClick={() => form.clear()}>清空</Button>
                        <Button
                            onClick={() => {
                                form.updateFieldLayout("user", {
                                    label: "联动 user!!!!!",
                                    extra: "测试",
                                    tooltip: <div>123</div>,
                                });

                                form.updateFieldLayout("age", {
                                    label: "联动 age!!!!!",
                                });
                            }}>
                            联动修改UI
                        </Button>
                        <Button onClick={() => setBool(!bool)}>修改外部状态</Button>
                    </Button.Group>
                </Field>
            </Form>
        </div>
    );
};

const JsonViewer = observer(({ form }: any) => {
    return (
        <>
            <ReactJson
                src={{
                    ...form.values,
                }} />
        </>
    );
});

const Layout = () => {
    const [form] = useForm({
        initialValues: {
            user: "ou1t",
        },
    });

    form.registerListener(['radio', 'user'], ()=> {
        return true;
    }, ()=>{
        form.setFieldValue('age', 20);
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

export default observer(Layout);
