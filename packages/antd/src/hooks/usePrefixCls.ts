import { ConfigContext } from 'antd/es/config-provider';
import { useContext } from 'react';

export const usePrefixCls = (
    tagName?: string,
    prefixClsProp?: string,
) => {
    const { getPrefixCls } = useContext(ConfigContext);
    return getPrefixCls(tagName, prefixClsProp);
  
};
