/**
 * A class that holds data that can be modified.
 * Useful for sharing data between different parts of the code,
 * without having to pass it back and forth.
 * @template T The type of data to hold.
 */
export class ModifiableData<T> {
  private data: T

  /**
   * Create a new ModifiableData instance.
   * @param {T} data The initial data.
   */
  constructor(data: T) {
    this.data = data
  }

  /**
   * Get the data.
   * @returns {T} The data.
   */
  public get(): T {
    return this.data
  }

  /**
   * Set the data.
   * @param {T} data The new data.
   */
  public set(data: T): void {
    this.data = data
  }
}
