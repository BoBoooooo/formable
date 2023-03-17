import classNames from 'classnames';
import * as React from 'react';
import { useMemo } from 'react';
import { ConfigContext } from 'antd/es/config-provider';
import DisabledContext, { DisabledContextProvider } from 'antd/es/config-provider/DisabledContext';
import SizeContext, { SizeContextProvider } from 'antd/es/config-provider/SizeContext';

import { FormableProps } from '../Form';
import { FormContext } from '../../utils/context';

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export const FormLayout: React.FC<FormableProps> = (props) => {
  const contextSize = React.useContext(SizeContext);
  const contextDisabled = React.useContext(DisabledContext);
  const { getPrefixCls, direction } = React.useContext(ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    className,
    size = contextSize,
    disabled = contextDisabled,
    colon,
    labelAlign,
    labelWrap,
    labelCol,
    wrapperCol,
    hideRequiredMark,
    layout = 'horizontal',
    requiredMark,
    name,
    children,
  } = props;

  const mergedRequiredMark = useMemo(() => {
    if (requiredMark !== undefined) {
      return requiredMark;
    }

    if (hideRequiredMark) {
      return false;
    }

    return true;
  }, [hideRequiredMark, requiredMark]);

  const mergedColon = colon;

  const prefixCls = getPrefixCls('form', customizePrefixCls) || 'ant';
  console.log('prefixCls', prefixCls);

  const formClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-${layout}`]: true,
      [`${prefixCls}-hide-required-mark`]: mergedRequiredMark === false,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-${size}`]: size,
    },
    className
  );

  const formContextValue = useMemo(
    () => ({
      name,
      labelAlign,
      labelCol,
      labelWrap,
      wrapperCol,
      vertical: layout === 'vertical',
      colon: mergedColon,
      requiredMark: mergedRequiredMark,
    }),
    [name, labelAlign, labelCol, labelWrap, wrapperCol, layout, mergedColon, mergedRequiredMark]
  );

  return (
    <DisabledContextProvider disabled={disabled}>
      <SizeContextProvider size={size}>
        <FormContext.Provider value={formContextValue}>
          <div className={formClassName}>{children}</div>
        </FormContext.Provider>
      </SizeContextProvider>
    </DisabledContextProvider>
  );
};
