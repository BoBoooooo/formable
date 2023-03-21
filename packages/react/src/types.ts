import { IListener } from '@formable/core';

export type IFieldProps = Partial<{
  component: string;
  componentProps: any;
  display: 'editable' | 'disabled' | 'preview';
  initialValue: any;
  name: string;
  preserve: boolean;
  valuePropName: string;
  label: React.ReactNode;
  trigger: string;
  rules: any[];
  required: boolean;
  validateTrigger: string | string[];
  decorator: [node: any, props?: any];
  listeners: IListener[];
  getValueFromEvent: (...args: any[]) => any;
}>;

export type IFormItemProps = Omit<IFieldProps, 'decorator'> & {
  decoratorProps?: any;
};
