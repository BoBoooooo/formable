import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Form as FormStore } from "@formable/core";
import { FormProvider } from "@/context/form-instance";

export const Form: React.FC<{
    initialValues?: Record<string, any>;
    onSubmit?: any;
}> = observer(({ children, ...restProps }) => {
    const [form] = useState(new FormStore(restProps));

    // provider注入form上下文
    return (
        <FormProvider value={form}>
            <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    event.stopPropagation();
                    form.submit();
                }}>
                {children}
            </form>
        </FormProvider>
    );
});
