import { IProduct } from '../../../types';
import { LocalCart } from './localCart';
import { ProductsCartList } from './productsCartList';

export class ProductInCart {
  dataProduct: IProduct;
  selectorList: HTMLUListElement;
  productItemID!: HTMLElement;
  amountContentDOM!: HTMLElement;
  amountProductDOM!: HTMLElement;
  totalPriceProductDOM!: HTMLElement;
  productAmount!: number;
  index: number;
  localCart: LocalCart;
  productsCartList: ProductsCartList;
  totalProductHeaderDOM!: HTMLElement;
  totalPriceHeaderDOM!: HTMLElement;
  constructor(dataProduct: IProduct, selectorList: HTMLUListElement, index: number) {
    this.dataProduct = dataProduct;
    this.index = index;
    this.selectorList = selectorList;
    this.productAmount = JSON.parse(localStorage.getItem(`id${this.dataProduct.id}`) as string);
    this.renderProduct();
    this.initDOMElement();
    this.localCart = new LocalCart();
    this.changeAmount();
    this.productsCartList = new ProductsCartList();
  }

  initDOMElement() {
    this.productItemID = document.getElementById(this.dataProduct.id.toString()) as HTMLElement;
    this.amountContentDOM = document.getElementById(`amount-change__content${this.dataProduct.id}`) as HTMLElement;
    this.amountProductDOM = document.getElementById(`amount-product${this.dataProduct.id}`) as HTMLElement;
    this.totalProductHeaderDOM = document.getElementById('total-products') as HTMLElement;
    this.totalPriceHeaderDOM = document.getElementById('total-price') as HTMLElement;
    this.totalPriceProductDOM = document.getElementById(
      `product__item--total-price${this.dataProduct.id}`,
    ) as HTMLElement;
  }

  renderProduct() {
    this.productAmount = JSON.parse(localStorage.getItem(`id${this.dataProduct.id}`) as string);
    this.selectorList.insertAdjacentHTML(
      'beforeend',
      createHTMLCartItem(this.dataProduct, this.index, this.productAmount),
    );
  }

  clearCart() {
    localStorage.setItem('totalPrice', JSON.stringify(0));
    localStorage.setItem('totalProducts', JSON.stringify(0));
    this.totalPriceHeaderDOM.textContent = `Total: €0`;
    this.totalProductHeaderDOM.textContent = '0';
    localStorage.clear();
    document.querySelector('.cart__container')?.remove();
  }

  changeAmount() {
    this.productItemID.addEventListener('click', event => {
      if ((<HTMLElement>event.target).matches('.line1')) {
        if (this.productAmount >= this.dataProduct.stock) {
          return;
        } else {
          this.productAmount += 1;
          this.amountProductDOM.textContent = this.productAmount.toString();
          localStorage.setItem(`id${this.dataProduct.id}`, JSON.stringify(this.productAmount));
        }
      } else if ((<HTMLElement>event.target).matches('.line3')) {
        this.productAmount -= 1;
        if (this.productAmount < 1) {
          this.localCart.removeProducrFromCart(this.productItemID);
          this.productItemID.remove();
          // this.renderProductNum();
          this.productsCartList.renderCartProductList();

          localStorage.removeItem(`id${this.dataProduct.id}`);
        } else {
          this.amountProductDOM.textContent = this.productAmount.toString();
          localStorage.setItem(`id${this.dataProduct.id}`, JSON.stringify(this.productAmount));
        }
      }
      this.totalPriceProductDOM.textContent = `Total: €${this.productAmount * this.dataProduct.price}`;

      if (this.localCart?.getLocalCartProducts().length === 0) {
        this.clearCart();
      }
      this.localCart.setTotalProducts();
      this.localCart.setTotalPrice();
    });
  }
}

function createHTMLCartItem(dataProduct: IProduct, index: number, amountValue: number): string {
  return `<li class="cart-products__item" id = "${dataProduct.id}">
    <span id="item-num${dataProduct.id}" class="cart-products__item--num">${index + 1}</span>
    <div class="cart-products__item--img" style = "background-image: url(${dataProduct.images[0]})"></div>
    <div class="cart-products__item--fullname">
        <h3 class="cart-products__item--title">${dataProduct.title}</h3>
        <p class="cart-products__item--description">${dataProduct.description}</p>
            <div class="cart-products__item--description-second">
                <p class="cart-products__item--price">Price: €${dataProduct.price}</p>
                <p class="cart-products__item--rating">Rating: ${dataProduct.rating}</p>
                <p class="cart-products__item--discount">Discount: ${dataProduct.discountPercentage}</p>
            </div> 
    </div>    
    <div>
        <p class="product__item--price">Stock: ${dataProduct.stock}</p>
        <div id="amount-change__content${dataProduct.id}" class="amount-change__content">
            <div class="add-value__circle value_circle">
                <div class="circle__line line1">+</div>
                <div class="circle__line line2"></div>
            </div>
            <p id="amount-product${dataProduct.id}" class="amount-product">${amountValue}</p>
            <div class="remove-value__circle value_circle">
                <div class="circle__line line3">-</div>
            </div>
        </div>
        <span id="product__item--total-price${dataProduct.id}" class="product__item--total-price">Total: €${
    amountValue * dataProduct.price
  }</span>       
    </div>    
</li>`;
}
