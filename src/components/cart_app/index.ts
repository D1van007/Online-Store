import setLocalStorage from '../../components/local_temp/index'
import createDom from '../../components/cart_items/index';
import { Cart } from '../cart_test/cart';
// const content = new Content();
 
export class App {
    cart: Cart
    constructor () {
        this.run()
        this.cart = new Cart('main')
        this.cart.creatCartContent ()
        this.cart.render()
        this.cart.productList = this.cart.main.querySelector('.shopping-cart_list')!
        this.cart.renderItemInCart ()
    }

run () {
    console.log('App1')
    setLocalStorage() 
}
}
