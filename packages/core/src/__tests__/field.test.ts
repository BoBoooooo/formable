import { FormStore } from '../models/form';
import { FieldStore } from '../models/field';

describe('FieldStore', () => {
  let formStore: FormStore;

  beforeEach(() => {
    formStore = new FormStore();
  });

  describe('constructor', () => {
    it('should create a FieldStore instance', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: 'test',
      });

      expect(field.name).toEqual(['username']);
      expect(field.initialValue).toEqual('test');
      expect(field.touched).toBeFalsy();
      expect(field.validating).toBeFalsy();
      expect(field.display).toEqual('edit');
      expect(field.layout).toBeUndefined();
      expect(field.validateStatus).toEqual('error');
      expect(field.initialStatus).toEqual({
        name: ['username'],
        initialValue: 'test',
        display: 'edit',
      });
      expect(field.isArrayField).toBeFalsy();
      expect(field.isListField).toBeFalsy();
      expect(field.prefixName).toBeUndefined();
      expect(field.children).toEqual([]);
      expect(field.key).toEqual(0);
      expect(field.form).toEqual(formStore);
    });
  });

  describe('required', () => {
    it('should return true if any rule is required', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
        rules: [{ required: true }],
      });

      expect(field.required).toBeTruthy();
    });

    it('should return false if no rule is required', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
        rules: [{ required: false }],
      });

      expect(field.required).toBeFalsy();
    });
  });

  describe('rules', () => {
    it('should return undefined if there is no rule for the field', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
      });

      expect(field.rules).toBeUndefined();
    });

    it('should return the rules if there are rules for the field', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
        rules: [{ required: true }],
      });

      expect(field.rules).toEqual([{ required: true }]);
    });
  });

  describe('value', () => {
    it('should set and get the field value from the form', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
      });
      formStore.fieldMap['username'] = field;
      field.value = 'test';
      expect(field.value).toEqual('test');
      expect(formStore.getFieldValue(['username'])).toEqual('test');
    });

    it('reset', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: 'aaa',
      });
      formStore.fieldMap['username'] = field;

      field.value = 'test';
      console.log('initialValue', field.initialValue);
      field.reset();
      expect(field.value).toEqual('aaa');
    });

    it('clear', () => {
      const field = new FieldStore(formStore, {
        name: ['username'],
        initialValue: '',
      });
      formStore.fieldMap['username'] = field;

      field.value = 'test';
      field.clear();
      expect(field.value).toBeNull();
    });
  });

  describe('array field', () => {
    it('should add value to array', () => {
      const field = formStore.registerField('list', {
        initialValue: ['Neo'],
        isArrayField: true,
      });
      field?.add('Json');
      field?.add('Leo', 0);
      expect(field?.value.length).toEqual(3);
      expect(field?.children.length).toEqual(3);
      expect(field?.value[0]).toEqual('Leo');
      expect(field?.value[2]).toEqual('Json');
    });

    it('should remove value from array', () => {
      const field = formStore.registerField('list', {
        initialValue: ['Neo'],
        isArrayField: true,
      });

      field?.remove(0);
      expect(field?.children.length).toEqual(0);
    });

    it('should move value from array', async () => {
      const field = formStore.registerField('list', {
        initialValue: ['Neo', 'Json'],
        isArrayField: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
      field?.move(0, 1);
      expect(field?.value).toEqual(['Json', 'Neo']);

      let err: Error | null = null;
      try {
        expect(field?.move(0, 5));
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
    });
  });
});
