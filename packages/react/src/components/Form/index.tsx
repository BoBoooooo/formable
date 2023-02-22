import { observer } from "mobx-react-lite";
import React  from "react";
import { FormStore } from "@formable/core";
import { FormProvider as  FromContext } from "../../context/form-instance";
import { useForm } from "./useForm";

export const FormProvider: React.FC<{
    form?: FormStore;
}> = observer(({ children, form}) => {
    const [innerForm] = useForm(form);
    // provider注入form上下文
    return (
        <FromContext value={innerForm}>
            {children}
        </FromContext>
    );
});
