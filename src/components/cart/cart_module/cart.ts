import { IProduct } from '../../../types';
import { ProductInCart } from './productCart';
import { TotalBuy } from './totalBuyCart';
import { LocalCart } from './localCart';

export class Cart {
  parentConteiner: HTMLElement;
  cartConteiner!: HTMLElement;
  productInCart: IProduct[];
  localCart: LocalCart;
  constructor(selector: string) {
    this.parentConteiner = document.querySelector(selector) as HTMLElement;
    this.localCart = new LocalCart();
    this.productInCart = this.localCart.getLocalCartProducts();
    this.renderCartContent();
  }

  renderCartContent() {
    if (this.productInCart?.length > 0) {
      this.cartConteiner = document.createElement('div');
      this.cartConteiner.classList.add('cart__conteiner');
      this.parentConteiner.prepend(this.cartConteiner);
      this.cartConteiner.innerHTML = createHTMLConteiner();
      this.renderCartProductList();
      this.renderCartTotalBuy();
    }
  }

  renderCartProductList() {
    const productListDOM = document.querySelector('.cart-products__list') as HTMLUListElement;
    this.productInCart.forEach((e, index) => {
      if (!JSON.parse(localStorage.getItem(`id${e.id}`) as string)) {
        localStorage.setItem(`id${e.id}`, JSON.stringify(1));
      }
      new ProductInCart(e, productListDOM, index);
    });
  }

  renderCartTotalBuy() {
    const productsTotalBuy = document.querySelector('.cart-total__content') as HTMLElement;
    new TotalBuy(productsTotalBuy);
  }
}

function createHTMLConteiner(): string {
  return ` 
    <div class="cart-products__content">
        <ul class="cart-products__list">
        </ul>
    </div>
    <div class="cart-total__content"></div>`;
}
