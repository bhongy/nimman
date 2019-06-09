/**
 * Global interfaces. Available in throughout the project. Only interfaces.
 */

declare namespace Nimman {
  export interface Server {
    readonly buildId: string;
  }
}

// Typescript decides on convenience over soundness here
// value type from accessing an index will not be nullable
// https://github.com/Microsoft/TypeScript/issues/9235
// Wraps with `Partial` makes it safer
// so Typescript errors if we don't handle the nullable case
declare type StrictRecord<K extends keyof any, V> = Partial<Record<K, V>>;
