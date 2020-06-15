// Copyright (c) 2014, Hugh Kennedy
// Based on code from https://github.com/hughsk/flat/blob/master/index.js

interface Options {
  delimiter?: string;
  maxDepth?: number;
}

export function flatten(target: object, opts: Options = { delimiter: '.', maxDepth: 4 }): any {
  let currentDepth = 1;
  const output: any = {};

  function step(object: any, prev: string | null) {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const type = Object.prototype.toString.call(value);
      const isObject = type === '[object Object]';
      const newKey = prev ? prev + opts.delimiter + key : key;

      if (isObject && Object.keys(value).length && currentDepth < (opts.maxDepth ?? currentDepth + 1)) {
        ++currentDepth;
        return step(value, newKey);
      }

      output[newKey] = value;
    });
  }

  step(target, null);

  return output;
}
