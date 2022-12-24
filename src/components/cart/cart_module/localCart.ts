import { IProduct } from "../../../types"

export class LocalCart {
    totalProductsFromLocal: number
    cartIcon: HTMLElement
    constructor() {
        this.totalProductsFromLocal = JSON.parse(localStorage.getItem('totalProducts')!)
        this.cartIcon = document.querySelector('#total-products')!
    }

    getLocalTotalProducts() {
        return JSON.parse(localStorage.getItem('totalProducts')!)
    }
    getLocalCartProducts() {
        return JSON.parse(localStorage.getItem('products_inCart')!)
    }
    removeProducrFromCart(element: HTMLElement) {
        const cartLocal = JSON.parse(localStorage.getItem('products_inCart')!);
        const index = cartLocal.findIndex((e: IProduct) => e.id.toString() === element.id);
        if (index !== -1) {
            cartLocal.splice(index, 1);
            localStorage.setItem('products_inCart', JSON.stringify(cartLocal))
        }
    }
    setTotalPrice() {
        if (JSON.parse(localStorage.getItem('products_inCart')!)) {
            const dataProducts = this.getLocalCartProducts()
            const totalPrice = dataProducts.reduce((sum: number, e: { id: number; price: number }) => {
                let keysLocal = Object.keys(localStorage);
                keysLocal.forEach(el => {
                    if (e.id == +el.slice(16)) {
                        sum = sum + (e.price * Number(localStorage.getItem(el))!);
                    }
                })
                return sum
            }, 0)
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice))
            const totalPriceCartDOM = document.getElementById('total-cart_price')
            const totalPriceHeaderDOM = document.getElementById('total-price')!
            totalPriceHeaderDOM.textContent = `Total: € ${totalPrice}`
            if (totalPriceCartDOM) {
                totalPriceCartDOM.textContent = `Total: € ${totalPrice}`
            }
        }
    }
    setTotalProducts() {
        if (JSON.parse(localStorage.getItem('products_inCart')!)) {
            const dataProducts = this.getLocalCartProducts()
            const totalProducts = dataProducts.reduce((sum: number, e: { id: number; price: number }) => {
                let keysLocal = Object.keys(localStorage);
                keysLocal.forEach(el => {
                    if (e.id == +el.slice(16)) {
                        sum = sum + Number(localStorage.getItem(el))!;
                    }
                })
                return sum
            }, 0)
            localStorage.setItem('totalProducts', JSON.stringify(totalProducts))
            const totalProductsCartDOM = document.getElementById('total-cart_product')!
            const totalProductsHeaderDOM = document.getElementById('total-products')!
            totalProductsHeaderDOM.textContent = `${totalProducts}`
            if (totalProductsCartDOM) {
                totalProductsCartDOM.textContent = `Products:  ${totalProducts}`
            }
        }
    }
}