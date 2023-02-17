import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import { useFormStore } from "../../context/form-instance";
import { isSystemType } from "../../utils/helper";

export const Field: React.FC<Partial<{
    initialValue: Record<string, any>;
    name: string;
    preserve: boolean;
    valuePropName: string;
    trigger: string;
    label: React.ReactNode;
}>> = observer(
    ({
        preserve,
        name,
        initialValue,
        label,
        children,
        valuePropName = "value",
        trigger = "onChange",
    }) => {
        const form = useFormStore();
        const fieldStore = form.registerField(name, { initialValue });

        useEffect(() => {
            return () => {
                form.removeField(name, preserve);
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [name, preserve]);

        const chlidrenRender = useMemo(() => {
            // 没有name则直接return
            if (!name) {
                return children;
            }
            // 自定义组件
            if (children) {
                /**
         * 不支持下述写法
         * <Field>
         *  <Input />
         *  <Input />
         * </Field>
         */
                name &&
          React.Children.count(children) > 1 &&
          console.warn(`[formable] ${name}字段，仅支持传入一个控件，请检查!`);
                return React.isValidElement(children) &&
          // 原生dom直接返回
          !isSystemType(children)
                    ? // 此处默认XFormItem传入的为控件
                    React.cloneElement(children, {
                        // TODO: valuePropName
                        // getValueFromEvent
                        [valuePropName]: fieldStore.value,
                        [trigger]: (e: any) => {
                            fieldStore.setValue(e?.target?.value ?? e);
                        },
                    })
                    : children;
            }
            return null;
        }, [name, children, valuePropName, fieldStore, trigger]);

        // provider注入form上下文
        return (
            <div className="item-wrapper">
                {/* Label布局 */}
                {label}
                {/* 输入控件 */}
                {chlidrenRender}
            </div>
        );
    }
);
