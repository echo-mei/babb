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

  get historyUnitList() {
    return JSON.parse(this.get('historyUnitList'));
  }
  set historyUnitList(value: any[]) {
    this.set('historyUnitList', JSON.stringify(value));
  }

}
