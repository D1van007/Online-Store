/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IProduct } from '../../../types';

export class LocalCart {
  getLocalTotalProducts(): number {
    return JSON.parse(localStorage.getItem('totalProducts')!);
  }

  getLocalTotalPrice(): number {
    return JSON.parse(localStorage.getItem('totalPrice')!);
  }

  getLocalCartProducts(): IProduct[] {
    return JSON.parse(localStorage.getItem('productsInCart')!);
  }

  removeProducrFromCart(element: HTMLElement) {
    const cartLocal = JSON.parse(localStorage.getItem('productsInCart')!);
    const index = cartLocal.findIndex((e: IProduct) => e.id.toString() === element.id);
    if (index !== -1) {
      cartLocal.splice(index, 1);
      localStorage.setItem('productsInCart', JSON.stringify(cartLocal));
    }
  }

  setTotalPrice() {
    if (JSON.parse(localStorage.getItem('productsInCart')!)) {
      const dataProducts = this.getLocalCartProducts();
      const totalPrice = dataProducts.reduce((sum: number, e: { id: number; price: number }) => {
        const keysLocal = Object.keys(localStorage);
        keysLocal.forEach(el => {
          if (e.id == +el.slice(2)) {
            sum = sum + e.price * Number(localStorage.getItem(el))!;
          }
        });
        return sum;
      }, 0);
      localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
      this.drawTotalPriceOnPage();
    }
  }

  drawTotalPriceOnPage() {
    const totalPriceCartDOM = document.getElementById('cart-total--price');
    const totalPriceHeaderDOM = document.getElementById('total-price')!;
    totalPriceHeaderDOM.textContent = `Total: € ${this.getLocalTotalPrice() | 0}`;
    if (totalPriceCartDOM) {
      totalPriceCartDOM.textContent = `Total: € ${this.getLocalTotalPrice() | 0}`;
    }
  }

  setTotalProducts() {
    if (JSON.parse(localStorage.getItem('productsInCart')!)) {
      const dataProducts = this.getLocalCartProducts();
      const totalProducts = dataProducts.reduce((sum: number, e: { id: number; price: number }) => {
        const keysLocal = Object.keys(localStorage);
        keysLocal.forEach(el => {
          if (e.id == +el.slice(2)) {
            sum = sum + Number(localStorage.getItem(el))!;
          }
        });
        return sum;
      }, 0);
      localStorage.setItem('totalProducts', JSON.stringify(totalProducts));
      this.drawTotalProductsOnPage();
    }
  }

  drawTotalProductsOnPage() {
    const totalProductsCartDOM = document.getElementById('cart-total--amount')!;
    const totalProductsHeaderDOM = document.getElementById('total-products')!;
    totalProductsHeaderDOM.textContent = `${this.getLocalTotalProducts() | 0}`;
    if (totalProductsCartDOM) {
      totalProductsCartDOM.textContent = `Products:  ${this.getLocalTotalProducts() | 0}`;
    }
  }

  setLocalProductByID() {
    if (JSON.parse(localStorage.getItem('productsInCart')!)) {
      const dataProducts = this.getLocalCartProducts();
      dataProducts.forEach(element => {
        if (!JSON.parse(localStorage.getItem(`id${element.id}`) as string)) {
          localStorage.setItem(`id${element.id}`, JSON.stringify(1));
        }
      });
    }
  }

  clearCart() {
    // localStorage.setItem('totalPrice', JSON.stringify(0));
    // localStorage.setItem('totalProducts', JSON.stringify(0));
    const totalProductHeaderDOM = document.getElementById('total-products') as HTMLElement;
    const totalPriceHeaderDOM = document.getElementById('total-price') as HTMLElement;
    totalPriceHeaderDOM.textContent = `Total: €0`;
    totalProductHeaderDOM.textContent = '0';
    localStorage.clear();
    document.querySelector('.cart__container')?.remove();
  }
}
