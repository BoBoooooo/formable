import { FieldStore } from '../models';
import { FormStore } from '../models/form';
import { IRegisterFieldParams } from '../types';

describe('FormStore', () => {
  let form: FormStore;
  beforeEach(() => {
    form = new FormStore();
  });
  it('should initialize with no fields', () => {
    expect(form.fieldMap).toEqual({});
  });

  it('should register a field correctly', () => {
    const fieldParams: IRegisterFieldParams = {
      isArrayField: false,
      listeners: [],
    };
    const field = form.registerField('testField', fieldParams) as FieldStore;
    expect(field).toBeInstanceOf(FieldStore);
    expect(field.name).toBe('testField');
    expect(form.fieldMap).toEqual({ testField: field });
  });

  it('should set values and update fields', () => {
    form.registerField('name', {
      initialValue: 'Sara',
    });
    form.registerField('age', {
      initialValue: 0,
    });
    form.setFieldValues({
      name: 'John',
      age: 30,
    });

    expect(form.getFieldValue('name')).toEqual('John');
    expect(form.getFieldValue('age')).toEqual(30);

    form.setFieldValue('name', 'Neo');
    expect(form.getFieldValue('name')).toEqual('Neo');
  });

  it('should return correct values', () => {
    form.registerField('name', {
      initialValue: 'Sara',
    });
    form.registerField('age', {
      initialValue: 0,
    });
    expect(form.getFieldsValue()).toEqual({
      name: 'Sara',
      age: 0,
    });
  });

  // it('should trigger listeners when setting values', () => {
  //   const listener1 = jest.fn();
  //   const listener2 = jest.fn();
  //   form.registerListener('name', { set: { value: listener1 } });
  //   form.registerListener('age', { set: { value: listener2 } });

  //   form.setValues({
  //     name: 'John',
  //     age: 30,
  //   });

  //   expect(listener1).toHaveBeenCalledWith('John');
  //   expect(listener2).toHaveBeenCalledWith(30);
  // });
});
