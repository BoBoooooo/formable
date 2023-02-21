import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { FormStore } from "@formable/core";
import { FormProvider } from "../../context/form-instance";
import { useForm } from "./useForm";

export const Form: React.FC<{
    form?: FormStore;
    initialValues?: Record<string, any>;
    onSubmit?: any;
}> = observer(({ children, initialValues, form: propForm, ...restProps }) => {
    const [form] = useForm({ initialValues }, propForm);

    useEffect(() => {
        form.syncInitialize(restProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restProps]);

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
