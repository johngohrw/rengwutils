import { ReactNode } from "react";
import { DeepKeyPath, DropdownType } from "../general/types";
import { ShowInValues } from "./columnHelpers";
import { ColumnTitle } from "antd/es/table/interface";
import { Rule } from "antd/es/form";
import {
  DescriptionsItemProps,
  ProColumns,
  ProFieldValueType,
  ProFormColumnsType,
  ProSchemaComponentTypes,
} from "@ant-design/pro-components";

export type RenderFn = (...renderProps: RenderProps) => any;
export type FormItemRenderFn = (
  ...renderFormItemProps: RenderFormItemProps
) => any;

export type RenderMap = Partial<Record<ProFieldValueType | string, RenderFn>>;
export type FormRenderMap = Partial<
  Record<ProFieldValueType | string, FormItemRenderFn>
>;

export type RuleMap = Partial<Record<ProFieldValueType | string, Rule[]>>;

/** [dom, entity, index, action, schema] */
export type RenderProps<T = any, ValueType = "text"> = Parameters<
  NonNullable<ProColumns<T, ValueType>["render"]>
>;

/** Default rest props passed from renderFormItem function to any custom render component
 * [schema, config, form]
 * Only to be used WITHIN custom components passed to renderFormItem
 * Example usage:
 * renderFormItem: (...rp: RenderFormItemProps) => {
 *   const MyComponent = ({ ...rest }: RenderFormItemDefaultProps) => {
 *     return <div>...</div>;
 *   };
 *   return <MyComponent />;
 * },
 */
export type RenderFormItemProps<T = any, ValueType = "text"> = Parameters<
  NonNullable<ProColumns<T, ValueType>["renderFormItem"]>
>;

export type RenderTextProps<T = any, ValueType = "text"> = Parameters<
  NonNullable<ProColumns<T, ValueType>["renderText"]>
>;

export interface RenderFormItemDefaultProps {
  id?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

// helper that combines both RenderFormItemProps & RenderFormItemDefaultProps to be easily used in render functions
export type AllRenderFormItemProps = {
  renderFormItemProps: RenderFormItemProps;
} & Partial<RenderFormItemDefaultProps>;

export type ColumnProps<T, AllValueTypes, ValueType = "text"> = {
  helperProps?: {
    /** Applied to `fieldProps.options` */
    dropdownOptions?: DropdownType[];
    /** Applied to `fieldProps.placeholder` */
    placeholder?: string;
    /** Inserts a `required` `Rule` entry to `formItemProps.rules`. `required` will be true if given just a string */
    required?: boolean | string;
    /** To adjust column span in DescriptionTable */
    span?: number;
    /** renders fine print text with BOFinePrint in both renderFormItem() and render() */
    finePrintText?: string | React.ReactNode;
    /** enables whitelist behavior for hideInTable/hideInDescription/etc. syntactic sugar*/
    showIn?: ShowInValues[];
    /** Adds fake required red asterisk */
    fakeRequired?: boolean;
    /** overrides value of 'title' to '' in resulting column */
    noTitle?: boolean;
  };
  /** '_title' will be used in place of 'title' if the latter is not defined */
  _title?: string | ReactNode | ColumnTitle<any>;
  /** Rules array which will be applied to formItemProps.rules */
  formItemRules?: Rule[];
  /** colProps: https://procomponents.ant.design/en-US/components/schema-form#schema-definition */
  colProps?: ProFormColumnsType<T>["colProps"];
  /** columns: https://procomponents.ant.design/en-US/components/schema-form#schema-definition */
  columns?: ProColumns[] | ((record: T) => ProColumns[]);
  /** for valueType: dependency */
  name?: any;
  /** to cater for our custom valueTypes */
  valueType?:
    | AllValueTypes
    | ((entity: T, type: ProSchemaComponentTypes) => AllValueTypes); // modelled according to antd's native behaviour. untested.
} & Omit<ProColumns<T, ValueType>, "dataIndex" | "valueType"> &
  Partial<DescriptionsItemProps> & {
    dataIndex: keyof T | DeepKeyPath<T>;
  };
