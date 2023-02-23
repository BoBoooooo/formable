import * as React from 'react';

export  function useDebounce<T>(value: T[]): T[] {
    const [cacheValue, setCacheValue] = React.useState(value);
    React.useEffect(() => {
        const timeout = setTimeout(
            () => {
                setCacheValue(value);
            },
            value.length ? 0 : 10,
        );

        return () => {
            clearTimeout(timeout);
        };
    }, [value]);

    return cacheValue;
}
