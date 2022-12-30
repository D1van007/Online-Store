import { IProduct } from '../../types';
import { ItemCard } from './item_card';

export class Catalog {
  data: IProduct[];
  parentDOM: HTMLElement;
  catalogContainerDOM: HTMLElement | null = null;
  productListDOM: HTMLUListElement;
  productsArr: ItemCard[] = [];
  constructor(selector: string, data: IProduct[]) {
    this.parentDOM = document.getElementById(selector) as HTMLElement;
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
    if (this.data.length > 0) {
      this.data.forEach(e => {
        const card = new ItemCard(e.id, e, this.productListDOM);
        this.productsArr.push(card);
      });
    }
  }
  destroy() {
    if (this.catalogContainerDOM) this.parentDOM.removeChild(this.catalogContainerDOM);
  }
}
