import { parseArrayNamePathToString, switchArrayItemByIndex } from './../utils/helper';
import { makeObservable, observable, action, computed } from 'mobx';
import { FieldDisplayType, ValidateStatus, NamePath, IRegisterFieldParams } from '../types';
import { mergeRules, setObserverable } from '../utils/helper';
import { FormStore } from './form';
import { ReactionQueue } from './reaction';

export class FieldStore {
  /**
   * @desc namePath
   */
  name: NamePath;

  initialValue: any;

  touched: boolean;

  validating: boolean;

  display: FieldDisplayType = 'edit';

  layout: Record<string, any>;

  validateStatus: ValidateStatus;

  // 存储field初始状态
  initialStatus: Record<string, any> = {};

  reactionQueue: ReactionQueue;

  // 数组类型字段
  isArrayField: boolean;

  // 是否为ArrayField 子Field
  isListField: boolean;

  // 上层ArrayField Name
  prefixName: string;

  // 子Field
  children: any[] = [];

  key = 0;

  readonly form: FormStore;

  constructor(form: FormStore, data: IRegisterFieldParams) {
    this.form = form;
    this.name = data.name;
    this.initialValue = data.initialValue;
    this.validateStatus = data.validateStatus ?? 'error';
    this.display = data.display ?? 'edit';

    this.isListField = !!data.isListField;
    this.prefixName = parseArrayNamePathToString(data.prefixName);

    this.initialStatus = {
      name: data.name,
      initialValue: this.initialValue,
      display: this.display,
    };
    // item rule register to form
    if (data.rules || data.required) {
      // isListField需要将规则注入到arrayField
      const localRules = mergeRules(
        data.rules,
        data.required,
        this.isListField,
        this.form.rules[this.prefixName]
      );
      setObserverable(this.form.rules, parseArrayNamePathToString(this.name), localRules, true);

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
    const index = position >= 0 ? position : this.children.length;
    this.children.splice(index, 0, newField);

    const newValue = this.value;
    newValue?.splice(index, 0, initialValue);
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
    this.children = switchArrayItemByIndex(this.children, from, to);
    this.value = switchArrayItemByIndex(this.value, from, to);
    // 更新name path
    this.children.forEach((child, index) => {
      child.name = [index];
    });
  };
}
