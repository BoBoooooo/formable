import { DisplayType, DisplayTypeEnum } from '@formable/core';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldProvider } from '../../context/field-instance';
import { useFormInstance } from '../../context/form-instance';
import { IFieldProps } from '../../types';
import { isValidComponent, noop } from '../../utils/helper';
import { useDeepCompareEffect } from '../../utils/useDeepCompareEffect';

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
    validateStatus,
    required,
    rules,
    listeners,
    getValueFromEvent,
  }) => {
    const form = useFormInstance();

    const fieldStore = form.registerField(name, {
      initialValue,
      rules,
      required,
      display,
      listeners,
      validateStatus,
    });

    const mergeDisplay = useMemo<DisplayType>(
      () => fieldStore?.display || form.display,
      [form.display, fieldStore?.display]
    );

    useDeepCompareEffect(() => {
      // 重置field.layout
      fieldStore?.setLayout(
        {
          ...decorator?.[1],
          label,
        },
        true
      );
    }, [decorator, label]);

    useEffect(() => {
      if (mergeDisplay === DisplayTypeEnum.None) {
        form.removeField(name, preserve);
      }
    }, [mergeDisplay, preserve]);

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

        const mergeProps = (componentProps: any) => ({
          ...componentProps,
          [valuePropName]: fieldStore.value,
          onChange: (e: any) => collectValue(e, 'onChange', componentProps),
          onBlur: (e: any) => collectValue(e, 'onBlur', componentProps),
        });

        if (React.isValidElement(controlledComponent)) {
          const { props } = children as any;
          return React.cloneElement(controlledComponent, mergeProps(props));
        }

        return React.createElement(controlledComponent as any, mergeProps(componentProps));
      }
      return null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, children, valuePropName, fieldStore?.value, trigger]);
    return (
      mergeDisplay !== DisplayTypeEnum.Hidden &&
      mergeDisplay !== DisplayTypeEnum.None && (
        <FieldProvider value={fieldStore}>
          {
            // render decorator
            isValidComponent(decorator?.[0]) ? (
              React.createElement(
                decorator?.[0] as any,
                {
                  label,
                  // inject decorator props
                  ...fieldStore?.layout,
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
      )
    );
  }
);
