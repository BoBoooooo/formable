import * as React from 'react';
import classNames from 'classnames';
import { useFieldStatus } from '@formable/react';
import { observer } from 'mobx-react-lite';
import { Row, FormItemProps } from 'antd';
import { ConfigContext } from 'antd/es/config-provider';
import FormItemLabel from './FormItemLabel';
import FormItemInput from './FormItemInput';
import { omit } from '../../utils';
import type { FormItemStatusContextProps, ValidateStatus } from '../../types';
import { FormContext, FormItemInputContext } from '../../utils/context';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';

const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};
export const FormItem = observer((props: FormItemProps) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    help,
    hasFeedback,
    hidden,
    children,
    fieldId,
    // TODO: 待处理
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('form', customizePrefixCls);
  // ======================== INJECT FIELD STORE STATUS ========================
  const {
    errors = [],
    warnings = [],
    required: isRequired,
    validateStatus,
    touched,
    validating,
  } = useFieldStatus() ?? {};
  const { requiredMark } = React.useContext(FormContext);
  const itemPrefixCls = `${prefixCls}-item`;
  // ======================== Margin ========================
  const itemRef = React.useRef<HTMLDivElement>(null);
  const debounceErrors = errors.map((e) => e?.message);
  const debounceWarnings = warnings.map((e) => e?.message);
  const meta = {
    touched,
    validating,
  };
  const hasHelp = help !== undefined && help !== null;
  const hasError = !!(hasHelp || errors.length || warnings.length);
  const [marginBottom, setMarginBottom] = React.useState<number | null>(null);

  useLayoutEffect(() => {
    if (hasError && itemRef.current) {
      const itemStyle = getComputedStyle(itemRef.current);
      setMarginBottom(parseInt(itemStyle.marginBottom, 10));
    }
  }, [hasError]);

  const onErrorVisibleChanged = (nextVisible: boolean) => {
    if (!nextVisible) {
      setMarginBottom(null);
    }
  };

  // ======================== Status ========================
  let mergedValidateStatus: ValidateStatus = '';
  if (validateStatus !== undefined) {
    mergedValidateStatus = validateStatus;
  } else if (meta.validating) {
    mergedValidateStatus = 'validating';
  } else if (debounceErrors.length) {
    mergedValidateStatus = 'error';
  } else if (debounceWarnings.length) {
    mergedValidateStatus = 'warning';
  } else if (meta.touched) {
    mergedValidateStatus = 'success';
  }

  const formItemStatusContext = React.useMemo<FormItemStatusContextProps>(() => {
    let feedbackIcon: React.ReactNode;
    if (hasFeedback) {
      const IconNode = mergedValidateStatus && iconMap[mergedValidateStatus];
      feedbackIcon = IconNode ? (
        <span
          className={classNames(
            `${itemPrefixCls}-feedback-icon`,
            `${itemPrefixCls}-feedback-icon-${mergedValidateStatus}`
          )}
        >
          <IconNode />
        </span>
      ) : null;
    }

    return {
      status: mergedValidateStatus,
      hasFeedback,
      feedbackIcon,
      isFormItemInput: true,
    };
  }, [mergedValidateStatus, hasFeedback]);

  // ======================== Render ========================
  const itemClassName = {
    [itemPrefixCls]: true,
    [`${itemPrefixCls}-with-help`]: hasHelp || debounceErrors.length || debounceWarnings.length,
    [`${className}`]: !!className,

    // Status
    [`${itemPrefixCls}-has-feedback`]: mergedValidateStatus && hasFeedback,
    [`${itemPrefixCls}-has-success`]: mergedValidateStatus === 'success',
    [`${itemPrefixCls}-has-warning`]: mergedValidateStatus === 'warning',
    [`${itemPrefixCls}-has-error`]: mergedValidateStatus === 'error',
    [`${itemPrefixCls}-is-validating`]: mergedValidateStatus === 'validating',
    [`${itemPrefixCls}-hidden`]: hidden,
  };

  return (
    <div className={classNames(itemClassName)} style={style} ref={itemRef}>
      <Row
        className={`${itemPrefixCls}-row`}
        {...omit(restProps, [
          '_internalItemRender' as any,
          'colon',
          'dependencies',
          'extra',
          'fieldKey',
          'getValueFromEvent',
          'getValueProps',
          'htmlFor',
          'id', // It is deprecated because `htmlFor` is its replacement.
          'initialValue',
          'isListField',
          'label',
          'labelAlign',
          'labelCol',
          'labelWrap',
          'messageVariables',
          'name',
          'normalize',
          'noStyle',
          'preserve',
          'required',
          'requiredMark',
          'rules',
          'shouldUpdate',
          'trigger',
          'tooltip',
          'validateFirst',
          'validateTrigger',
          'valuePropName',
          'wrapperCol',
        ])}
      >
        {/* Label */}
        <FormItemLabel
          htmlFor={fieldId}
          required={isRequired}
          requiredMark={requiredMark}
          {...props}
          prefixCls={prefixCls}
        />
        {/* Input Group */}
        <FormItemInput
          {...props}
          {...meta}
          errors={debounceErrors}
          warnings={debounceWarnings}
          prefixCls={prefixCls}
          status={mergedValidateStatus}
          help={help}
          marginBottom={marginBottom}
          onErrorVisibleChanged={onErrorVisibleChanged}
        >
          <FormItemInputContext.Provider value={formItemStatusContext}>
            {children}
          </FormItemInputContext.Provider>
        </FormItemInput>
      </Row>

      {!!marginBottom && (
        <div
          className={`${itemPrefixCls}-margin-offset`}
          style={{
            marginBottom: -marginBottom,
          }}
        />
      )}
    </div>
  );
});
