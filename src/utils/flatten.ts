import { isPlainObject } from 'lodash';

export function flatten(target: object): any {
  const output: any = {};

  function step(object: any, prev: string | null) {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const newKey = prev ? prev + '.' + key : key;

      if (isPlainObject(value) && Object.keys(value).length) {
        return step(value, newKey);
      }

      if (Array.isArray(value)) {
        value.forEach((val, index) => {
          if (isPlainObject(val)) {
            step(val, newKey + index);
          } else {
            output[newKey + index] = val;
          }
        });
        return;
      }

      output[newKey] = value;
    });
  }

  step(target, null);

  return output;
}
