import React, { useContext } from 'react';
import { FieldStore } from '@formable/core';

export const FieldContext = React.createContext<FieldStore>(null);
export const FieldProvider = FieldContext.Provider;

// hook
export const useFieldStatus = () => {
  return useContext(FieldContext);
};
