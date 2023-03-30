import type { FieldStore, FormStore, IListener, NamePath, ValidateStatus } from '@formable/core';

export type IFieldProps = Partial<{
  component: string;
  componentProps: any;
  display: 'editable' | 'disabled' | 'preview';
  initialValue: any;
  name: NamePath;
  preserve: boolean;
  valuePropName: string;
  validateStatus: ValidateStatus;
  label: React.ReactNode;
  trigger: string;
  rules: any[];
  required: boolean;
  validateTrigger: string | string[];
  decorator: [node: any, props?: any];
  listeners: IListener[];
  getValueFromEvent: (...args: any[]) => any;
}>;

export type IArrayFieldProps = Partial<{
  display: 'editable' | 'disabled' | 'preview';
  initialValue: any;
  name: NamePath;
  preserve: boolean;
  validateStatus: ValidateStatus;
  label: React.ReactNode;
  rules: any[];
  required: boolean;
  decorator: [node: any, props?: any];
  listeners: IListener[];
  children: (
    fields: FieldStore[],
    operations: {
      add: FieldStore['add'];
      remove: FieldStore['remove'];
    }
  ) => React.ReactChild | React.ReactNode;
}>;

export type IFormItemProps = Omit<IFieldProps, 'decorator'> & {
  decoratorProps?: any;
};

export interface IFormObserverProps {
  children?: (form: FormStore['values']) => React.ReactChild;
}
