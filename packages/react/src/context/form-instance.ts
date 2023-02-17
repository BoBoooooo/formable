import { Form } from '@formable/core';
import React, { useContext } from 'react';

export const FormContext = React.createContext<Form>(null);
export const FormProvider = FormContext.Provider;

// hook
export const useFormStore = () => {
    return useContext(FormContext);
};