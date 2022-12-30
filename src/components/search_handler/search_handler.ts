import { DataKeys, FilterKeys } from '../../types';

export class SearchHandler {
  currentUrl: URL;
  constructor() {
    this.currentUrl = new URL(window.location.href);
  }
  parseUrl() {
    this.currentUrl = new URL(window.location.href);
  }
  addParams(name: DataKeys | FilterKeys, value: string | number[] | string[]) {
    let strValue: string;
    if (typeof value == 'string') {
      strValue = value;
    } else {
      strValue = JSON.stringify(value);
    }
    if (strValue) {
      this.currentUrl.searchParams.set(name, strValue);
    }
    history.pushState({}, '', this.currentUrl.pathname + '?' + this.currentUrl.searchParams.toString());
  }

  deleteParams(name: DataKeys | FilterKeys) {
    this.currentUrl.searchParams.delete(name);
    if (this.currentUrl.searchParams.toString()) {
      history.pushState({}, '', this.currentUrl.pathname + '?' + this.currentUrl.searchParams.toString());
    } else {
      history.pushState({}, '', this.currentUrl.pathname);
    }
  }
}

export const searchHandler = new SearchHandler();
