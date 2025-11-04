import { InputProps } from "antd";
import { Schema } from "../schema/schemaTypes";
import { ProFieldValueType } from "@ant-design/pro-components";

export type DropdownType = {
  value: any;
  label: string | number;
} & Record<any, any>;

export type ExtractObj<T> = Extract<T, object>;

export type ParamsOf<T extends undefined | ((...args: any) => any)> =
  Parameters<NonNullable<T>>;

// https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
export type DeepKeyPathTreeUnbounded<T> = {
  [P in keyof T]-?: T[P] extends object
    ? [P] | [P, ...DeepKeyPathUnbounded<T[P]>]
    : [P];
};

export type DeepKeyPathUnbounded<T> = DeepKeyPathTreeUnbounded<T>[keyof T];

// depth-bounded version of the above.
export type DeepKeyPathTree<T, Depth extends number = 3> = [Depth] extends [
  never
]
  ? never
  : {
      [P in keyof T]-?: T[P] extends object
        ? [P] | [P, ...DeepKeyPath<T[P], Prev[Depth]>]
        : [P];
    };

export type DeepKeyPath<T, Depth extends number = 3> = DeepKeyPathTree<
  T,
  Depth
>[keyof T];

// Helper type to decrease recursion depth
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// type CustomVTs = {
//   monospaced: InputProps;
// };
// export type CustomFieldValueType = Extract<keyof CustomVTs, any>;

// export type AllValueTypes = ProFieldValueType | CustomFieldValueType;

// type BOSchema<T> = Schema<T, AllValueTypes>;

// type Person = {
//   name: string;
//   age: number;
//   address: string;
// };

// const schema: BOSchema<Person> = {
//   address: {
//     _title: "Address",
//     valueType: "monospaced",
//   },
//   age: {
//     _title: "Age",
//   },
//   name: {
//     _title: "Name",
//   },
// };
