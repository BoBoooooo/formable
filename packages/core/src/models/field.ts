import { makeObservable, observable, action, computed } from 'mobx';
import { mergeRules, setObserverable } from '../utils/helper';
import { FormStore } from './form';

type ValidateStatus = 'success' | 'warning' | 'error' | 'validating' | '';

export class FieldStore {
  name: string;

  initialValue: any;

  touched: boolean;

  validating: boolean;

  display: 'editable' | 'disabled' | 'preview' = 'editable';

  layout: Record<string, any>;

  validateStatus: ValidateStatus;

  private readonly form: FormStore;

  constructor(form: FormStore, data: any) {
    this.form = form;
    this.name = data.name;
    this.initialValue = data.initialValue;
    // 注册至form
    setObserverable(this.form.rules, this.name, mergeRules(data.rules, data.required));

    makeObservable(this, {
      layout: observable,
      name: observable,
      value: computed,
      required: computed,
      updateLayout: action,
      initLayout: action,
    });
  }

  get required() {
    return this.rules.some((desc) => !!desc?.required);
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

  reset() {
    this.value = this.initialValue ?? null;
  }

  clear() {
    this.value = null;
  }

  initLayout(layout: any) {
    this.layout = layout;
  }

  updateLayout(newLayout: any) {
    this.layout = {
      ...this.layout,
      ...newLayout,
    };
  }
}
