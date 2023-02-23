import { makeObservable, observable, action, computed, toJS } from "mobx";
import { setObserverable } from "../utils/helper";
import { FieldStore } from "./field";

export class FormStore {
    @observable name: string;

    @observable fieldMap = new Map<string, FieldStore>();

    @observable initialValues: any;

    @observable values: any;

    onSubmit: any;

    constructor(options?: any) {
        this.initialValues = options?.initialValues;
        this.values = this.initialValues || {};
        makeObservable(this);
    }

    // 更新部分数据
    syncInitialize(initialData?: any) {
        this.onSubmit = initialData?.onSubmit;
    }

    registerField(name: string, initialData: any) {
        if (name) {
            let field = this.fieldMap.get(name);
            if (field == null) {
                console.log("--registerField--", name, initialData);
                // 优先读取全局表单默认值
                const intialValue =
            this.initialValues?.[name] ?? initialData?.initialValue;
                field = new FieldStore(this, {
                    name,
                    ...initialData,
                    initialValue: intialValue,
                });
                this.fieldMap.set(name, field);

                // 同步初始值至form.values
                this.setFieldValue(name, intialValue);
            }
            return field;
        }
        return null;
    }

    removeField(name: string, preserve: boolean = true) {
        preserve && this.fieldMap.delete(name);
    }

    setFieldValues(values: any) {
        Object.keys(values).forEach((fieldName) => {
            const v = values[fieldName];
            this.setFieldValue(fieldName, v);
        });
    }

    @action
    setFieldValue(name: string, value: any) {
        const field = this.fieldMap.get(name);
        if (field) {
            setObserverable(this.values, name, value);
        }
    }

    getFieldValue(name: string) {
        return toJS(this.values[name]);
    }

    getFieldValues() {
        return toJS(this.values);
    }

    validateFields() {
        this.fieldMap.forEach((field: FieldStore) => field.validate());
    }

    // 回调onSubmit事件
    submit() {
        return this.onSubmit?.(this.getFieldValues());
    }

    @action
    clear(): void {
        this.fieldMap.forEach((field: FieldStore) => field.clear());
    }

    @action
    reset(): void {
        this.fieldMap.forEach((field: FieldStore) => field.reset());
    }

    updateFieldLayout(name: string, newLayout: Record<string, any>) {
        this.fieldMap.get(name).updateLayout(newLayout);
    }

    getInstance() {
        return {
            submit: this.submit,
        };
    }
}

export const createForm = (options?: any) => {
    return new FormStore(options);
};
