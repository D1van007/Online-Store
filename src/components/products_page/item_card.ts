import { eventedPushState } from '../router/events_history';
import { LocalCart } from '../cart/cart_module/localCart';
import { IProduct } from '../../types';

export class ItemCard {
  selector: HTMLElement;
  id: number;
  product: IProduct;
  productDOM: HTMLElement;
  parentContainerDOM: HTMLElement;
  addToCartBtn: HTMLButtonElement;
  localCart: LocalCart;
  cartProducts: IProduct[] = [];
  constructor(id: number, product: IProduct, selector: HTMLElement) {
    this.selector = selector;
    this.parentContainerDOM = document.getElementById('main') as HTMLElement;
    this.id = id;
    this.product = product;
    this.renderProduct();
    this.productDOM = document.getElementById(this.id.toString()) as HTMLElement;
    this.addToCartBtn = this.productDOM.querySelector('.product__item--btn') as HTMLButtonElement;
    this.productEventTracker();
    this.localCart = new LocalCart();
    this.cartProducts = this.localCart.getLocalCartProducts();
  }

  renderProduct() {
    this.selector.insertAdjacentHTML('beforeend', renderHTML(this.id, this.product));
  }

  selfPageRender() {
    this.parentContainerDOM.innerHTML = selfPageHTML(this.product);
  }

  productEventTracker() {
    this.productDOM.addEventListener('click', e => {
      if (e.target === this.addToCartBtn) {
        if (this.addToCartBtn.classList.contains('add-to-cart')) {
          this.addToCartBtn.classList.add('remove-from-cart');
          this.addToCartBtn.classList.remove('add-to-cart');
          this.addToCartBtn.textContent = 'Remove cart';
          this.setLocalProductsInCart();
          if (!JSON.parse(localStorage.getItem(`id${this.productDOM.id}`) as string)) {
            localStorage.setItem(`id${this.productDOM.id}`, JSON.stringify(1));
          }
        } else if (this.addToCartBtn.classList.contains('remove-from-cart')) {
          this.addToCartBtn.classList.remove('remove-from-cart');
          this.addToCartBtn.classList.add('add-to-cart');
          this.addToCartBtn.textContent = 'Add cart';
          this.localCart.removeProducrFromCart(this.productDOM);
          localStorage.removeItem(`id${this.productDOM.id}`);
        }
        this.localCart.setTotalPrice();
        this.localCart.setTotalProducts();
      } else {
        eventedPushState({}, '', `/product${this.id}`);
      }
    });
  }

  setLocalProductsInCart() {
    if (localStorage.getItem('productsInCart')) {
      this.cartProducts = this.localCart.getLocalCartProducts();
      if (!this.cartProducts.some(e => e.id == this.id)) {
        this.cartProducts.push(this.product);
        localStorage.setItem('productsInCart', JSON.stringify(this.cartProducts));
      }
    } else {
      this.cartProducts = [];
      this.cartProducts.push(this.product);
      localStorage.setItem('productsInCart', JSON.stringify(this.cartProducts));
    }
  }
}

function renderHTML(id: number, data: IProduct): string {
  const productsInCart = JSON.parse(localStorage.getItem('productsInCart') as string);
  if (productsInCart && productsInCart.some((e: { id: number }) => e.id == id)) {
    return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.thumbnail});">
    <h3 class="product__item--title">${data.title}</h3>
    <div class="product__item--price">${data.price}</div>
    <button id = "product__item--btn${id}" class="product__item--btn remove-from-cart">Remove cart</button>
  </li>
  `;
  } else {
    return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.thumbnail});">
  <h3 class="product__item--title">${data.title}</h3>
  <div class="product__item--price">${data.price}</div>
  <button id = "product__item--btn${id}" class="product__item--btn add-to-cart">Add cart</button>
</li>
`;
  }
}

function selfPageHTML(data: IProduct) {
  return `<h1>NAME:${data.title} ID:${data.id}</h1>`;
}
