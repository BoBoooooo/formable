
import React, { useContext } from 'react';
import { FieldStore } from '@formable/core';

type FieldStatus = Pick<FieldStore, 'errors'| 'warnings' | 'required'>;

export const FieldContext = React.createContext<FieldStatus>(null);
export const FieldProvider = FieldContext.Provider;

// hook
export const useFieldStatus = () => {
    return useContext(FieldContext);
};