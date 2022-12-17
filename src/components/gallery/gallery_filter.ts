import { IProduct } from "../../types";
import { Gallery } from "../gallery/gallery";
import './gallery.css'


export class GalleryFilter{
  data: IProduct[]
  $parentId: HTMLElement
  $id:HTMLDivElement
  $search:HTMLInputElement
  $sort:HTMLInputElement
  gallery: Gallery
  constructor(selector:string, data:IProduct[]){
    this.$parentId = document.getElementById(selector)!
    this.data = data
    this.$id = this.render()
    this.renderContent()
    this.$search = this.$id.querySelector('.gellery__filter__search-bar')!
    this.$sort = this.$id.querySelector('.gellery__filter__sort-bar')!
    this.searchInput()
    this.gallery = new Gallery('main',this.data)
    this.sortInput()
    this.hrefParamsHendler()
  }
  render():HTMLDivElement{
    let filterContainer = document.createElement('div')
    filterContainer.classList.add('gellery__filter')
    this.$parentId.insertAdjacentElement('afterbegin',filterContainer)
    return filterContainer
  }
  renderContent(){
    this.$id.innerHTML = renderHTML()
  }
  
  searchInput(){
    this.$search.addEventListener('input', this.inputHandler.bind(this))
  }
  inputHandler(){
    this.gallery.destroy()
    let filterData = this.searchDataFilter(this.$search.value)
    this.gallery = new Gallery('main',filterData)
  }
  searchDataFilter(value:string):IProduct[]{
    return this.data.filter(e=>e.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  }

  sortInput(){
    this.$sort.addEventListener('change',()=>{
      this.sortHandler()
      this.inputHandler()
    })
  }
  hrefParamsHendler(){
    let url = new URL(window.location.href)
    let params = url.searchParams
    if(params.has('search')){
      this.$search.value = params.get('search')!
      this.inputHandler()
    }
  }
  sortHandler(){
    switch (this.$sort.value) {
      case 'raitingASC':
        this.data = this.data.sort((a,b)=>a.rating-b.rating)
        break;
      case 'raitingDESC':
        this.data = this.data.sort((a,b)=>b.rating-a.rating)
        break;
      case 'priceASC':
        this.data = this.data.sort((a,b)=>a.price-b.price)
        break;
      case 'priceDESC':
        this.data = this.data.sort((a,b)=>b.price-a.price)
      break;
      case 'discountASC':
        this.data = this.data.sort((a,b)=>a.discountPercentage-b.discountPercentage)
      break;
      case 'discountDESC':
        this.data = this.data.sort((a,b)=>b.discountPercentage-a.discountPercentage)
      break;
    }
  }
}

function renderHTML():string{
  return `
    <input class = "gellery__filter__search-bar" placeholder="Enter some text" name="name" />
    <select class = "gellery__filter__sort-bar">
      <option value="raitingASC">Sort by raiting ASC</option>
      <option value="raitingDESC">Sort by raiting DESC</option>
      <option value="priceASC">Sort by price ASC</option>
      <option value="priceDESC">Sort by price DESC</option>
      <option value="discountASC">Sort by discount ASC</option>
      <option value="discountDESC">Sort by discount DESC</option>
    </select>
  `
}