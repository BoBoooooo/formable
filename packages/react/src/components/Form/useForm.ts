import { FormStore } from '@formable/core';
import React from 'react';

// 待拓展
// type ExposedAPI = Pick<FormStore, "submit" | "initialize">;
// TODO: TS待补充
export function useForm(options?: any, initForm?: FormStore): [FormStore] {
  const formRef = React.useRef<FormStore>(initForm);
  if (!formRef.current) {
    formRef.current = new FormStore(options);
  }
  if (formRef.current instanceof FormStore === false)
    throw new Error('form instance must created by createForm or useForm');
  return [formRef.current];
}
