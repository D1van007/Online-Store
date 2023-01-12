import { IProduct, DataKeys, FilterKeys } from '../../types';
import { Catalog } from './catalog';
import './styles.css';
import { SideFilter } from './side_filter';
import { searchHandler } from '../search_handler/search_handler';
import { CopyClearURL } from './copy_clear';
import { Pagination } from './pagination';

export class ProductsPage {
  data: IProduct[];
  currentData: IProduct[];
  mainDOM: HTMLElement;
  containerDOM: HTMLDivElement;
  searchDOM!: HTMLInputElement;
  sortDOM!: HTMLInputElement;
  totalCountDOM!: HTMLElement;
  pagination: Pagination;
  catalog: Catalog;
  copyClearURL: CopyClearURL;
  sideFilter: SideFilter | null;
  optionsDOM!: HTMLElement;
  paginationPage = 0;
  constructor(selector: string, data: IProduct[]) {
    this.mainDOM = document.getElementById(selector) as HTMLElement;
    this.data = data;
    this.currentData = this.data;
    this.containerDOM = this.createAndReturnContainer();
    this.renderContent();
    this.searchInput();
    this.pagination = new Pagination(this.containerDOM, this.currentData, this, this.paginationPage);
    this.catalog = new Catalog('products-page', this.data, this.pagination.currentPage);
    this.sideFilter = new SideFilter('products-page', this.data, data => this.sideFilterHandler(data));
    this.copyClearURL = new CopyClearURL(this.containerDOM);
    this.sortInput();
    this.renderTotalCount();
    this.setParamsIsBig();
    this.updateSearchParamsFromURL();
  }
  createAndReturnContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('products-page');
    container.id = 'products-page';
    this.mainDOM.insertAdjacentElement('afterbegin', container);
    return container;
  }
  renderContent() {
    this.containerDOM.innerHTML = renderHTML();
    this.optionsDOM = this.containerDOM.querySelector('.options-bar') as HTMLElement;
    this.searchDOM = this.containerDOM.querySelector('.options-bar__search') as HTMLInputElement;
    this.sortDOM = this.containerDOM.querySelector('.options-bar__sort') as HTMLInputElement;
    this.totalCountDOM = this.containerDOM.querySelector('.options-bar__total') as HTMLElement;
  }
  renderTotalCount() {
    this.totalCountDOM.textContent = ` count: ${this.currentData.length}`;
    if(this.currentData.length===0&&this.catalog.catalogContainerDOM){
      this.catalog.catalogContainerDOM.innerHTML = `<span>Sorry nothing was found(</span>`
    }
  }
  searchInput() {
    this.searchDOM.addEventListener('input', () => {
      if (this.searchDOM.value) {
        searchHandler.addParams(FilterKeys.search, this.searchDOM.value); //тестим
      } else {
        searchHandler.deleteParams(FilterKeys.search);
      }
      this.inputHandler();
    });
  }

  inputHandler() {
    const filterData = this.searchDataFilter(this.searchDOM.value);
    if (this.sideFilter) {
      this.sideFilter.arrayOfDataAllFilters.search = filterData;
      this.sideFilterHandler(this.sideFilter.getFilteredData());
      this.sideFilter.updateCheckBoxSections();
      this.sideFilter.updatePriceAndStockRange();
    }
  }
  rerenderCatalog() {
    this.copyClearURL.copyBtnDOM.classList.remove('btn-active')
    this.pagination.destroy();
    this.pagination = new Pagination(this.containerDOM, this.currentData, this, this.paginationPage);
    this.catalog.destroy();
    this.catalog = new Catalog('products-page', this.currentData, this.pagination.currentPage);
  }
  reloadPagination() {
    this.catalog.destroy();
    this.catalog = new Catalog('products-page', this.currentData, this.pagination.currentPage);
  }
  searchDataFilter(value: string): IProduct[] {
    return this.data.filter(e => e.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }
  sideFilterHandler(data: IProduct[]) {
    this.currentData = data;
    this.sortHandler();
    this.rerenderCatalog();
    this.renderTotalCount();
  }
  sortInput() {
    this.sortDOM.addEventListener('change', () => {
      searchHandler.addParams(FilterKeys.sort, this.sortDOM.value);
      this.sortHandler();
      this.rerenderCatalog();
    });
  }

  sortHandler() {
    switch (this.sortDOM.value) {
      case 'raitingASC':
        this.currentData = this.currentData.sort((a, b) => a.rating - b.rating);
        break;
      case 'raitingDESC':
        this.currentData = this.currentData.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceASC':
        this.currentData = this.currentData.sort((a, b) => a.price - b.price);
        break;
      case 'priceDESC':
        this.currentData = this.currentData.sort((a, b) => b.price - a.price);
        break;
      case 'discountASC':
        this.currentData = this.currentData.sort((a, b) => a.discountPercentage - b.discountPercentage);
        break;
      case 'discountDESC':
        this.currentData = this.currentData.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
    }
  }
  //обновляет сострояния фильтров по данным из URL
  updateSearchParamsFromURL() {
    if (searchHandler.currentUrl.pathname == '/') {
      const searchParams = searchHandler.currentUrl.searchParams;

      if (searchParams.has(FilterKeys.page)) {
        const value = searchParams.get(FilterKeys.page) as string;
        this.paginationPage = Number(value);
      } else {
        this.paginationPage = 0;
      }

      if (searchParams.has(FilterKeys.sort)) {
        const value = searchParams.get(FilterKeys.sort) as string;
        this.sortDOM.value = value;
        this.sortHandler();
      } else {
        this.sortDOM.value = 'raitingASC';
        this.sortHandler();
      }

      if (searchParams.has(DataKeys.price)) {
        const value = searchParams.get(DataKeys.price) as string;
        const arr = JSON.parse(value);
        this.sideFilter?.priceInput.setRangeValue(arr[0], arr[1], true);
      } else {
        const arr = this.sideFilter?.priceInput.default;
        if (arr) this.sideFilter?.priceInput.setRangeValue(arr[0], arr[1], true);
      }

      if (searchParams.has(DataKeys.stock)) {
        const value = searchParams.get(DataKeys.stock) as string;
        const arr = JSON.parse(value);
        this.sideFilter?.stockInput.setRangeValue(arr[0], arr[1], true);
      } else {
        const arr = this.sideFilter?.stockInput.default;
        if (arr) this.sideFilter?.stockInput.setRangeValue(arr[0], arr[1], true);
      }

      if (searchParams.has(DataKeys.category)) {
        const value = searchParams.get(DataKeys.category) as string;
        this.sideFilter?.categoryCheck.checkFormArray(JSON.parse(value));
      } else {
        this.sideFilter?.categoryCheck.checkFormArray(['костыль']); //пока так
      }

      if (searchParams.has(DataKeys.brand)) {
        const value = searchParams.get(DataKeys.brand) as string;
        this.sideFilter?.brandCheck.checkFormArray(JSON.parse(value));
      } else {
        this.sideFilter?.brandCheck.checkFormArray(['костыль']); //пока так
      }

      if (searchParams.has(FilterKeys.search)) {
        const value = searchParams.get(FilterKeys.search) as string;
        this.searchDOM.value = value;
        this.inputHandler();
      } else {
        this.searchDOM.value = '';
        this.inputHandler();
      }
    }
  }

  setParamsIsBig() {
    this.optionsDOM.addEventListener('click', event => {
      if ((<HTMLElement>event.target).matches('.options-bar__small-item')) {
        searchHandler.addParams(FilterKeys.big, 'false');
        this.rerenderCatalog();
      } else if ((<HTMLElement>event.target).matches('.options-bar__big-item')) {
        searchHandler.addParams(FilterKeys.big, 'true');
        this.rerenderCatalog();
      }
    });
  }
}

function renderHTML(): string {
  return `
    <div class="options-bar">
      <input class = "options-bar__search" placeholder="Enter some text" name="name" />
      <select class = "options-bar__sort">
        <option value="raitingASC">Sort by raiting</option>
        <option value="raitingDESC">Sort by raiting DESC</option>
        <option value="priceASC">Sort by price ASC</option>
        <option value="priceDESC">Sort by price DESC</option>
        <option value="discountASC">Sort by discount ASC</option>
        <option value="discountDESC">Sort by discount DESC</option>
      </select>
      <span class="options-bar__total"></span>
      <i class="fa-solid fa-list options-bar__small-item"></i>
      <i class="fa-solid fa-grip-vertical options-bar__big-item"></i>
    </div>  
  `;
}
// function btnFromURL() {
//   throw new Error('Function not implemented.');
// }
