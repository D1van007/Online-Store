function createDom () {

let cartItems = JSON.parse(localStorage.getItem('cart_item')!);

const container = document.createElement('main');
container.classList.add('cart_content')
container.innerHTML = ` 
<article class="shopping-cart">
    <ul class="shopping-cart_list">
    </ul>
</article>
<article class="summary-cart"></article>`
document.body.prepend(container)

const shoppigCartList = document.querySelector('.shopping-cart_list')
if (cartItems.length > 0) {
    cartItems.forEach((e: { id: string; images: string; title: string; price: number; }) => shoppigCartList!.insertAdjacentHTML('beforeend', `
    <li class="product__item" id = "${e.id}">
        <div class="product__item__img" style = "background-image: url(${e.images[0]})"></div>
        <h3 class="product__item__title">${e.title}</h3>
        <div class="product__item__price">${e.price}</div>
    </li>
    `))
}
}
export default createDom