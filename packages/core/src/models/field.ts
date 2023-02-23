import { makeObservable, observable, action, computed, toJS } from "mobx";
import Schema from "async-validator";
import { mergeRules } from "../utils/helper";
import { FormStore } from "./form";

export class FieldStore {
    name: any;

    initialValue: any;

    rules: any;

    layout: Record<string, any>;

    private readonly form: FormStore;

    constructor(form: FormStore, data: any) {
        this.form = form;
        this.name = data.name;
        this.initialValue = data.initialValue;
        // 校验 rules required拼接
        this.rules = mergeRules(data.rules , data.required);
        makeObservable(this, {
            layout: observable,
            name: observable,
            rules: observable,
            value: computed,
            validate: action,
            updateLayout: action,
            initLayout: action
        });
    }

    // @action
    // get required() {
    //     return this.rules.some((rule: any) => !!rule?.required);
    // }

    get value() {
        return this.form.getFieldValue(this.name);
    }

    set value(value) {
        this.form.setFieldValue(this.name, value);
    }


    validate() {
        const validator = new Schema({
            [this.name]: this.rules
        });
        validator.validate(
            {
                [this.name]: toJS(this.value),
            },
            { firstFields: true },
            (errors, fields) => {
                if (errors) {
                    // TODO: 收集到错误堆栈
                    console.log("错误列表", errors);
                }
            }
        );
    }

    reset() {
        this.value = this.initialValue ?? null;
    }

    clear() {
        this.value = null;
    }

    initLayout(layout: any) {
        this.layout = layout;
    }

    updateLayout(newLayout: any) {
        this.layout = {
            ...this.layout,
            ...newLayout,
        };
    }
}
