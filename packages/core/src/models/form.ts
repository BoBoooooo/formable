import { makeObservable, observable, action, computed, toJS } from "mobx";
import Schema, { ValidateOption } from "async-validator";
import pick from "lodash/pick";
import { setObserverable } from "../utils/helper";
import { FieldStore } from "./field";
import { IRules } from "../types";

export class FormStore {
    @observable name: string;

    @observable display: "editable" | "disabled" | "preview";

    @observable fieldMap = new Map<string, FieldStore>();

    @observable initialValues: any;

    @observable values: any;

    @observable errors: IRules = {};

    @observable warnings: IRules = {};

    @observable successes: IRules = {};

    @observable rules: IRules = {};

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

    removeField(name: string, preserve = true) {
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

    /**
   * 校验字段
   * @param name 校验字段 缺省则校验全部
   * @param options async-validator options
   * @returns Promise
   */
    validateFields(name?: string, options?: ValidateOption) {
        const validator = new Schema(pick(this.rules, [name]));
        const _values = pick(this.values, [name]);

        return new Promise((resolve, reject) => {
            validator.validate(
                toJS(_values),
                { firstFields: true, ...options },
                (errors, fields) => {
                    console.log("触发校验", errors, fields);
                    if (errors) {
                        // TODO: 收集到错误堆栈
                        console.log("校验失败", errors, fields);
                        this.errors = fields;
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject({
                            fields,
                            errors,
                        });
                    } else {
                        this.errors = {};
                        this.warnings = {};
                        resolve(fields);
                    }
                }
            );
        });
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
