import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormStore } from '@formable/core';
import { useFormInstance } from '../../context/form-instance';

export interface IFormObserverProps {
  children?: (form: FormStore['values']) => React.ReactChild;
}

export const FormObserver: React.FC<IFormObserverProps> = observer((props) => {
  const form = useFormInstance();

  const children = typeof props.children === 'function' ? props.children(form.values) : null;
  return <>{children}</>;
});

FormObserver.displayName = 'FormObserver';
