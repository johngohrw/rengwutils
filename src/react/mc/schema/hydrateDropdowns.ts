import { update } from "lodash";
import {
  Schema,
  SchemaDropdownMap,
  SchemaLoose,
  SchemaPartial,
} from "./schemaTypes";

type DropdownType = { label: string; value: any };

export const hydrateDropdowns = <T, CustomValueTypes>(
  schema:
    | Schema<T, CustomValueTypes>
    | SchemaPartial<T, CustomValueTypes>
    | SchemaPartial<any, CustomValueTypes, true>
    | SchemaLoose<T, CustomValueTypes>,
  dropdownMap: SchemaDropdownMap<T, CustomValueTypes>
) => {
  const result = { ...schema };
  const traverse = (
    trail: (string | number)[],
    node: Record<any, any>,
    optionMap: Record<any, any>
  ) => {
    const commonKeys = Object.keys(node).filter((key) =>
      Object.keys(optionMap).includes(key)
    );
    commonKeys.forEach((key) => {
      if (Array.isArray(optionMap[key])) {
        insertDropdownOptions([...trail, key], optionMap[key]);
        return;
      }

      if ("_columns" in node[key]) {
        traverse(
          [...trail, key, "_columns"],
          node[key]._columns,
          optionMap[key]["_columns"]
        );
        return;
      }

      traverse([...trail, key], node[key], optionMap[key]);
    });
  };

  const insertDropdownOptions = (
    trail: (string | number)[],
    options: DropdownType[]
  ) => {
    update(result, trail, (prev) => ({
      ...prev,
      helperProps: {
        ...prev.helperProps,
        dropdownOptions: options,
      },
    }));
  };

  traverse([], schema, dropdownMap);
  return result;
};
