import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import { useFormStore } from "../../context/form-instance";

export const Field: React.FC<Partial<{
    initialValue: any;
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
        console.log("fieldStore", fieldStore);

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
                 *      <Input />
                 *      <Input />
                 * </Field>
                 */

                return React.isValidElement(children)
                    ? React.cloneElement(children, {
                        [valuePropName]: fieldStore.value,
                        [trigger]: (e: any) => {
                            fieldStore.setValue(e?.target?.value ?? e);
                        },
                    })
                    : children;
            }
            return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [name, children, valuePropName, fieldStore?.value, trigger]);

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
