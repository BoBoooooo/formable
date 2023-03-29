import { makeObservable, observable, action, computed } from 'mobx';
import { DisplayType, ValidateStatus } from '../types';
import { mergeRules, setObserverable } from '../utils/helper';
import { FormStore } from './form';
import { ReactionQueue } from './reaction';

export class FieldStore {
  name: string;

  initialValue: any;

  touched: boolean;

  validating: boolean;

  display: DisplayType = 'edit';

  layout: Record<string, any>;

  validateStatus: ValidateStatus;

  // 存储field初始状态
  initialStatus: Record<string, any> = {};

  reactionQueue: ReactionQueue;

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
    });
  }

  get required() {
    return this.rules?.some((desc) => !!desc?.required);
  }

  set rules(newRules) {
    setObserverable(this.form.rules, this.name, newRules);
  }

  get rules() {
    const selfRule = this.form.rules[this.name];
    return Array.isArray(selfRule) ? selfRule : undefined;
  }

  get value() {
    return this.form.getFieldValue(this.name);
  }

  set value(value) {
    this.form.setFieldValue(this.name, value);
  }

  get errors() {
    const selfErrors = this.form.errors[this.name];
    return Array.isArray(selfErrors) ? selfErrors : undefined;
  }

  get warnings() {
    const selfWarnings = this.form.warnings[this.name];
    return Array.isArray(selfWarnings) ? selfWarnings : undefined;
  }

  get successes() {
    const selfSuccesses = this.form.successes[this.name];
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
}
