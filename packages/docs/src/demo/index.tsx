import React from "react";
import { Form, Field } from "@formable/react";
import { Button, Input } from "antd";

const Demo = () => {
    return (
        <div className="examples-wrapper">
            <Form
                onSubmit={console.log}
                initialValues={{
                    user: "out",
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
            </Form>
        </div>
    );
};

export default Demo;
