import { makeObservable, observable, action, computed } from "mobx";
import { FormStore } from "./form";
// import Schema from "async-validator";

export class FieldStore {
    @observable name: any;

    @observable value: any;

    @observable initialValue: any;

    @observable rules: any;

    @observable layout: Record<string, any>;

    private readonly form: FormStore;

    constructor(form: FormStore, data: any) {
        this.initialValue = data.initialValue;
        this.value = data.initialValue;
        this.name = data.name;
        this.form = form;
        makeObservable(this);
    }

    @action
    setValue(newValue: any) {
        this.value = newValue;
    }

    @action
    validate() {
        this.value = this.initialValue ?? null;
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
    initLayout(layout: typeof this.layout){
        this.layout = layout;
    }

    @action
    updateLayout(newLayout: typeof this.layout){
        this.layout = {
            ...this.layout,
            ...newLayout
        };
    }
}
