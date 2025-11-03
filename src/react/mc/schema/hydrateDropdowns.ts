import { update } from "lodash";

type DropdownType = { label: string; value: any };

// original types:
// const hydrateDropdowns = <T,>(
//   schema:
//     | BOSchema<T>
//     | BOSchemaPartial<T>
//     | BOSchemaPartial<any, true>
//     | BOSchemaLoose<T>,
//   dropdownMap: BOSchemaDropdownMap<T>
// )
export const hydrateDropdownsAux = (schema: any, dropdownMap: any) => {
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
