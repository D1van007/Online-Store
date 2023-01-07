import { LocalCart } from './localCart';
import { ProductInCart } from './productCart';

export class ProductsCartList {
  localCart: LocalCart;
  constructor() {
    this.localCart = new LocalCart();
  }
  renderCartProductList() {
    const productListDOM = document.querySelector('.cart-products__list') as HTMLUListElement;
    productListDOM.innerHTML = '';
    const currentProductInCart = this.localCart.getLocalCartProducts();
    const productPage = Number((document.getElementById('controll__page-numbers--value') as HTMLElement).textContent);
    const productLimite = (document.getElementById('controll__limit--value') as HTMLInputElement).valueAsNumber;
    const productOnPage = currentProductInCart.slice(
      (productPage - 1) * productLimite,
      (productPage - 1) * productLimite + productLimite,
    );
    productOnPage.forEach(element => {
      new ProductInCart(element, productListDOM, currentProductInCart.indexOf(element));
    });
  }
}
