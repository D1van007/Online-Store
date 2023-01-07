import { LocalCart } from './localCart';
import { ProductInCart } from './productCart';

export class ProductsCartList {
  localCart: LocalCart;
  // productListDOM: HTMLUListElement;
  constructor() {
    this.localCart = new LocalCart();
    // this.productListDOM = document.querySelector('.cart-products__list') as HTMLUListElement;
  }
  renderCartProductList() {
    const productListDOM = document.querySelector('.cart-products__list') as HTMLUListElement;
    if (productListDOM) {
      productListDOM.innerHTML = '';
      const currentProductInCart = this.localCart.getLocalCartProducts();
      const productPage = (document.getElementById('controll__page-numbers--value') as HTMLElement).textContent;
      const productLimite = (document.getElementById('controll__limit--value') as HTMLInputElement).valueAsNumber;
      const productOnPage = currentProductInCart.slice(
        (+productPage! - 1) * productLimite,
        (+productPage! - 1) * productLimite + productLimite,
      );

      productOnPage.forEach(element => {
        new ProductInCart(element, productListDOM, currentProductInCart.indexOf(element));
      });
    }
  }
}
