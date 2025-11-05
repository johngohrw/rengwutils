import { ColumnProps } from "../column/columnTypes";
import { DropdownType } from "../general/types";

/**
 * Inherit ColumnProps, but everything is optional
 * ColumnFactory will rely on the existence of `_title` to decide whether a given node is a column. Will be mapped to `title` in the end
 */
export type SchemaColumnProps<
  T,
  CustomValueTypes,
  NoTitle = false,
  ValueType = "text"
> = Partial<ColumnProps<T, CustomValueTypes, ValueType>> &
  (NoTitle extends false
    ? { _title: string | undefined }
    : { _title?: string | undefined });

/**
 * SchemaColumnProps, with _columns added to cater for array types (formlists)
 */
export type SchemaColumnArrayProps<
  T,
  CustomValueTypes,
  NoTitle = false,
  ValueType = "text"
> = SchemaColumnProps<T, CustomValueTypes, NoTitle, ValueType> & {
  _columns?: Schema<T, NoTitle>;
};

type SchemaColumnArrayPartialProps<
  T,
  CustomValueTypes,
  NoTitle = false,
  ValueType = "text"
> = SchemaColumnProps<T, CustomValueTypes, NoTitle, ValueType> & {
  _columns?: SchemaPartial<T, NoTitle>;
};

type DropdownMapArrayProps<T, CustomValueTypes> = SchemaColumnProps<
  T,
  CustomValueTypes,
  true
> & {
  _columns?: Partial<SchemaDropdownMap<T, CustomValueTypes>>;
} & Record<any, any>;

/**
 * Type for Schema. Recursive, all property keys are required.
 */
export type Schema<T, CustomValueTypes, NoTitle = false> = {
  [key in keyof T]: T[key] extends object[]
    ? SchemaColumnArrayProps<T[key][number], CustomValueTypes, NoTitle>
    : T[key] extends any[]
    ? SchemaColumnProps<T, CustomValueTypes, NoTitle>
    : T[key] extends object
    ? DeepSchemaNode<T[key], CustomValueTypes, NoTitle>
    : SchemaColumnProps<T, CustomValueTypes, NoTitle>;
};

type DeepSchemaNode<U, CustomValueTypes, NoTitle> = Schema<
  U,
  CustomValueTypes,
  NoTitle
>;

/**
 * Type for Schema. Recursive, all properties are optional
 */
export type SchemaPartial<T, CustomValueTypes, NoTitle = false> = {
  [key in keyof T]?: T[key] extends object[]
    ? SchemaColumnArrayPartialProps<T[key][number], CustomValueTypes, NoTitle>
    : T[key] extends any[]
    ? SchemaColumnProps<T, CustomValueTypes, NoTitle>
    : T[key] extends object
    ? DeepSchemaNodePartial<T[key], NoTitle>
    : SchemaColumnProps<T, CustomValueTypes, NoTitle>;
};

type DeepSchemaNodePartial<U, NoTitle> = SchemaPartial<U, NoTitle>;

// A more lenient version of Schema which is Partial and accepts keys outside of T.
export type SchemaLoose<T, CustomValueTypes, NoTitle = true> = SchemaPartial<
  T & Record<any, any>,
  CustomValueTypes,
  NoTitle
>;

/**
 * Dropdown Map. to be used in dropdown hydration.
 */
export type SchemaDropdownMap<T, CustomValueTypes> = Partial<{
  [key in keyof T]: T[key] extends object[]
    ? DropdownMapArrayProps<T[key][number], CustomValueTypes>
    : T[key] extends any[]
    ? DropdownType[] | Record<any, any>[]
    : T[key] extends object
    ? DeepSchemaDropdownNode<T[key], CustomValueTypes>
    : DropdownType[] | Record<any, any>[];
}>;

type DeepSchemaDropdownNode<T, CustomValueTypes> = SchemaDropdownMap<
  T,
  CustomValueTypes
>;

/**
 * Utility to assert a particular object/array-shaped type to be recognized as a field.
 * funnily enough, simply unioning with a string works well enough here.
 */
export type SchemaField<T> = T | "__schemaField__";
