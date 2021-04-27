export function findMap<T, U>(array: T[], map: (value: T) => (U | undefined)): [T, U] | undefined {
  for (let it of array) {
    let result = map(it);
    if (result !== undefined) {
      return [it, result];
    }
  }
  return undefined;
}