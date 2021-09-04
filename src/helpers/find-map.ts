export function findMap<T, U>(array: T[], mapper: (value: T) => (U | undefined)): [T, U] | undefined {
  for (let it of array) {
    let result = mapper(it);
    if (result !== undefined) {
      return [it, result];
    }
  }
  return undefined;
}