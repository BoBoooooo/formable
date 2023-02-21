import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useMemo } from "react";
import { useFormInstance } from "../../context/form-instance";
import { isValidComponent } from "../../utils/helper";

export const Field: React.FC<Partial<{
    initialValue: any;
    name: string;
    preserve: boolean;
    valuePropName: string;
    label: React.ReactNode;
    trigger: string;
    decorator: [node: any, props?: any];
}>> = observer(
    ({
        preserve,
        name,
        initialValue,
        label,
        decorator,
        children,
        valuePropName = "value",
        trigger = "onChange",
    }) => {
        const form = useFormInstance();
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
                            form.setFieldValue(name, e?.target?.value ?? e);
                        },
                    })
                    : children;
            }
            return null;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [name, children, valuePropName, fieldStore?.value, trigger]);

        
        return (
            <div className="item-wrapper">
                {/* decorator */}
                {
                    isValidComponent(decorator?.[0]) ?  React.createElement(decorator?.[0] as any, {
                        label,
                        ...decorator?.[1]
                    }, chlidrenRender): (
                        <>
                            {label}  
                            {/* 输入控件 */}
                            {chlidrenRender}
                        </>
                    )
                }
              
            </div>
        );
    }
);
