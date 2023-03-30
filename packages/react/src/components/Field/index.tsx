import { DisplayType, DisplayTypeEnum, mergeNamePath as mergeNamePathUtil } from '@formable/core';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldProvider, useFieldStatus } from '../../context/field-instance';
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
    const { isArrayField, name: prefixName } = useFieldStatus() ?? {};

    // field can use single or use in arrayField
    // when in arrayField, will concat list name path
    const mergeNamePath = useMemo(
      () => (isArrayField ? mergeNamePathUtil(prefixName, name) : name),
      [prefixName, name]
    );

    // registerField to form
    const fieldStore = form.registerField(mergeNamePath, {
      initialValue,
      rules,
      required,
      display,
      listeners,
      validateStatus,
    });

    const mergeDisplay = useMemo<DisplayType>(
      () => fieldStore?.display ?? form.display,
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
        form.removeField(mergeNamePath, preserve);
      }
    }, [mergeDisplay, preserve]);

    useEffect(() => {
      return () => {
        form.removeField(mergeNamePath, preserve);
      };
    }, [mergeNamePath, preserve]);

    /**
     * 0. field is touched
     * 1. collect field value to formStore
     * 2. triggerValidate
     */
    const collectValue = useCallback(
      (e: any, triggerFlag: typeof trigger, componentProps) => {
        // setFieldTouched （onBlur & onChange）
        if (mergeNamePath) {
          form.setFieldTouched(mergeNamePath, true);
        }
        // collect value
        if (trigger === triggerFlag) {
          const v = getValueFromEvent?.(e) ?? e?.target?.value ?? e?.target?.checked ?? e;
          form.setFieldValue(mergeNamePath, v);
        }
        // trigger origin event
        componentProps?.[triggerFlag]?.(e);
        // trigger validate
        if (validateTrigger === triggerFlag && form.getFieldInstance(mergeNamePath)?.rules) {
          form.validateFields(mergeNamePath).catch(noop);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [mergeNamePath, trigger, validateTrigger, getValueFromEvent]
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
    }, [name, children, valuePropName, fieldStore?.value, trigger]);

    const Field = useMemo(() => {
      {
        const defaultDecorator = (
          <>
            {/* label */}
            {label && <label>{label}</label>}
            {/* component */}
            {controlledChildren}
          </>
        );

        const outDecorator = decorator?.[0] as React.ComponentType<any>;
        return isValidComponent(outDecorator)
          ? React.createElement(
              outDecorator,
              {
                label,
                // inject decorator props
                ...fieldStore?.layout,
              },
              controlledChildren
            )
          : defaultDecorator;
      }
    }, [label, controlledChildren, fieldStore?.layout]);

    // display hidden or none
    if ([DisplayTypeEnum.Hidden, DisplayTypeEnum.None].includes(mergeDisplay as DisplayTypeEnum)) {
      return null;
    }

    return <FieldProvider value={fieldStore}>{Field}</FieldProvider>;
  }
);
