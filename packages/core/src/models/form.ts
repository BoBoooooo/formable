import { makeObservable, observable, action, computed } from "mobx";
import { FieldStore } from "./field";

export class FormStore {
    @observable name: string;

    @observable fieldMap = new Map<string, FieldStore>();

    @observable initialValues: any;

    onSubmit: any;

    constructor(initialData?: any) {
        makeObservable(this);
        
        this.initialValues = initialData?.initialValues;
        this.onSubmit = initialData?.onSubmit;

    }

    registerField(name: string, initialData: any) {
        if(name){
            let field = this.fieldMap.get(name);
            if (field == null) {
                console.log('--registerField--', name, initialData);
                
                field = new FieldStore({
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
    setValues(values: any) {
        this.fieldMap.forEach((field, key) => {
            // eslint-disable-next-line no-param-reassign
            field.value = values[key];
        });
    }

    getValues() {
        const values: any = {};
        this.fieldMap.forEach((field, key) => {
            // eslint-disable-next-line no-param-reassign
            values[key] = field.value;
        });
        return values;
    }

    validateFields() {
        this.fieldMap.forEach((field: FieldStore) => field.validate());
    }

    submit(){
        return this.onSubmit?.(this.getValues());
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
            submit: this.submit
        };
    }
}
