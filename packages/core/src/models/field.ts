import { makeObservable, observable, action, computed } from "mobx";
import Schema from "async-validator";

export class Field {
    @observable name: any;

    @observable value: any;

    @observable initialValue: any;

    @observable rules: any;

    constructor(data: any) {
        this.initialValue = data.initialValue;
        this.value = data.initialValue;
        this.name = data.name;
        makeObservable(this);
    }

    @action
    setValue(newValue: any){
        console.log('setValue', newValue);
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
}
