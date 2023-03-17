import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldProvider } from '../../context/field-instance';
import { useFormInstance } from '../../context/form-instance';
import { isValidComponent, noop } from '../../utils/helper';
import { useDeepCompareEffect } from '../../utils/useDeepCompareEffect';

type IFieldProps = Partial<{
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
  getValueFromEvent: (...args: any[]) => any;
}>;

export const Field: React.FC<IFieldProps> = observer(
  ({
    component,
    componentProps,
    preserve,
    name,
    initialValue,
    label,
    decorator,
    children,
    display,
    valuePropName = 'value',
    trigger = 'onChange',
    validateTrigger = 'onChange',
    required,
    rules,
    getValueFromEvent,
  }) => {
    const form = useFormInstance();
    const fieldStore = form.registerField(name, {
      initialValue,
      rules,
      required,
      display,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mergeDisplay = useMemo(
      () => form.display || fieldStore?.display,
      [form.display, fieldStore?.display]
    );

    useDeepCompareEffect(() => {
      // 重置field.layout
      fieldStore?.initLayout({
        ...decorator?.[1],
        label,
      });
    }, [decorator, label]);

    useEffect(() => {
      return () => {
        form.removeField(name, preserve);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, preserve]);

    /**
     * 1. collect field value to formStore
     * 2. triggerValidate
     */
    const collectValue = useCallback(
      (e: any, triggerFlag: typeof trigger, componentProps) => {
        // collect value
        if (trigger === triggerFlag) {
          const v = getValueFromEvent?.(e) ?? e?.target?.value ?? e?.target?.checked ?? e;
          form.setFieldValue(name, v);
        }
        // trigger origin event
        componentProps?.[triggerFlag]?.(e);
        // trigger validate
        if (validateTrigger === triggerFlag && form.rules[name]) {
          form.validateFields(name).catch(noop);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [name, trigger, validateTrigger, getValueFromEvent]
    );

    const controlledChildren = useMemo(() => {
      // 没有name则直接return
      if (!name) {
        return children;
      }
      const controlledComponent = children || form.components?.[component];
      // 自定义组件
      if (controlledComponent) {
        /**
         * 不支持下述写法
         * <Field>
         *      <Input />
         *      <Input />
         * </Field>
         */
        // TODO: getOnlyChild
        if (React.isValidElement(controlledComponent)) {
          const { props } = children as any;
          return React.cloneElement(controlledComponent, {
            [valuePropName]: fieldStore.value,
            onChange: (e: any) => collectValue(e, 'onChange', props),
            onBlur: (e: any) => collectValue(e, 'onBlur', props),
          } as any);
        }

        return React.createElement(controlledComponent as any, componentProps);
      }
      return null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, children, valuePropName, fieldStore?.value, trigger]);

    return (
      <FieldProvider value={fieldStore}>
        {
          // render decorator
          isValidComponent(decorator?.[0]) ? (
            React.createElement(
              decorator?.[0] as any,
              {
                label,
                // inject decorator props
                ...fieldStore.layout,
              },
              controlledChildren
            )
          ) : (
            // default render
            <>
              {/* label */}
              {label && <label>{label}</label>}
              {/* component */}
              {controlledChildren}
            </>
          )
        }
      </FieldProvider>
    );
  }
);
