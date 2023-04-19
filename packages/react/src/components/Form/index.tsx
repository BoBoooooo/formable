import React from 'react';
import type { FormStore } from '@formable/core';
import { observer } from 'mobx-react-lite';
import { FormGlobalProvider } from '../../context/form-instance';

export const FormProvider: React.FC<{
  form: FormStore;
}> = observer(({ children, form }) => {
  // provider注入form上下文
  return <FormGlobalProvider value={form}>{children}</FormGlobalProvider>;
});
