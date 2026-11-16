interface ImportMeta {
  glob<T = unknown>(
    pattern: string,
    options?: { readonly eager?: boolean; readonly import?: string }
  ): Record<string, T>;
}