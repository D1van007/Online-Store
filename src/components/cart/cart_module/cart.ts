import { IProduct } from '../../../types';
import { ProductInCart } from './productCart';
import { TotalBuy } from './totalBuyCart';
import { LocalCart } from './localCart';

export class Cart {
  parentConteiner: HTMLElement;
  cartConteiner: HTMLElement | null | undefined;
  productInCart: IProduct[];
  localCart: LocalCart;
  constructor(selector: string) {
    this.parentConteiner = document.querySelector(selector) as HTMLElement;
    this.cartConteiner = null;
    this.localCart = new LocalCart();
    this.productInCart = this.localCart.getLocalCartProducts();
    this.renderCartContent();
  }

  renderCartContent() {
    if (this.productInCart && this.productInCart.length > 0) {
      this.cartConteiner = document.createElement('div');
      this.cartConteiner.classList.add('cart_conteiner');
      this.parentConteiner.prepend(this.cartConteiner);
      this.cartConteiner.innerHTML = createHTMLConteiner();
      this.renderCartProductList();
      this.renderCartTotalBuy();
    }
  }
  renderCartProductList() {
    const productListDOM = document.querySelector('.products-cart_list') as HTMLUListElement;
    this.productInCart.forEach((e, index) => {
      if (!JSON.parse(localStorage.getItem(`productAmount-id${e.id}`) as string)) {
        localStorage.setItem(`productAmount-id${e.id}`, JSON.stringify(1));
      }
      new ProductInCart(e, productListDOM, index);
    });
  }
  renderCartTotalBuy() {
    const productsTotalBuy = document.querySelector('.total-cart_content') as HTMLElement;
    new TotalBuy(productsTotalBuy);
  }
}
function createHTMLConteiner() {
  return ` 
    <div class="products-cart_content">
        <ul class="products-cart_list">
        </ul>
    </div>
    <div class="total-cart_content"></div>`;
}