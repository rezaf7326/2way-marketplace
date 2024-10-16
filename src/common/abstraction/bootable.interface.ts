export interface Bootable {
  /**
   * The boot method will be only called once at application bootstrap
   */
  boot(...args: Array<any>): void | Promise<void>;
}
