import { ProColumns, ProFieldValueType } from "@ant-design/pro-components";
import { FormItemProps, FormRule } from "antd";
import { capitalize } from "lodash";

export const insertRules = <T extends FormItemProps<any> | undefined>(
  mixinProps: T,
  originalProps: T
) => ({
  ...mixinProps,
  ...originalProps,
  rules: [...(originalProps?.rules ?? []), ...(mixinProps?.rules ?? [])],
});

export const getRequiredRule = (
  required: undefined | string | boolean,
  title?: string | number
): FormRule[] => {
  const hasRule = required !== undefined;
  const genericMessage = `Please enter ${title}`;
  const maybeMessage =
    typeof required === "string"
      ? { message: required }
      : { message: genericMessage };
  return hasRule ? [{ required: !!required, ...maybeMessage }] : [];
};

// Default placeholders for certain valueTypes are mapped here
export const getDefaultPlaceholder = (column: Partial<ProColumns>) => {
  const valueType = column.valueType as ProFieldValueType;
  let title = column.title;

  // title might be a function
  if (typeof title === "function") {
    title = title({}, undefined, undefined);
  }

  const defaultPlaceholder = `Please enter ${title}`;
  const valueTypeMap: Partial<Record<ProFieldValueType, any>> = {
    select: `Please select ${title}`,
  };

  return valueType in valueTypeMap
    ? valueTypeMap[valueType]
    : defaultPlaceholder;
};

enum showInEnum {
  TABLE = "table",
  DESCRIPTION = "description",
  SEARCH = "search",
  FORM = "form",
  SETTING = "setting",
}

export type ShowInValues = `${showInEnum}`;

export const processHideWhitelist = (whitelist: ShowInValues[]) => {
  const allValues = Object.values(showInEnum);
  const filtered = allValues.filter((o) => !whitelist.includes(o));
  const result: Record<string, any> = {};
  filtered.forEach((section) => {
    result[`hideIn${capitalize(section)}`] = true;
  });
  return result;
};
