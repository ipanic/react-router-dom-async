export class NotFoundError extends Error {

  constructor(public readonly path: string) {
    super();
  }
}