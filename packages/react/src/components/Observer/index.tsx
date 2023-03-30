import React from 'react';
import { observer } from 'mobx-react-lite';
import { useFormInstance } from '../../context/form-instance';
import { IFormObserverProps } from '../../types';

export const FormObserver: React.FC<IFormObserverProps> = observer((props) => {
  const form = useFormInstance();

  const children = typeof props.children === 'function' ? props.children(form.values) : null;
  return <>{children}</>;
});

FormObserver.displayName = 'FormObserver';
