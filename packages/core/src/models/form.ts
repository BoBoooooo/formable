// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { makeObservable, observable, action, toJS, reaction } from 'mobx';
import Schema, { ValidateOption } from 'async-validator';
import pick from 'lodash/pick';
import { compile } from 'expression-eval';
import { setObserverable } from '../utils/helper';
import { FieldStore } from './field';
import { ICondition, IRules } from '../types';

export class FormStore {
  @observable name: string;

  @observable display: 'editable' | 'disabled' | 'preview';

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

  registerField(name: string, initialData: any) {
    if (name) {
      let field = this.fieldMap[name];
      if (field == null) {
        console.log('--registerField--', name, initialData);
        // 优先读取全局表单默认值
        const intialValue = this.initialValues?.[name] ?? initialData?.initialValue;
        field = new FieldStore(this, {
          name,
          ...initialData,
          initialValue: intialValue,
        });
        this.fieldMap[name] = field;

        // 同步初始值至form.values
        this.setFieldValue(name, intialValue);
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
      setObserverable(this.values, name, value);
    }
  }

  getFieldValue(name: string) {
    return toJS(this.values[name]);
  }

  getFieldValues(names?: string[]) {
    if (names) {
      return toJS(pick(this.values, names));
    }
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
      validator.validate(toJS(_values), { firstFields: true, ...options }, (errors, fields) => {
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
      });
    });
  }

  /**
   * 注册联动
   */
  registerListener(watchFields: string[], expression: ICondition, effect: any) {
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
        console.log('triggerAction');
        let isEffect = !!expression;
        // trigger action
        if (typeof expression === 'function') {
          isEffect = expression(this);
        } else if (typeof expression === 'string') {
          isEffect = compile(expression)(this.fieldMap);
        }
        if (isEffect) {
          if (typeof action === 'function') {
            return effect(this);
          }
          throw new Error('[Formable]: action should be typeof `function`');
        }
        return null;
      },
      // otherOptions
      {}
    );
  }

  // 回调onSubmit事件
  submit() {
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

  updateFieldLayout(name: string, newLayout: Record<string, any>) {
    this.fieldMap[name]?.updateLayout(newLayout);
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
