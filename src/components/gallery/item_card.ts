import { eventedPushState } from '../router/events_history';
import { LocalCart } from '../cart/cart_module/localCart';
import { IProduct } from '../../types';

export class ItemCard {
  selector: HTMLElement;
  id: number;
  product: IProduct;
  productDOM: HTMLElement;
  parentConteinerDOM: HTMLElement;
  addToCartBtn: HTMLButtonElement;
  localCart: LocalCart;
  cartProducts: IProduct[] = [];
  constructor(id: number, product: IProduct, selector: HTMLElement) {
    this.selector = selector;
    this.parentConteinerDOM = document.getElementById('main') as HTMLElement;
    this.id = id;
    this.product = product;
    this.renderProduct();
    this.productDOM = document.getElementById(this.id.toString()) as HTMLElement;
    this.addToCartBtn = this.productDOM.querySelector('.btn_from-to-cart') as HTMLButtonElement;
    this.productEventTracker();
    this.cartProducts = JSON.parse(window.localStorage.getItem('products_inCart') as string);
    this.localCart = new LocalCart();
  }

  renderProduct() {
    this.selector.insertAdjacentHTML('beforeend', renderHTML(this.id, this.product));
  }
  selfPageRender() {
    this.parentConteinerDOM.innerHTML = selfPageHTML(this.product);
  }
  productEventTracker() {
    this.productDOM.addEventListener('click', e => {
      if (e.target === this.addToCartBtn) {
        if (this.addToCartBtn.classList.contains('add-to-cart')) {
          this.addToCartBtn.classList.add('remove-from-cart');
          this.addToCartBtn.classList.remove('add-to-cart');
          this.addToCartBtn.textContent = 'Remove cart';
          this.setLocalProductsInCart();
          if (!JSON.parse(localStorage.getItem(`productAmount-id${this.productDOM.id}`) as string)) {
            localStorage.setItem(`productAmount-id${this.productDOM.id}`, JSON.stringify(1));
          }
        } else if (this.addToCartBtn.classList.contains('remove-from-cart')) {
          this.addToCartBtn.classList.remove('remove-from-cart');
          this.addToCartBtn.classList.add('add-to-cart');
          this.addToCartBtn.textContent = 'Add cart';
          this.localCart.removeProducrFromCart(this.productDOM);
          localStorage.removeItem(`productAmount-id${this.productDOM.id}`);
        }
        this.localCart.setTotalPrice();
        this.localCart.setTotalProducts();
      } else {
        eventedPushState({}, '', `/product${this.id}`);
      }
    });
  }
  setLocalProductsInCart() {
    if (localStorage.getItem('products_inCart')) {
      this.cartProducts = this.localCart.getLocalCartProducts();
      if (!this.cartProducts.some(e => e.id == this.id)) {
        this.cartProducts.push(this.product);
        localStorage.setItem('products_inCart', JSON.stringify(this.cartProducts));
      }
    } else {
      this.cartProducts = [];
      this.cartProducts.push(this.product);
      localStorage.setItem('products_inCart', JSON.stringify(this.cartProducts));
    }
  }
}

function renderHTML(id: number, data: IProduct): string {
  const productsInCart = JSON.parse(localStorage.getItem('products_inCart') as string);
  if (productsInCart && productsInCart.some((e: { id: number }) => e.id == id)) {
    return `
  <li class="product_item" id = "${id}" style = "background-image: url(${data.images[0]});">
    <h3 class="product_item__title">${data.title}</h3>
    <div class="product_item__price">${data.price}</div>
    <button id = "btn_cart-${id}" class="remove-from-cart btn_from-to-cart">Remove cart</button>
  </li>
  `;
  } else {
    return `
  <li class="product_item" id = "${id}" style = "background-image: url(${data.images[0]});">
  <h3 class="product_item__title">${data.title}</h3>
  <div class="product_item__price">${data.price}</div>
  <button id = "btn_cart-${id}" class="add-to-cart btn_from-to-cart">Add cart</button>
</li>
`;
  }
}

function selfPageHTML(data: IProduct) {
  return `<h1>NAME:${data.title} ID:${data.id}</h1>`;
}
