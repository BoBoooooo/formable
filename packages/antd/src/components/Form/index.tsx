import React, { useEffect } from 'react';
import {
    FormStore
} from '@formable/core';
import {
    useForm,
    FormProvider,
} from '@formable/react';
import type { FormProps } from 'antd';
import { JSXComponent } from '../../types';
import { FormLayout } from '../FormLayout';

export interface FormableProps<Values = any> extends Omit<FormProps, 'form' |"onFinsih" | 'onFinsihFailed'> {
    form?: FormStore
    onSubmit?: (values: Values) => void;
    component?: JSXComponent
}

export const Form: React.FC<FormableProps> = ({
    form: outForm,
    component = 'form',
    initialValues,
    onSubmit,
    ...restProps
}) => {
    const [form] = useForm({ initialValues }, outForm);

    useEffect(() => {
        // onSubmit同步
        form.syncInitialize({
            onSubmit
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSubmit]);


    return (
        <FormProvider form={form}>
            <FormLayout {...restProps}>
                {React.createElement(
                    component,
                    {
                        onSubmit(e: React.FormEvent) {
                            e?.stopPropagation?.();
                            e?.preventDefault?.();
                            form.submit();
                        },
                    },
                    restProps.children
                )}
            </FormLayout>
        </FormProvider>
    );
};

export default Form;
