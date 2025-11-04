// ProColumns helper, provides autocompletion support and syntactic conveniences.

import { ProColumns } from "@ant-design/pro-components";
import { Rule } from "antd/es/form";
import { ReactNode } from "react";
import { combine } from "../../../object";
import {
  getDefaultPlaceholder,
  getRequiredRule,
  insertRules,
  processHideWhitelist,
} from "./columnHelpers";
import {
  ColumnProps,
  FormRenderMap,
  RenderFn,
  RenderMap,
  RuleMap,
} from "./columnTypes";

type GetFinePrintRenderer = (
  finePrintText: string | ReactNode,
  originalRenderer?: ProColumns["render"]
) => RenderFn;

type GetFinePrintExtraRenderer = (finePrintText: ReactNode) => ReactNode;

// valueType: 'dependency' not supported. Please use BODependencyColumn instead.
export const Column = <T, CustomValueType extends string>(
  columnProps: ColumnProps<T, CustomValueType>,
  renderMap: RenderMap<CustomValueType>,
  formRenderMap: FormRenderMap<CustomValueType>,
  ruleMap: RuleMap<CustomValueType>,
  getFinePrintRenderer: GetFinePrintRenderer,
  getFinePrintExtraRenderer: GetFinePrintExtraRenderer,
  renderLabelWithFakeAsterisk: (label: string) => ReactNode
) => {
  // Default renderers for certain valueTypes are mapped here
  const getDefaultRenderers = (valueType: CustomValueType | undefined) => {
    if (!valueType) return {};
    const hasRender = valueType in renderMap;
    const hasFormRender = valueType in formRenderMap;
    return combine(
      hasRender && { render: renderMap[valueType] },
      hasFormRender && {
        renderFormItem: formRenderMap[valueType],
      }
    ) as {
      render?: ProColumns["render"];
      renderFormItem?: ProColumns["renderFormItem"];
    };
  };

  const getDefaultRule = (
    valueType: CustomValueType,
    formItemRules?: Rule[]
  ): Rule[] => {
    if (formItemRules) return formItemRules;
    const hasValidator = valueType in ruleMap;
    return hasValidator ? ruleMap[valueType] ?? [] : [];
  };

  const valueType = columnProps.valueType as CustomValueType;
  const {
    helperProps: hp,
    formItemRules,
    formItemProps,
    fieldProps,
    ...column
  } = columnProps;

  type FormItemPropsArgs = Parameters<
    Extract<NonNullable<typeof formItemProps>, (...args: any) => any>
  >;

  type FieldPropsArgs = Parameters<
    Extract<NonNullable<typeof fieldProps>, (...args: any) => any>
  >;

  const defaultRenderFn =
    columnProps.render ?? getDefaultRenderers(valueType)?.render;

  const columnMixin = combine<any>(
    column._title && { title: column.title ?? column._title },
    hp?.span && { span: hp?.span },
    hp?.finePrintText && {
      render: getFinePrintRenderer(hp?.finePrintText, defaultRenderFn),
    },
    hp?.showIn && processHideWhitelist(hp?.showIn)
  );

  const getFieldPropsMixin = (props: FieldPropsArgs) => {
    const [form, config] = props;
    return combine<any>(
      valueType && valueType === "select" && { showSearch: true },
      { placeholder: hp?.placeholder ?? getDefaultPlaceholder(column as any) },
      hp?.dropdownOptions && { options: hp?.dropdownOptions ?? [] }
    );
  };

  const combinedRules = [
    ...getRequiredRule(hp?.required, (column.title ?? "a value").toString()),
    ...getDefaultRule(valueType, formItemRules),
  ];

  const formItemPropsMixin = (props: FormItemPropsArgs) => {
    const [form, schema] = props;
    return combine<any>(
      { rules: combinedRules },
      hp?.finePrintText && {
        extra: getFinePrintExtraRenderer(hp?.finePrintText),
      },
      hp?.fakeRequired && {
        label: renderLabelWithFakeAsterisk(schema.title as string),
      }
    );
  };

  const combinedFieldProps: typeof fieldProps = (...args) => ({
    ...getFieldPropsMixin(args),
    ...(typeof fieldProps === "function" ? fieldProps(...args) : fieldProps),
  });

  const combinedFormItemProps: typeof formItemProps = (...args) =>
    insertRules(
      formItemPropsMixin(args),
      typeof formItemProps === "function"
        ? formItemProps(...args)
        : formItemProps
    );

  // this mixin is applied at the very end, allowing value overrides to happen
  const columnPostMixin = combine<any>(
    hp?.noTitle && { title: "" }
    // more stuff here
  );

  const result = {
    ...getDefaultRenderers(valueType), // we place this first to allow default renderers to be overridden
    ...column,
    ...columnMixin,
    fieldProps: combinedFieldProps,
    formItemProps: combinedFormItemProps,
    ...columnPostMixin,
  } as ProColumns<T>;

  return result;
};
