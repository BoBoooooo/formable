import { FormStore } from "@formable/core";
import React from "react";

// 待拓展
// type ExposedAPI = Pick<FormStore, "submit" | "initialize">;

export function useForm(options?: any, initForm?: FormStore): [FormStore] {
    const formRef = React.useRef<FormStore>();
    if (!formRef.current) {
        if (initForm) {
            formRef.current = initForm;
        } else {
            formRef.current = new FormStore(options);
            // formRef.current = formStore.getInstance();
        }
    }

    return [formRef.current];
}
