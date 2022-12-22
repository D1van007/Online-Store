import { IProduct } from "../../types"

export class CartLocalStor {
    totalProductsFromLocal:number
    cartIcon:HTMLElement
    // dataItem: IProduct

    constructor () {
        this.totalProductsFromLocal = JSON.parse(localStorage.getItem('totalProducts')!)
        this.cartIcon = document.querySelector('#total-products')!
    }

    setAddTotalProducts () {
        this.totalProductsFromLocal = this.getLocalTotalProducts ()
        if(this.totalProductsFromLocal){ 
          localStorage.setItem('totalProducts',JSON.stringify(this.getLocalTotalProducts () + 1))
          this.drawValueCart ()
      } else {
        localStorage.setItem('totalProducts',JSON.stringify(1))
        this.drawValueCart ()
      }
    }

    getLocalTotalProducts () {
        return JSON.parse(localStorage.getItem('totalProducts')!)
    }
    getLocalDataProducts () {
        return JSON.parse(localStorage.getItem('cart_item')!)
    }
    drawValueCart () {
        if (JSON.parse(localStorage.getItem('cart_item')!)){
        this.cartIcon.textContent = `${this.getLocalTotalProducts()}`}
        else {this.cartIcon.textContent = '0'}
    }
    removeItemInCart (element:HTMLElement) {
        const cartLocal = JSON.parse(localStorage.getItem('cart_item')!);
        const index = cartLocal.findIndex((e: IProduct) => e.id.toString() === element.id);
        if (index !== -1) {
            cartLocal.splice(index, 1);
        localStorage.setItem('cart_item', JSON.stringify(cartLocal))   
        }
    }   
    setTotalPrice () {
        if (JSON.parse(localStorage.getItem('cart_item')!)) {
            const dataProducts = this.getLocalDataProducts ()
            const totalPriceValue = dataProducts.reduce((sum: number, e: { id: number; price: number }) => {
                let keysLocal = Object.keys(localStorage);
                keysLocal.forEach(el => {
                    if (e.id == +el.slice(16)) {
                        sum = sum + (e.price * Number(localStorage.getItem(el))!);
                    }
                })
                return sum
                }, 0)
            localStorage.setItem('totalPrice', JSON.stringify(totalPriceValue))
            const totalPriceCartDOM = document.getElementById('amountSum__price')
            const totalPriceHeaderDOM = document.getElementById('total-price')!
            totalPriceHeaderDOM.textContent = `Total: € ${totalPriceValue}`
            if(totalPriceCartDOM) {
            totalPriceCartDOM.textContent = `Total: € ${totalPriceValue}`
            }
        }
    }


}