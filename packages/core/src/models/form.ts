// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { makeObservable, observable, action, toJS, reaction } from 'mobx';
import Schema, { ValidateOption } from 'async-validator';
import pick from 'lodash/pick';
import { compile } from 'expression-eval';
import {
  convertToRules,
  getValueByNamePath,
  mergeRules,
  parseArrayNamePathToString,
  setObserverable,
  setValueByNamePath,
} from '../utils/helper';
import { FieldStore } from './field';
import { ICondition, IRules, FormDisplayType, DisplayType } from '../types';

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

  registerField(name: string | any[], initialData: any) {
    if (name) {
      const fieldName = parseArrayNamePathToString(name);
      let field = this.fieldMap[fieldName];
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

  getFieldValues(names?: string[]) {
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
    const field = this.fieldMap[name];
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

  /**
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
      validator.validate(
        toJS(validateValues),
        { firstFields: true, ...options },
        (errors, fields) => {
          console.log('触发校验', errors, fields);
          if (errors) {
            // TODO: 收集到错误堆栈
            console.log('校验失败', errors, fields);
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

  /**
   * 注册联动
   */
  registerListener(
    sourceField: string,
    watchFields: string[],
    expression: ICondition,
    effect: any
  ) {
    reaction(
      // watch multiple fields
      () => {
        let orCondition: boolean;
        // FIXME: any other option ?
        Object.keys(this.values).forEach((k) => {
          if (watchFields.includes(k)) {
            orCondition = orCondition || this.values[k];
          }
        });
        return orCondition;
      },
      () => {
        let isEffect = !!expression;
        // trigger action
        if (typeof expression === 'undefined') {
          isEffect = true;
        } else if (typeof expression === 'function') {
          isEffect = expression(this);
        } else if (typeof expression === 'string') {
          isEffect = compile(expression)(this.fieldMap);
        }

        console.log('triggerAction', isEffect);

        const effectIsObjectType = Object.prototype.toString.call(effect) === '[object Object]';
        if (isEffect) {
          if (typeof effect === 'function') {
            effect(this);
          } else if (effectIsObjectType) {
            // TODO: 重构..
            if ('layout' in effect) {
              this.setFieldLayout(sourceField, effect.layout);
            }
            if ('rules' in effect || 'required' in effect) {
              this.setFieldRules(sourceField, mergeRules(effect.rules, effect.required));
            }
            if ('display' in effect) {
              this.setFieldDisplay(sourceField, effect.display);
            }
            if ('value' in effect) {
              this.setFieldValue(sourceField, effect.value);
            }
          } else {
            throw new Error('[Formable]: action should be typeof `function` or `object`');
          }
          // TODO: 恢复初始状态 ?
        } else if (this.fieldMap[sourceField] && effectIsObjectType) {
          this.fieldMap[sourceField].resetStatus();
        }
        this.fieldMap;
        return null;
      },
      // otherOptions
      {}
    );
  }

  // 回调onSubmit事件
  async submit() {
    // 校验表单
    await this.validateFields();
    return this.onSubmit?.(this.getFieldValues());
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
