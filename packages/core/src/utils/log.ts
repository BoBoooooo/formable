import { toJS } from 'mobx';
import { IRegisterFieldParams } from '../types';
import { parseArrayNamePathToString } from './helper';

const isDev = process.env.NODE_ENV === 'development';

export const logRegisterInfo = ({ name, initialValue, ...rest }: IRegisterFieldParams) => {
  if (isDev) {
    const registerInfo = [
      {
        name: parseArrayNamePathToString(name),
        initialValue: toJS(initialValue),
        initialData: toJS(rest),
      },
    ];
    console.table(registerInfo, ['name', 'initialValue']);
  }
};
