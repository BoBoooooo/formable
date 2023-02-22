import { FormStore } from "@formable/core";
import React from "react";

// 待拓展
// type ExposedAPI = Pick<FormStore, "submit" | "initialize">;

export function useForm(options?: any, initForm?: FormStore): [FormStore] {
    const formRef = React.useRef<FormStore>();
    if (!formRef.current) {
        if (initForm) {
            if (initForm instanceof FormStore === false) 
                throw new Error('form instance must created by createForm or useForm');
            else
                formRef.current = initForm;
        } else {
            formRef.current = new FormStore(options);
            // formRef.current = formStore.getInstance();
        }
    }

    return [formRef.current];
}
