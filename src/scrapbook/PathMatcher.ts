interface PathnameMatcher {
  test(path: string): boolean;
}

class ExactPathMatcher implements PathnameMatcher {
  constructor(private readonly pattern: string) {}

  test(path: string): boolean {
    return this.pattern === path;
  }
}

class ParamsPathMatcher implements PathnameMatcher {
  constructor(private readonly pattern: string) {}

  test(path: string): boolean {
    return true;
  }
}
