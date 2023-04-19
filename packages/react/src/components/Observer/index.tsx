import React from 'react';
import { IFormObserverProps } from '../../types';
import { observer } from 'mobx-react-lite';
import { useFormInstance } from '../../context/form-instance';

export const FormObserver: React.FC<IFormObserverProps> = observer((props) => {
  const form = useFormInstance();

  const children = typeof props.children === 'function' ? props.children(form.values) : null;
  return <>{children}</>;
});

FormObserver.displayName = 'FormObserver';
