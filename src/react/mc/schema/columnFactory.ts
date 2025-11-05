import { ProColumns, ProFormList } from "@ant-design/pro-components";
import { ColumnProps } from "../column/columnTypes";
import {
  Schema,
  SchemaColumnArrayProps,
  SchemaColumnProps,
  SchemaLoose,
  SchemaPartial,
} from "./schemaTypes";
import { ComponentProps } from "react";
import { flattenDeep } from "lodash";

type FormListItemRenderer = ComponentProps<typeof ProFormList>["itemRender"];

/**
 * Converts Schema object into ProColumns[].
 * Each node is recursively mapped and then completely flattened.
 * @param coreProps - required props
 * @param columnSchema - a `Schema` schema object.
 * @returns ProColumns[]
 */
export const columnFactory = <T, CustomValueTypes>(
  coreProps: {
    // a fully set-up Column() function.
    columnFunction: (...props: any) => ProColumns<T>;
    // Formlist Item renderer.
    formListItemRenderer: FormListItemRenderer;
  },
  columnSchema:
    | Schema<T, CustomValueTypes>
    | SchemaPartial<T, CustomValueTypes>
    | SchemaLoose<T, CustomValueTypes>,
  initialTrail?: (string | number)[]
) => {
  const createColumn = (
    dataIndex: (string | number)[],
    column:
      | SchemaColumnProps<T, CustomValueTypes>
      | SchemaColumnArrayProps<T, CustomValueTypes>
  ) => {
    const { _title, ...columnRest } = column;
    let _dataIndex: any = dataIndex;
    if (dataIndex.length === 1) _dataIndex = dataIndex[0];

    const hasColumns = "_columns" in columnRest;
    if (hasColumns) {
      // todo: solve 'any' type
      const columns = columnFactory(coreProps, columnRest["_columns"] as any);
      const {
        _columns, // remove _columns entry
        valueType: valueTypeFromProps,
        ...columnPropsRest
      } = columnRest;

      const _valueType = valueTypeFromProps ?? "formList";

      if (_valueType === "group") {
        return coreProps.columnFunction({
          title: _title,
          valueType: _valueType,
          columns: columns,
          ...columnPropsRest,
        } as ColumnProps<any, any>);
      }

      return coreProps.columnFunction({
        title: _title,
        dataIndex: _dataIndex as any,
        valueType: "formList",
        fieldProps: {
          itemRender: coreProps.formListItemRenderer,
          creatorButtonProps: {
            creatorButtonText: `Add`,
          },
        } as Partial<ComponentProps<typeof ProFormList>>,
        columns: columns,
        ...columnPropsRest,
      });
    }

    return coreProps.columnFunction({
      title: _title,
      dataIndex: _dataIndex as any,
      ...columnRest,
    });
  };

  const traverse = (
    dataIndexTrail: (string | number)[],
    columnSchema:
      | Schema<T, CustomValueTypes>
      | SchemaPartial<T, CustomValueTypes>
      | SchemaLoose<T, CustomValueTypes>
  ) => {
    const result = Object.entries(columnSchema).map(([key, _col]) => {
      const column = _col as Record<string, any>;
      // base case: node is a column -> create column
      if ("_title" in column && !("_columns" in column)) {
        return createColumn(
          [...dataIndexTrail, key],
          column as SchemaColumnProps<T, CustomValueTypes>
        );
      }
      // case b: node is enumerable, create FormList column
      if ("_columns" in column) {
        return createColumn(
          [...dataIndexTrail, key],
          column as SchemaColumnArrayProps<T, CustomValueTypes>
        );
      }
      // general case: regular traverse
      return traverse([...dataIndexTrail, key], column as any);
    }) as any[];
    return result;
  };

  const result = flattenDeep(traverse(initialTrail ?? [], columnSchema));

  return result as ProColumns<T>[];
};
