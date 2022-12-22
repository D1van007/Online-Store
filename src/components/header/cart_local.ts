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
            // console.log(this.getLocalTotalProducts ())
          localStorage.setItem('totalProducts',JSON.stringify(this.getLocalTotalProducts () + 1))
          this.drawValueCart ()
      } else {
        localStorage.setItem('totalProducts',JSON.stringify(1))
        this.drawValueCart ()
      }
    }
    // setRemoveTotalProducts () {
    //     this.totalProductsFromLocal = this.getLocalTotalProducts ()
    //     if(this.totalProductsFromLocal > 1){
    //         localStorage.setItem('totalProducts',JSON.stringify(this.getLocalTotalProducts () - JSON.parse(localStorage.getItem(`id${this.$id.id}-amount`))))
    //         this.drawValueCart ()
    //     } else {
    //         localStorage.setItem('totalProducts',JSON.stringify(0))
    //         this.drawValueCart () 
    //     }
    // }
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

        // }
    localStorage.setItem('cart_item', JSON.stringify(cartLocal))   
    }
}


}