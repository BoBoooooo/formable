import { observer } from "mobx-react-lite";
import React  from "react";
import { FormStore } from "@formable/core";
import { FormProvider as  FromContext } from "../../context/form-instance";

export const FormProvider: React.FC<{
    form: FormStore;
}> = observer(({ children, form}) => {
    // provider注入form上下文
    return (
        <FromContext value={form}>
            {children}
        </FromContext>
    );
});
