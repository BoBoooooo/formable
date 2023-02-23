import React, { useState } from "react";
import { Field, FormObserver, useForm } from "@formable/react";
import { Form, FormItem } from "@formable/antd";
import { Button, Input} from "antd";
import 'antd/dist/antd.css';

const Demo = () => {
    const [form] = useForm({
        initialValues: {
            user: "ou1t",
        },
    });

    const [bool, setBool] = useState(false);
    return (
        <div className="examples-wrapper">
            bool state:
            {bool ? "true" : "false"}
            <Form
                form={form}
                layout='horizontal'
                onSubmit={console.log}
                initialValues={{
                    user: "ou1t",
                }}>
                <Field
                    decorator={[
                        FormItem,
                        {
                            labelCol: {
                                span: 4,
                            },
                        },
                    ]}
                    label={`user${bool ? "外部更新" : "初始"}`}
                    name="user"
                    initialValue="in">
                    <Input />
                </Field>
                <Field
                    decorator={[FormItem]}
                    label="age"
                    name="age"
                    required
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
                        <Button
                            onClick={() => {
                                form.updateFieldLayout("user", {
                                    label: "联动 user!!!!!",
                                    extra: '测试',
                                    tooltip: <div>123</div>
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

export default Demo;
