import React from "react";
import {Form, Field} from "@formable/react";
import { Button, Input } from "antd";


const Demo = () => {
    return (
        <div className="examples-wrapper">
            <Form onSubmit={console.log}>
                <Field label="user" name="user">
                    <Input />
                </Field>
                <Field label="age" name="age">
                    <Input />
                </Field>
                <Field>
                    <Button htmlType="submit" />
                </Field>
            </Form>
        </div>
    );
};

export default Demo;
