import { parseArrayNamePathToString } from './../utils/helper';
import { makeObservable, observable, action, computed } from 'mobx';
import { DisplayType, ValidateStatus, NamePath } from '../types';
import { mergeRules, setObserverable } from '../utils/helper';
import { FormStore } from './form';
import { ReactionQueue } from './reaction';

export class FieldStore {
  /**
   * @desc fieldStore中name 转为字符串
   * @example
   * a.b.c  a  a[0].b.c
   */
  name: NamePath;

  initialValue: any;

  touched: boolean;

  validating: boolean;

  display: DisplayType = 'edit';

  layout: Record<string, any>;

  validateStatus: ValidateStatus;

  // 存储field初始状态
  initialStatus: Record<string, any> = {};

  reactionQueue: ReactionQueue;

  // 数组类型字段
  isArrayField: boolean;

  // 是否为ArrayField 子Field
  isListField: boolean;

  // 子Field
  children: any[] = [];

  key = 0;

  readonly form: FormStore;

  constructor(form: FormStore, data: any) {
    this.form = form;
    this.name = data.name;
    this.initialValue = data.initialValue;
    this.validateStatus = data.validateStatus ?? 'error';
    this.display = data.display ?? 'edit';
    this.initialStatus = {
      name: data.name,
      initialValue: this.initialValue,
      display: this.display,
    };
    // item rule register to form
    if (data.rules || data.required) {
      const localRules = mergeRules(data.rules, data.required);
      setObserverable(this.form.rules, this.name, localRules);
      this.initialStatus.rules = localRules;
    }

    // register reaction
    if (Array.isArray(data.listeners) && data.listeners.length) {
      this.reactionQueue = new ReactionQueue(this, data.listeners);
    }

    this.isArrayField = data.isArrayField;

    // 数组类型有初始值时需要初始化
    if (this.isArrayField && this.initialValue.length) {
      this.initialValue.forEach((item: any) => {
        this.add(item);
      });
    }

    makeObservable(this, {
      layout: observable,
      name: observable,
      display: observable,
      value: computed,
      required: computed,
      setLayout: action,
      errors: computed,
      warnings: computed,
      successes: computed,
      children: observable,
    });
  }

  get required() {
    return this.rules?.some((desc) => !!desc?.required);
  }

  set rules(newRules) {
    setObserverable(this.form.rules, this.name, newRules);
  }

  get rules() {
    const stringNamePath = parseArrayNamePathToString(this.name);
    const selfRule = this.form.rules[stringNamePath];
    return Array.isArray(selfRule) ? selfRule : undefined;
  }

  get value() {
    return this.form.getFieldValue(this.name);
  }

  set value(value) {
    this.form.setFieldValue(this.name, value);
  }

  get errors() {
    const stringNamePath = parseArrayNamePathToString(this.name);
    const selfErrors = this.form.errors[stringNamePath];
    return Array.isArray(selfErrors) ? selfErrors : undefined;
  }

  get warnings() {
    const stringNamePath = parseArrayNamePathToString(this.name);
    const selfWarnings = this.form.warnings[stringNamePath];
    return Array.isArray(selfWarnings) ? selfWarnings : undefined;
  }

  get successes() {
    const stringNamePath = parseArrayNamePathToString(this.name);
    const selfSuccesses = this.form.successes[stringNamePath];
    return Array.isArray(selfSuccesses) ? selfSuccesses : undefined;
  }

  resetStatus() {
    this.value = this.initialValue;
    this.layout = this.initialStatus.layout;
    this.rules = this.initialStatus.rules;
    this.display = this.initialStatus.display;
  }

  reset() {
    this.value = this.initialValue ?? null;
  }

  clear() {
    this.value = null;
  }

  setLayout(newLayout: any, isInit = false) {
    if (isInit) {
      this.initialStatus.layout = newLayout;
      this.layout = newLayout;
    }
    this.layout = {
      ...this.layout,
      ...newLayout,
    };
  }

  /**
   * 数组类型字段
   */
  add = (initialValue?: any, position?: number) => {
    const newField = {
      initialValue,
      isListField: true,
      key: this.key++,
    };
    if (position >= 0) {
      console.log('指定位置', position);
      this.children.splice(position, 0, newField);
    } else {
      console.log('尾部');
      this.children.push(newField);
    }
    const newValue = this.value;
    newValue.splice(position, 0, initialValue);
    this.value = newValue;

    // 更新name path
    this.children.forEach((child, index) => {
      child.name = [index];
    });
  };

  remove = (index: number) => {
    this.children.splice(index, 1);
    // 移除值
    this.value = (this.value as any[]).filter((_, j) => j !== index);

    this.children.forEach((child, index) => {
      child.name = [index];
    });
  };

  move = (from: number, to: number) => {
    if (to >= this.children.length) {
      throw new Error('[Formable]: out of range !');
    }
    [this.children[from], this.children[to]] = [this.children[to], this.children[from]];

    // 更新name path
    this.children.forEach((child, index) => {
      child.name = [index];
    });
  };
}
