import { FormStore } from "@formable/core";
import React from "react";

// 待拓展
type ExposedAPI = Pick<FormStore, "submit">;

export function useForm(form?: FormStore): [ExposedAPI] {
    const formRef = React.useRef<ExposedAPI>();
    if (!formRef.current) {
        if (form) {
            formRef.current = form;
        } else {
            const formStore = new FormStore();
            formRef.current = formStore.getInstance();
        }
    }

    return [formRef.current];
}
