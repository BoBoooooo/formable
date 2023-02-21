import { makeObservable, observable, action, computed } from "mobx";
import { FieldStore } from "./field";

export class FormStore {
    @observable name: string;

    @observable fieldMap = new Map<string, FieldStore>();

    @observable initialValues: any;

    @observable values: any;

    onSubmit: any;

    constructor(options?: any) {
        console.log('初始化form', options);
        
        this.initialValues = options?.initialValues;
        this.values = this.initialValues || {};
        makeObservable(this);
    }

    initialize(initialData?: any){
        this.initialValues = initialData?.initialValues;
        this.onSubmit = initialData?.onSubmit;
    }

    registerField(name: string, initialData: any) {
        if(name){
            let field = this.fieldMap.get(name);
            if (field == null) {
                console.log('--registerField--', name, initialData, this.initialValues);
                
                field = new FieldStore(this, {
                    ...initialData,
                    // 优先读取全局表单默认值
                    initialValue: this.initialValues?.[name] ?? initialData?.initialValue
                });
                this.fieldMap.set(name, field);
            }
            return field;
        }
        return null;      
    }

    removeField(name: string, preserve: boolean = true) {
        preserve && this.fieldMap.delete(name);
    }

    @action
    setFieldValues(values: any) {
        Object.keys(values).forEach(fieldName=> {
            const v = values[fieldName];
            this.setFieldValue(fieldName, v);
        });
    }

    @action
    setFieldValue(name: string, value: any) {
        const field = this.fieldMap.get(name);
        if(field){
            field.setValue(value);
            this.values[name] = value;
        }
    }


    @action
    getFieldValues() {
        const values: any = {};
        this.fieldMap.forEach((field, key) => {
            // eslint-disable-next-line no-param-reassign
            values[key] = field.value;
        });
        // this.values = values;
        return values;
    }


    validateFields() {
        this.fieldMap.forEach((field: FieldStore) => field.validate());
    }

    submit(){
        return this.onSubmit?.(this.getFieldValues());
    }

    /**
    Clear Form Fields
  */
    @action
    clear(): void {
        this.fieldMap.forEach((field: FieldStore) => field.clear());
    }

    /**
    Reset Form Fields
  */
    @action
    reset(): void {
        this.fieldMap.forEach((field: FieldStore) => field.reset());
    }

    getInstance(){
        return {
            submit: this.submit,
            initialize: this.initialize
        };
    }
}

export const createForm = ()=>{
    return new FormStore();
};