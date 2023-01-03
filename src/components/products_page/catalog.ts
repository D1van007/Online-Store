import { IProduct } from '../../types';
import { ItemCard } from './item_card';

export class Catalog {
  data: IProduct[];
  parentDOM: HTMLElement;
  catalogContainerDOM: HTMLElement | null = null;
  productListDOM: HTMLUListElement;
  productsArr: ItemCard[] = [];
  productOnPage:number = 16
  currentPage:number
  constructor(selector: string, data: IProduct[],currentPage:number) {
    this.currentPage = currentPage
    this.parentDOM = document.getElementById(selector)!;
    this.data = data;
    this.productListDOM = this.createContainers();
    this.renderProducts();
  }
  createContainers(): HTMLUListElement {
    this.catalogContainerDOM = document.createElement('div');
    this.catalogContainerDOM.classList.add('catalog');
    this.parentDOM.insertAdjacentElement('beforeend', this.catalogContainerDOM);
    const productList = document.createElement('ul');
    productList.classList.add('product-list');
    this.catalogContainerDOM.insertAdjacentElement('beforeend', productList);
    return productList;
  }
  renderProducts() {
    const itemStart = this.productOnPage*this.currentPage
    const itemEnd = this.productOnPage*this.currentPage+this.productOnPage-1
    if (this.data.length > 0) {
      this.data.forEach((e,i) => {
        console.log(i,itemEnd,i<itemEnd)
        console.log(i>itemStart,i<itemEnd)
        if(i>=itemStart&&i<=itemEnd){
          const card = new ItemCard(e.id, e, this.productListDOM);
          this.productsArr.push(card);
        }
      });
    }
  }
  destroy() {
    if (this.catalogContainerDOM) this.parentDOM.removeChild(this.catalogContainerDOM);
  }
}
