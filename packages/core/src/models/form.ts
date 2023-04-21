import { parseStringNamePathToArray, toArray } from './../utils/helper';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { makeObservable, observable, action, toJS } from 'mobx';
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
import {
  ICondition,
  IRules,
  FormDisplayType,
  FieldDisplayType,
  NamePath,
  IRegisterFormParams,
} from '../types';
import { genListenerReaction } from './reaction';
import { IRegisterFieldParams } from '../types';
import { logRegisterInfo } from '../utils/log';

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

  constructor(options?: IRegisterFormParams) {
    this.initialValues = options?.initialValues;
    this.values = this.initialValues || {};
    this.components = options?.components;
    makeObservable(this);
  }

  // 更新部分数据
  syncInitialize(initialData?: any) {
    this.onSubmit = initialData?.onSubmit;
  }

  registerField(name: NamePath, initialData: IRegisterFieldParams) {
    if (name) {
      const fieldName = parseArrayNamePathToString(name);
      let field = this.getFieldInstance(name);
      if (field == null) {
        const { initialValue, isListField } = initialData ?? {};
        let initialValueComputed = initialValue;
        const arrayNamePath = toArray(name);

        // FIXME: 待优化
        // list field情况 数组对象时
        // [items, 0, name] 情况时每一行的新增初始值读取 newRecord[name]
        if (isListField && arrayNamePath.length === 3) {
          initialValueComputed = getValueByNamePath(toArray(name).slice(-1), initialValue);
        } else {
          // 优先读取全局表单默认值
          initialValueComputed = getValueByNamePath(name, this.initialValues) ?? initialValue;
        }

        const fieldParams = {
          name,
          ...initialData,
          initialValue: initialValueComputed,
        };
        logRegisterInfo(fieldParams);

        field = new FieldStore(this, fieldParams);
        this.fieldMap[fieldName] = field;
        // 同步初始值至form.values
        this.setFieldValue(name, initialValueComputed);
      }
      return field;
    }
    return null;
  }

  // 获取字段实例
  getFieldInstance(name: NamePath) {
    const fieldName = parseArrayNamePathToString(name);
    return this.fieldMap[fieldName];
  }

  removeField(name: NamePath, preserve = false) {
    const fieldName = parseArrayNamePathToString(name);
    delete this.fieldMap[fieldName];
    if (!preserve) {
      delete this.values[fieldName];
    }
  }

  getFieldValue(name: NamePath) {
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
  setFieldValue(name: NamePath, value: any) {
    const field = this.getFieldInstance(name);
    if (field) {
      if (parseStringNamePathToArray(name).length > 1) {
        this.values = setValueByNamePath(name, value, this.values);
      } else {
        setObserverable(this.values, name, value);
      }
    }
  }

  setFieldRules(name: NamePath, newRules: any) {
    const fieldName = parseArrayNamePathToString(name);
    if (this.fieldMap[fieldName]) {
      this.fieldMap[fieldName].rules = newRules;
    }
  }

  setFieldLayout(name: NamePath, newLayout: Record<string, any>) {
    const fieldName = parseArrayNamePathToString(name);
    this.fieldMap[fieldName]?.setLayout(newLayout);
  }

  setFieldDisplay(name: NamePath, newDisplay: FieldDisplayType) {
    const fieldName = parseArrayNamePathToString(name);
    if (this.fieldMap[fieldName]) {
      this.fieldMap[fieldName].display = newDisplay;
    }
  }

  setFieldTouched(name: NamePath, isTouched: boolean) {
    const fieldName = parseArrayNamePathToString(name);
    if (this.fieldMap[fieldName]) {
      this.fieldMap[fieldName].touched = isTouched;
    }
  }

  /**
   * TODO: 需要支持下 name传多个字段的情况
   * 校验字段
   * @param name 校验字段 缺省则校验全部
   * @param options async-validator options
   * @returns Promise
   */
  validateFields(name?: NamePath, options?: ValidateOption) {
    const fieldName = parseArrayNamePathToString(name);
    const validateSchema = fieldName ? pick(this.rules, [fieldName]) : convertToRules(this.rules);
    const validateValues = fieldName
      ? { [fieldName]: getValueByNamePath(fieldName, this.values) }
      : this.values;
    // schema需要做下转换 TODO: 暂不支持a[0].b.c的处理，考虑直接平铺字段挨个校验?
    const validator = new Schema(validateSchema);
    console.log('validator', validator);

    return new Promise((resolve, reject) => {
      // 单字段校验时触发
      const fieldInstance = this.getFieldInstance(fieldName);
      if (fieldInstance) {
        fieldInstance.validating = true;
      }
      validator.validate(
        toJS(validateValues),
        { firstFields: true, ...options },
        (errors, fields) => {
          console.log('触发校验', errors, fields);
          if (fieldInstance) {
            fieldInstance.validating = false;
          }
          if (errors) {
            // 收集到错误堆栈 & 判断是warning还是error
            console.log('校验失败', errors, fields);
            Object.keys(fields).forEach((errorFieldName) => {
              const validateType = this.fieldMap[errorFieldName]?.validateStatus;
              if (validateType === 'warning') {
                setObserverable(this.warnings, errorFieldName, fields[errorFieldName]);
              }
              if (validateType === 'error') {
                setObserverable(this.errors, errorFieldName, fields[errorFieldName]);
              }
            });
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              fields,
              errors,
            });
          } else {
            // 校验通过 清空errors warnings
            // 如果指定校验某字段则只清空当前字段
            if (fieldName) {
              delete this.errors[fieldName];
              delete this.warnings[fieldName];
            } else {
              this.errors = {};
              this.warnings = {};
            }
            resolve(fields);
          }
        }
      );
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

export const createForm = (options?: IRegisterFormParams) => {
  return new FormStore(options);
};
