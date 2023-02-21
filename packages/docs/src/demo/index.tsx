import React from "react";
import { Form, Field, FormObserver, useForm } from "@formable/react";
import { Button, Input } from "antd";

const Demo = () => {
    // const [form] = useForm();
    return (
        <div className="examples-wrapper">
            <Form
                // form={form}
                onSubmit={console.log}
                initialValues={{
                    user: "ou1t",
                }}>
                <Field label="user" name="user" initialValue="in">
                    <Input />
                </Field>
                <Field label="age" name="age">
                    <Input />
                </Field>
                <Field>
                    <Button htmlType="submit">submit</Button>
                </Field>
                <FormObserver>
                    {(form) => {
                        return JSON.stringify(form.values) || "无";
                    }}
                </FormObserver>
            </Form>
        </div>
    );
};

export default Demo;
