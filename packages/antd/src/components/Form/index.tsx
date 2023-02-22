import React, { Fragment, useEffect } from 'react';
import {
    FormStore
} from '@formable/core';
import {
    useForm,
    FormProvider,
} from '@formable/react';
import type { FormProps } from 'antd';
import { JSXComponent } from '../../types';

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


    // eslint-disable-next-line no-shadow
    const renderContent = () => (
        <Fragment {...restProps}>
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
        </Fragment>
    );
    return <FormProvider form={form}>{renderContent()}</FormProvider>;
};

export default Form;
