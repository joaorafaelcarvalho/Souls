export class CatalogValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'CatalogValidationError';
  }
}