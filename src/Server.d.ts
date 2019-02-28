// the abstract Server interface that can be called regardless of prod/dev
export interface ServerInterface {
  readonly buildId: string;
}
