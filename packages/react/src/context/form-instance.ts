import React, { useContext } from 'react';
import { FormStore } from '@formable/core';

export const FormContext = React.createContext<FormStore>(null);
export const FormProvider = FormContext.Provider;

// hook
export const useFormInstance = () => {
    return useContext(FormContext);
};