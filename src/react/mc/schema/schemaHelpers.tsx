import {
  ProColumns,
  ProDescriptionsItemProps,
  ProFormColumnsType,
} from "@ant-design/pro-components";

/**
 * Wrap ProColumns[] with this to use as BOProDescription's columns
 * to avoid littering your codebase with as ProDescriptionsItemProps[]
 * @param columns
 */
export const toDescriptions = <T,>(columns: ProColumns<T>[]) =>
  columns as ProDescriptionsItemProps<T>[];

/**
 * loose version of toDescriptions
 */
export const toDescriptionsLoose = <T,>(columns: ProColumns<T>[]) =>
  columns as ProDescriptionsItemProps[];

/**
 * Wrap ProColumns[] with this to use as BOSchemaForm's columns
 * to avoid littering your codebase with as ProFormColumnsType[]
 * @param columns
 */
export const toSchemaForm = <T,>(columns: ProColumns<T>[]) =>
  columns as ProFormColumnsType<T>[];

/**
 * loose version of toSchemaForm
 */
export const toSchemaFormLoose = <T,>(columns: ProColumns<T>[]) =>
  columns as ProFormColumnsType[];
