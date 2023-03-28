// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { makeObservable, observable, action, toJS, IReactionDisposer } from 'mobx';
import Schema, { ValidateOption } from 'async-validator';
import pick from 'lodash/pick';
import {
  convertToRules,
  getValueByNamePath,
  parseArrayNamePathToString,
  setObserverable,
  setValueByNamePath,
} from '../utils/helper';
import { FieldStore } from './field';
import { ICondition, IRules, FormDisplayType, DisplayType } from '../types';
import { genListenerReaction } from './reaction';

export class FormStore {
  @observable name: string;

  @observable display: FormDisplayType;

  @observable fieldMap: Record<string, FieldStore> = {};

  @observable initialValues: any;

  @observable values: any;

  @observable errors: IRules = {};

  @observable warnings: IRules = {};

  @observable successes: IRules = {};

  @observable rules: IRules = {};

  onSubmit: any;

  components: Record<string, React.FunctionComponent<any> | React.ComponentClass<any, any>>;

  constructor(options?: any) {
    this.initialValues = options?.initialValues;
    this.values = this.initialValues || {};
    this.components = options?.components;
    makeObservable(this);
  }

  // 更新部分数据
  syncInitialize(initialData?: any) {
    this.onSubmit = initialData?.onSubmit;
  }

  // TODO: initData 定义待补充
  registerField(name: string | any[], initialData: any) {
    if (name) {
      const fieldName = parseArrayNamePathToString(name);
      let field = this.getFieldInstance(fieldName);
      if (field == null) {
        // 优先读取全局表单默认值
        const intialValue =
          getValueByNamePath(fieldName, this.initialValues) ?? initialData?.initialValue;
        console.log('--registerField--', fieldName, intialValue, initialData);

        field = new FieldStore(this, {
          name,
          ...initialData,
          initialValue: intialValue,
        });
        this.fieldMap[fieldName] = field;

        // 同步初始值至form.values
        this.setFieldValue(fieldName, intialValue);
      }
      return field;
    }
    return null;
  }

  // 获取字段实例
  getFieldInstance(name: string | any[]) {
    const fieldName = parseArrayNamePathToString(name);
    return this.fieldMap[fieldName];
  }

  removeField(name: string, preserve = false) {
    // removeField
    delete this.fieldMap.name;
    if (!preserve) {
      delete this.values[name];
    }
  }

  getFieldValue(name: string) {
    return toJS(getValueByNamePath(name, this.values));
  }

  getFieldsValue(names?: string[]) {
    if (names) {
      return toJS(pick(this.values, names));
    }
    return toJS(this.values);
  }

  setFieldValues(values: any) {
    Object.keys(values).forEach((fieldName) => {
      const v = values[fieldName];
      this.setFieldValue(fieldName, v);
    });
  }

  @action
  setFieldValue(name: string, value: any) {
    const field = this.getFieldInstance(name);
    if (field) {
      if (parseArrayNamePathToString(name).length > 1) {
        this.values = setValueByNamePath(name, value, this.values);
      } else {
        setObserverable(this.values, name, value);
      }
    }
  }

  setFieldRules(name: string, newRules: any) {
    if (this.fieldMap[name]) {
      this.fieldMap[name].rules = newRules;
    }
  }

  setFieldLayout(name: string, newLayout: Record<string, any>) {
    this.fieldMap[name]?.setLayout(newLayout);
  }

  setFieldDisplay(name: string, newDisplay: DisplayType) {
    if (this.fieldMap[name]) {
      this.fieldMap[name].display = newDisplay;
    }
  }

  setFieldTouched(name: string, isTouched: boolean) {
    if (this.fieldMap[name]) {
      this.fieldMap[name].touched = isTouched;
    }
  }

  /**
   * TODO: 需要支持下 name传多个字段的情况
   * 校验字段
   * @param name 校验字段 缺省则校验全部
   * @param options async-validator options
   * @returns Promise
   */
  validateFields(name?: string, options?: ValidateOption) {
    const validateSchema = name ? pick(this.rules, [name]) : this.rules;
    const validateValues = name ? { [name]: getValueByNamePath(name, this.values) } : this.values;
    // schema需要做下转换 暂不支持a[0].b.c的处理，考虑直接平铺字段挨个校验?
    const validator = new Schema(name ? validateSchema : convertToRules(validateSchema));
    console.log('validator', validator);

    return new Promise((resolve, reject) => {
      // 单字段校验时触发
      const fieldInstance = this.getFieldInstance(name);
      if (fieldInstance) {
        fieldInstance.validating = true;
      }
      validator.validate(validateValues, { firstFields: true, ...options }, (errors, fields) => {
        console.log('触发校验', errors, fields);
        if (fieldInstance) {
          fieldInstance.validating = false;
        }
        if (errors) {
          // 收集到错误堆栈 & 判断是warning还是error
          console.log('校验失败', errors, fields);
          Object.keys(fields).forEach((fieldName) => {
            const validateType = this.fieldMap[fieldName]?.validateStatus;
            if (validateType === 'warning') {
              this.warnings[fieldName] = fields[fieldName];
            }
            if (validateType === 'error') {
              this.errors[fieldName] = fields[fieldName];
            }
          });

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
      });
    });
  }

  /**
   * 注册联动
   */
  registerListener(
    sourceField: string,
    watchFields: string[],
    expression: ICondition,
    effect: any
  ) {
    return genListenerReaction(sourceField, watchFields, expression, effect, this);
  }

  // submit form
  async submit() {
    // validate form
    await this.validateFields();
    const formValues = this.getFieldsValue();
    if (typeof this.onSubmit === 'function') {
      this.onSubmit(formValues);
    }
    return formValues;
  }

  @action
  clear(): void {
    Object.values(this.fieldMap).forEach((field: FieldStore) => field.clear());
  }

  @action
  reset(): void {
    Object.values(this.fieldMap).forEach((field: FieldStore) => field.reset());
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
