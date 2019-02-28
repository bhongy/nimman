export class IndexPage {
  // TODO: accepts "PagePath" type?
  static test(path: string): boolean {
    return /index\.ts$/i.test(path);
  }
}
