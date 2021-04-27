export class UnhandledExceptionError extends Error {

  constructor(public readonly path: string) {
    super();
  }
}
