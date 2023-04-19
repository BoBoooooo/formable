import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { IArrayFieldProps } from '../../types';
import { FieldDisplayType, FieldDisplayTypeEnum } from '@formable/core';
import { FieldProvider } from '../../context/field-instance';
import { useFormInstance } from '../../context/form-instance';
import { isValidComponent } from '../../utils/helper';
import { useDeepCompareEffect } from '../../utils/useDeepCompareEffect';
import pick from 'lodash.pick';

export const ArrayField: React.FC<IArrayFieldProps> = observer(
  ({
    // component,
    // componentProps,
    preserve,
    name,
    initialValue,
    label,
    decorator,
    children,
    display,
    validateStatus,
    required,
    rules,
    listeners,
  }) => {
    const form = useFormInstance();

    const fieldStore = form.registerField(name, {
      initialValue: initialValue ?? [],
      rules,
      required,
      display,
      listeners,
      validateStatus,
      // 数组字段
      isArrayField: true,
    });

    // User should not pass `children` as other type.
    if (typeof children !== 'function') {
      console.warn('[formable]: ArrayField only accepts function as children.');
      return null;
    }

    const childrenDynamic =
      typeof children === 'function'
        ? children(fieldStore.children, pick(fieldStore, ['add', 'remove', 'move']))
        : children;

    const mergeDisplay = useMemo<FieldDisplayType>(
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
      if (mergeDisplay === FieldDisplayTypeEnum.None) {
        form.removeField(name, preserve);
      }
    }, [mergeDisplay, preserve]);

    useEffect(() => {
      return () => {
        form.removeField(name, preserve);
      };
    }, [name, preserve]);

    const ArrayField = useMemo(() => {
      {
        const defaultDecorator = (
          <>
            {/* label */}
            {label && <label>{label}</label>}
            {/* component */}
            {childrenDynamic}
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
              childrenDynamic
            )
          : defaultDecorator;
      }
    }, [label, fieldStore?.layout, childrenDynamic]);

    // display hidden or none
    if (
      [FieldDisplayTypeEnum.Hidden, FieldDisplayTypeEnum.None].includes(
        mergeDisplay as FieldDisplayTypeEnum
      )
    ) {
      return null;
    }

    return <FieldProvider value={fieldStore}>{ArrayField}</FieldProvider>;
  }
);
