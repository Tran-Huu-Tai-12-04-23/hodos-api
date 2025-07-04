export {};

declare global {
  interface Array<T> {
    deepCopy(): Array<T>;
  }
}
Array.prototype.deepCopy = function <T>(): T[] {
  function cloneDeep(value: any): any {
    if (Array.isArray(value)) {
      return value.map(cloneDeep);
    } else if (value && typeof value === 'object') {
      const cloned: any = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          cloned[key] = cloneDeep(value[key]);
        }
      }
      return cloned;
    } else {
      return value;
    }
  }

  return cloneDeep(this);
};
