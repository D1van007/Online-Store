import { IProduct } from '../../../types';
import { ProductInCart } from './productCart';
import { TotalBuy } from './totalBuyCart';
import { LocalCart } from './localCart';

export class Cart {
  parentContainer: HTMLElement;
  cartContainer!: HTMLElement;
  productInCart: IProduct[];
  localCart: LocalCart;
  constructor(selector: string) {
    this.parentContainer = document.querySelector(selector) as HTMLElement;
    this.localCart = new LocalCart();
    this.productInCart = this.localCart.getLocalCartProducts();
    this.renderCartContent();
  }

  renderCartContent() {
    if (this.productInCart?.length > 0) {
      this.cartContainer = document.createElement('div');
      this.cartContainer.classList.add('cart__container');
      this.parentContainer.prepend(this.cartContainer);
      this.cartContainer.innerHTML = createHTMLContainer();
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
    new TotalBuy(productsTotalBuy,this);
  }
}

function createHTMLContainer(): string {
  return ` 
    <div class="cart-products__content">
        <ul class="cart-products__list">
        </ul>
    </div>
    <div class="cart-total__content"></div>`;
}
