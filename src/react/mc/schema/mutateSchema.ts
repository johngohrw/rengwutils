// original typedefs:
// const mutateSchema = <T,>(
//   originalSchema: BOSchema<T> | BOSchemaPartial<T> | BOSchemaPartial<T, true>,
//   mutatorSchema: BOSchemaPartial<T, true>,
//   overwrite = false
// ) => {

/**
 * Mutates an existing schema.
 * The mutator object is Partial, which means you can selectively pick which columns to mutate.
 * Each selected column is then mutated - existing properties can either be inherited or otherwise.
 *
 * Pure function, no side effects.
 * @param originalSchema - original schema to start mutating from. won't be mutated.
 * @param mutatorSchema - mixin schema.
 * @param overwrite - whether to inherit existing properties in a column or not.
 */
export const mutateSchema = <T>(
  originalSchema: any,
  mutatorSchema: any,
  overwrite = false
) => {
  const traverse = (
    trail: (string | number)[],
    original: Record<any, any>,
    mutation: Record<any, any>
  ) => {
    const mutationKeys = Object.keys(mutation);
    const originalKeys = Object.keys(original);

    // traverse into "_columns", if it exists in the current node
    // it will be treated as a "nesting node" in the next traversal step
    let arrayMutations = {};
    if (originalKeys.includes("_columns")) {
      let arrayMutatedResult = { ...original["_columns"] };
      const hasArrayMutation = mutationKeys.includes("_columns");
      if (hasArrayMutation) {
        arrayMutatedResult = traverse(
          [...trail, "_columns"],
          original["_columns"],
          mutation["_columns"]
        );
      }
      arrayMutations = { _columns: arrayMutatedResult };
    }

    // traverse into "nesting nodes".
    // a node is considered a "nesting node" if it has no _title.
    // if it has _title, it's considered a "column".
    // a _columns node is considered a "column"
    // we also skip if the child key == "_columns" here
    const nestedMutations: Record<any, any> = {};
    const hasTitle = "_title" in original;
    if (!hasTitle) {
      for (const [oriChildKey, oriChildNode] of Object.entries(original)) {
        if (oriChildKey === "_columns") continue;
        if (mutationKeys.includes(oriChildKey)) {
          nestedMutations[oriChildKey] = traverse(
            [...trail, oriChildKey],
            original[oriChildKey],
            mutation[oriChildKey]
          );
        } else {
          nestedMutations[oriChildKey] = oriChildNode;
        }
      }
    }

    // only mutate if original node has _title.
    // remember - if it has _title, it's considered a "column".
    // don't include _columns here because it's been previously accounted for
    let mutatedNode = {};
    if (hasTitle) {
      const _original = { ...original };
      const _mutation = { ...mutation };
      if ("_columns" in _original) delete _original["_columns"];
      if ("_columns" in _mutation) delete _mutation["_columns"];
      mutatedNode = { ...(overwrite ? {} : _original), ..._mutation };
    }

    return { ...mutatedNode, ...arrayMutations, ...nestedMutations };
  };

  return traverse([], originalSchema, mutatorSchema);
};
