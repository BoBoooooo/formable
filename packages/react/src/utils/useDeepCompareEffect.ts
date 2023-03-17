import { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export const useDeepCompareEffect = (callback: React.EffectCallback, dependencies: any) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
};
