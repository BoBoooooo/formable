import { compile } from 'expression-eval';
import { reaction, IReactionDisposer } from 'mobx';
import { IListener, NamePath } from '../types';
import { mergeRules } from '../utils/helper';
import { FieldStore } from './field';
import { FormStore } from './form';
import { parseArrayNamePathToString } from './../utils/helper';

/**
 * field 联动
 * @param sourceFieldPath 原字段
 * @param watchFields 监听字段
 * @param expression 触发条件
 * @param effect 响应行为
 * @param formContext 表单上下文
 */
export const genListenerReaction = (
  sourceFieldPath: NamePath,
  watchFields: string[],
  expression: IListener['condition'],
  effect: any,
  formContext: FormStore
) => {
  const sourceField = parseArrayNamePathToString(sourceFieldPath);
  return reaction(
    // watch multiple fields
    () => watchFields.map((field) => formContext.values[field]?.toString()).join(' '),
    () => {
      let isEffect = !!expression;
      // trigger action
      if (typeof expression === 'undefined') {
        isEffect = true;
      } else if (typeof expression === 'function') {
        isEffect = expression(formContext.fieldMap[parseArrayNamePathToString(sourceField)], this);
      } else if (typeof expression === 'string') {
        isEffect = compile(expression)(formContext.fieldMap);
      }

      const effectIsObjectType = Object.prototype.toString.call(effect) === '[object Object]';
      if (isEffect) {
        if (typeof effect === 'function') {
          effect(this);
        } else if (effectIsObjectType) {
          // TODO: 重构..
          if ('layout' in effect) {
            formContext.setFieldLayout(sourceField, effect.layout);
          }
          if ('rules' in effect || 'required' in effect) {
            formContext.setFieldRules(sourceField, mergeRules(effect.rules, effect.required));
          }
          if ('display' in effect) {
            formContext.setFieldDisplay(sourceField, effect.display);
          }
          if ('value' in effect) {
            formContext.setFieldValue(sourceField, effect.value);
          }
        } else {
          throw new Error('[Formable]: action should be typeof `function` or `object`');
        }
        // set为对象时且触发条件为false时 自动还原状态
      } else if (formContext.fieldMap[sourceField] && effectIsObjectType) {
        formContext.fieldMap[sourceField].resetStatus();
      }
      return null;
    },
    // otherOptions
    {}
  );
};

interface ReactionItem {
  reactionFn: () => IReactionDisposer;
  disposer: IReactionDisposer;
}

export class ReactionQueue {
  private reactions: ReactionItem[] = [];
  private listeners: IListener[];
  private form: FormStore;
  private field: FieldStore;

  constructor(fieldContext: FieldStore, listeners: IListener[]) {
    this.form = fieldContext.form;
    this.field = fieldContext;
    this.listeners = listeners;
    this.listeners.forEach((listener) => {
      this.addReaction(() =>
        genListenerReaction(
          this.field.name,
          listener.watch,
          listener.condition,
          listener.set,
          this.form
        )
      );
    });
  }

  addReaction(reactionFn: () => IReactionDisposer): void {
    const disposer = reactionFn();
    this.reactions.push({ reactionFn, disposer });
  }

  removeReaction(reactionFn: () => IReactionDisposer): void {
    const index = this.reactions.findIndex((r) => r.reactionFn === reactionFn);
    if (index !== -1) {
      const { disposer } = this.reactions.splice(index, 1)[0];
      disposer();
    }
  }

  removeAllReactions(): void {
    this.reactions.forEach((r) => r.disposer());
    this.reactions = [];
  }
}
