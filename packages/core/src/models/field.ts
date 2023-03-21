import { makeObservable, observable, action, computed } from 'mobx';
import { DisplayType } from '../types';
import { mergeRules, setObserverable } from '../utils/helper';
import { FormStore } from './form';

export class FieldStore {
  name: string;

  initialValue: any;

  touched: boolean;

  validating: boolean;

  display: DisplayType = 'edit';

  layout: Record<string, any>;

  validateStatus: DisplayType;

  // 存储field初始状态
  initialStatus: Record<string, any> = {};

  private readonly form: FormStore;

  constructor(form: FormStore, data: any) {
    this.form = form;
    this.name = data.name;
    this.initialValue = data.initialValue;
    this.display = data.display;
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

    makeObservable(this, {
      layout: observable,
      name: observable,
      display: observable,
      value: computed,
      required: computed,
      setLayout: action,
    });
  }

  get required() {
    return this.rules.some((desc) => !!desc?.required);
  }

  set rules(newRules) {
    setObserverable(this.form.rules, this.name, newRules);
  }

  get rules() {
    const selfRule = this.form.rules[this.name];
    return Array.isArray(selfRule) ? selfRule : [selfRule];
  }

  get value() {
    return this.form.getFieldValue(this.name);
  }

  set value(value) {
    this.form.setFieldValue(this.name, value);
  }

  get errors() {
    const selfErrors = this.form.errors[this.name];
    return Array.isArray(selfErrors) ? selfErrors : [selfErrors];
  }

  get warnings() {
    const selfWarnings = this.form.warnings[this.name];
    return Array.isArray(selfWarnings) ? selfWarnings : [selfWarnings];
  }

  get successes() {
    const selfSuccesses = this.form.successes[this.name];
    return Array.isArray(selfSuccesses) ? selfSuccesses : [selfSuccesses];
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
