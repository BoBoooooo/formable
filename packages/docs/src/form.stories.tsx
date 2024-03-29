import React from 'react';
import { Demo, Listener, FormableItem, ArrayDemo as Array } from './demo';

export default {
  title: 'Form',
};

export const BasicDemo = () => {
  return <Demo />;
};

export const ListenerDemo = () => {
  return <Listener />;
};
export const FormItemDemo = () => {
  return <FormableItem />;
};

export const ArrayDemo = () => {
  return <Array />;
};
