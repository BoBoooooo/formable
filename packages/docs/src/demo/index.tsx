import React from "react";
import { Form, Field, FormObserver, useForm } from "@formable/react";
import { Button, Input, Form as AntdForm } from "antd";

const Demo = () => {
    const [form] = useForm({
        initialValues: {
            user: "ou1t",
        },
    });
    return (
        <div className="examples-wrapper">
            <Form
                form={form}
                onSubmit={console.log}
                initialValues={{
                    user: "ou1t",
                }}>
                <Field
                    decorator={[
                        AntdForm.Item,
                        {
                            labelCol: {
                                span: 4,
                            },
                        },
                    ]}
                    label="user"
                    name="user"
                    initialValue="in">
                    <Input />
                </Field>
                <Field
                    decorator={[AntdForm.Item]}
                    label="age"
                    name="age"
                    initialValue="in">
                    <Input />
                </Field>
                <FormObserver>
                    {(form) => {
                        return JSON.stringify(form.values) || "无";
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
                    </Button.Group>
                </Field>
            </Form>
        </div>
    );
};

export default Demo;
