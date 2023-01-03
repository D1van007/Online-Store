import { IProduct } from '../../types';
import { ProductsPage } from './products_page';
import { searchHandler } from '../search_handler/search_handler';
import { FilterKeys } from '../../types';

export class Pagination {
  parentDOM: HTMLElement;
  data: IProduct[];
  parent: ProductsPage;
  productOnPage = 16;
  currentPage = 0;
  ulContainerDOM: HTMLUListElement;
  constructor(selector: HTMLElement, data: IProduct[], parent: ProductsPage) {
    this.parentDOM = selector;
    this.data = data;
    this.parent = parent;
    this.ulContainerDOM = this.render();
    this.createEventHandler();
    this.coloredCurrent();
  }
  render(): HTMLUListElement {
    this.parentDOM.insertAdjacentHTML('beforeend', getHTML());
    const pageCount = this.data.length / this.productOnPage;
    const ulDOM = this.parentDOM.querySelector('.pagination__list');
    for (let i = 0; i < pageCount; i++) {
      ulDOM?.insertAdjacentHTML('beforeend', `<li class="pagination__list__item">${i + 1}</li>`);
    }
    return ulDOM as HTMLUListElement;
  }
  createEventHandler() {
    this.ulContainerDOM.addEventListener('click', e => {
      if (e.target instanceof HTMLLIElement) {
        console.log(e.target.textContent);
        this.currentPage = Number(e.target.textContent) - 1;
        this.parent.reloadPagination();
        this.coloredCurrent();
      }
    });
  }
  coloredCurrent() {
    const listDOM = this.parentDOM.querySelectorAll('.pagination__list__item');
    listDOM.forEach(e => {
      (e as HTMLElement).style.color = `rgb(230, 230, 230)`;
      if (Number(e.textContent) == this.currentPage + 1) {
        (e as HTMLElement).style.color = `rgb(67, 97, 153)`;
      }
    });
  }
  pushToSearch() {
    searchHandler.addParams(FilterKeys.page, this.currentPage.toString());
  }
  destroy() {
    const container = this.parentDOM.querySelector('.pagination') as HTMLElement;
    this.parentDOM.removeChild(container);
  }
}

function getHTML(): string {
  return `
    <div class="pagination">
      <ul class="pagination__list">
      </ul>
    </div>
  `;
}
