import { Injectable } from '@angular/core';

@Injectable()
export class StorageProvider {

  constructor() {
  }
  set(key, value) {
    return localStorage.setItem(key, value);
  }
  get(key) {
    return localStorage.getItem(key);
  }
  remove(...args) {
    args.forEach((arg) => {
      localStorage.removeItem(arg);
    });
  }
  clear() {
    localStorage.clear();
  }

}
