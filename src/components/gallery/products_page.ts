import { IProduct } from "../../types";
import { Gallery } from "./gallery";
import './gallery.css'
import { SideFilter } from "./side_filter";


export class ProductsPage{
  data: IProduct[]
  currentData: IProduct[]
  mainDOM: HTMLElement
  containerDOM:HTMLDivElement
  searchDOM:HTMLInputElement
  sortDOM:HTMLInputElement
  totalCountDOM:HTMLElement
  catalog: Gallery
  sideFilter:SideFilter|null
  constructor(selector:string, data:IProduct[]){
    this.mainDOM = document.getElementById(selector)!
    this.data = data
    this.currentData = this.data
    this.containerDOM = this.createAndReturnContainer()
    this.renderContent()
    this.searchDOM = this.containerDOM.querySelector('.search-bar__search-bar')!
    this.sortDOM = this.containerDOM.querySelector('.search-bar__sort-bar')!
    this.totalCountDOM = this.containerDOM.querySelector('.search-bar__total')!
    this.searchInput()
    this.catalog = new Gallery('products-page',this.data)
    this.sideFilter = new SideFilter('products-page',this.data,(data)=>this.sideFilterHandler(data),this)
    this.sortInput()
    this.hrefParamsHendler()
    this.inputHandler() //пушим данные в sideFilter.arrayOfDataAllFilters чтоб не был пустым
    this.renderTotalCount()
  }
  createAndReturnContainer():HTMLDivElement{
    let container = document.createElement('div')
    container.classList.add('products-page')
    container.id = 'products-page'
    this.mainDOM.insertAdjacentElement('afterbegin',container)
    return container
  }
  renderContent(){
    this.containerDOM.innerHTML = renderHTML()
  }
  renderTotalCount(){
    this.totalCountDOM.textContent = ` count: ${this.currentData.length}`
  }
  searchInput(){
    this.searchDOM.addEventListener('input', this.inputHandler.bind(this))
  }
  inputHandler(){
    let filterData = this.searchDataFilter(this.searchDOM.value)
    if (this.sideFilter){
      //console.log(filterData)
      this.sideFilter.arrayOfDataAllFilters.search = filterData
      this.sideFilterHandler(this.sideFilter.getFilteredData())
      this.sideFilter.updateCheckBoxSections()
      this.sideFilter.updatePriceAndStockRange()
    }
  }
  rerenderGallery(){
    this.catalog.destroy()
    this.catalog = new Gallery('main',this.currentData)
  }
  searchDataFilter(value:string):IProduct[]{
    return this.data.filter(e=>e.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  }
  sideFilterHandler(data:IProduct[]){ // тестим
    console.log('раз')
    this.currentData = data
    this.sortHandler()
    this.rerenderGallery()
    this.renderTotalCount()
  }
  sortInput(){
    this.sortDOM.addEventListener('change',()=>{
      this.sortHandler()
      this.inputHandler()
    })
  }
  hrefParamsHendler(){// тестовая
    let url = new URL(window.location.href)
    let params = url.searchParams
    if(params.has('search')){
      this.searchDOM.value = params.get('search')!
      this.inputHandler()
    }
  }
  sortHandler(){
    switch (this.sortDOM.value) {
      case 'raitingASC':
        this.currentData = this.currentData.sort((a,b)=>a.rating-b.rating)
        break;
      case 'raitingDESC':
        this.currentData = this.currentData.sort((a,b)=>b.rating-a.rating)
        break;
      case 'priceASC':
        this.currentData = this.currentData.sort((a,b)=>a.price-b.price)
        break;
      case 'priceDESC':
        this.currentData = this.currentData.sort((a,b)=>b.price-a.price)
      break;
      case 'discountASC':
        this.currentData = this.currentData.sort((a,b)=>a.discountPercentage-b.discountPercentage)
      break;
      case 'discountDESC':
        this.currentData = this.currentData.sort((a,b)=>b.discountPercentage-a.discountPercentage)
      break;
    }
  }
}

function renderHTML():string{
  return `
    <div class="search-bar">
      <input class = "search-bar__search-bar" placeholder="Enter some text" name="name" />
      <select class = "search-bar__sort-bar">
        <option value="raitingASC">Sort by raiting ASC</option>
        <option value="raitingDESC">Sort by raiting DESC</option>
        <option value="priceASC">Sort by price ASC</option>
        <option value="priceDESC">Sort by price DESC</option>
        <option value="discountASC">Sort by discount ASC</option>
        <option value="discountDESC">Sort by discount DESC</option>
      </select>
      <span class="search-bar__total"></span>
    </div>  
  `
}