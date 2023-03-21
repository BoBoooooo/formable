export type IListenerSet = {
  // 兼容set.ui set.value写法
  layout?: any;
  value?: any;
};

export type IListenerConditionFunction = (formValues: Record<string, any>) => boolean;

export type IListenerSetFunction = (formValues: Record<string, any>) => IListenerSet;

export interface IListener {
  watch: string[];
  condition?: string | boolean | IListenerConditionFunction;
  set: IListenerSet | IListenerSetFunction;
}
