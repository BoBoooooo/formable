import { FormStore } from "@formable/core";
import React from "react";

// 待拓展
// type ExposedAPI = Pick<FormStore, "submit" | "initialize">;

export function useForm(form?: FormStore, options?: any): [FormStore] {
    const formRef = React.useRef<FormStore>();
    console.log('options',options);
    
    if (!formRef.current) {
        if (form) {
            formRef.current = form;
        } else {
            formRef.current = new FormStore(options);
            // formRef.current = formStore.getInstance();
        }
    }

    return [formRef.current];
}
