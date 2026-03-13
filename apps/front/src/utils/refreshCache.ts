export default class RefreshCache<T> {
  private cache: Promise<T> | undefined = undefined;
  private listener: ((cache: Promise<T>) => Promise<void>)[] = [];
  constructor(
    private execute: () => Promise<T>,
    private maxAge?: number
  ) {}

  use(fn: (cache: Promise<T>) => Promise<void>) {
    if (!this.cache) {
      this.cache = this.execute();
      this.waitClearCache();
    }
    fn(this.cache);

    this.listener.push(fn);
    return () => {
      return (this.listener = this.listener.filter((item) => item !== fn));
    };
  }

  refresh() {
    this.cache = undefined;

    this.cache = this.execute();
    this.waitClearCache();
    this.listener.forEach((fn) => fn(this.cache!));
  }

  async waitClearCache() {
    this.cache?.catch(() => {
      this.cache = undefined;
    });

    if (!this.maxAge || !this.cache) return;

    await this.cache;

    setTimeout(() => {
      this.cache = undefined;
    }, this.maxAge);
  }
}
