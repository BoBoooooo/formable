import type {
  FieldStore,
  FormStore,
  IListener,
  NamePath,
  ValidateStatus,
  FieldDisplayType,
} from '@formable/core';
import type { FormItemProps } from 'antd';

export type IFieldProps = Partial<{
  component: string;
  componentProps: any;
  display: FieldDisplayType;
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
  isListField: boolean;
  getValueFromEvent: (...args: any[]) => any;
}>;

export type IArrayFieldProps = Partial<{
  display: FieldDisplayType;
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
    fields: (Pick<IFieldProps, 'name' | 'isListField' | 'initialValue'> & { key: React.Key })[],
    operations: {
      add: FieldStore['add'];
      remove: FieldStore['remove'];
    }
  ) => React.ReactChild | React.ReactNode;
}>;

export type IFormItemProps = Omit<IFieldProps, 'decorator'> & FormItemProps;

export interface IFormObserverProps {
  children?: (form: FormStore['values']) => React.ReactChild;
}
