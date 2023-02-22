import { makeObservable, observable, action, computed, toJS } from "mobx";
import Schema from "async-validator";
import { mergeRules } from "../utils/helper";
import { FormStore } from "./form";

export class FieldStore {
    @observable name: any;

    @observable value: any;

    @observable initialValue: any;

    @observable rules: any;

    @observable layout: Record<string, any>;

    private readonly form: FormStore;

    constructor(form: FormStore, data: any) {
        this.form = form;
        this.name = data.name;
        this.initialValue = data.initialValue;
        this.value = data.initialValue;
        // 校验 rules required拼接
        this.rules = mergeRules(data.rules , data.required);
        makeObservable(this);
    }

    // @action
    // get required() {
    //     return this.rules.some((rule: any) => !!rule?.required);
    // }

    @action
    setValue(newValue: any) {
        this.value = newValue;
    }

    @action
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

    @action
    reset() {
        this.value = this.initialValue ?? null;
    }

    @action
    clear() {
        this.value = null;
    }

    @action
    initLayout(layout: typeof this.layout) {
        this.layout = layout;
    }

    @action
    updateLayout(newLayout: typeof this.layout) {
        this.layout = {
            ...this.layout,
            ...newLayout,
        };
    }
}
