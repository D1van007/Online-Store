import { IProduct, DataKeys, FilterKeys } from "../../types";
import { Catalog } from "./catalog";
import './styles.css'
import { SideFilter } from "./side_filter";
import { searchHandler } from "../search_handler/search_handler";


export class ProductsPage{
  data: IProduct[]
  currentData: IProduct[]
  mainDOM: HTMLElement
  containerDOM:HTMLDivElement
  searchDOM!:HTMLInputElement
  sortDOM!:HTMLInputElement
  totalCountDOM!:HTMLElement
  catalog: Catalog
  sideFilter:SideFilter|null
  constructor(selector:string, data:IProduct[]){
    this.mainDOM = document.getElementById(selector)!
    this.data = data
    this.currentData = this.data
    this.containerDOM = this.createAndReturnContainer()
    this.renderContent()
    this.searchInput()
    this.catalog = new Catalog('products-page',this.data)
    this.sideFilter = new SideFilter('products-page',this.data,(data)=>this.sideFilterHandler(data))
    this.sortInput()
    //this.inputHandler() //пушим данные в sideFilter.arrayOfDataAllFilters чтоб не был пустым
    this.renderTotalCount()
    this.updateSearchParamsFromURL()
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
    this.searchDOM = this.containerDOM.querySelector('.search-bar__search')!
    this.sortDOM = this.containerDOM.querySelector('.search-bar__sort')!
    this.totalCountDOM = this.containerDOM.querySelector('.search-bar__total')!
  }
  renderTotalCount(){
    this.totalCountDOM.textContent = ` count: ${this.currentData.length}`
  }
  searchInput(){
    this.searchDOM.addEventListener('input', ()=>{
      if(this.searchDOM.value){
        searchHandler.addParams(FilterKeys.search, this.searchDOM.value) //тестим
      }else{
        searchHandler.deleteParams(FilterKeys.search)
      }
      this.inputHandler()
    })
  }
  
  inputHandler(){
    let filterData = this.searchDataFilter(this.searchDOM.value)
    if (this.sideFilter){
      this.sideFilter.arrayOfDataAllFilters.search = filterData
      this.sideFilterHandler(this.sideFilter.getFilteredData())
      this.sideFilter.updateCheckBoxSections()
      this.sideFilter.updatePriceAndStockRange()
    }
  }
  rerenderCatalog(){
    this.catalog.destroy()
    console.log('отрисовка каталога')
    this.catalog = new Catalog('products-page',this.currentData)
  }
  searchDataFilter(value:string):IProduct[]{
    return this.data.filter(e=>e.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
  }
  sideFilterHandler(data:IProduct[]){
    this.currentData = data
    this.sortHandler()
    this.rerenderCatalog()
    this.renderTotalCount()
  }
  sortInput(){
    this.sortDOM.addEventListener('change',()=>{
      searchHandler.addParams(FilterKeys.sort, this.sortDOM.value) //тестим
      this.sortHandler()
      this.rerenderCatalog()
    })
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
  //тестовый метод, обновляет сострояния фильтров по данным из URL
  updateSearchParamsFromURL(){
    if(searchHandler.currentUrl.pathname == '/'){
      let searchParams = searchHandler.currentUrl.searchParams

      if(searchParams.has(FilterKeys.sort)){
        let value = searchParams.get(FilterKeys.sort) as string
        this.sortDOM.value = value
        this.sortHandler()
      }else{
        this.sortDOM.value = 'raitingASC'
        this.sortHandler()
      }

      if(searchParams.has(DataKeys.price)){
        let value = searchParams.get(DataKeys.price) as string
        let arr = JSON.parse(value)
        this.sideFilter?.priceInput.setRangeValue(arr[0],arr[1],true)
      }else{
        let arr = this.sideFilter?.priceInput.default!
        this.sideFilter?.priceInput.setRangeValue(arr[0],arr[1],true)
      }

      if(searchParams.has(DataKeys.stock)){
        let value = searchParams.get(DataKeys.stock) as string
        let arr = JSON.parse(value)
        this.sideFilter?.stockInput.setRangeValue(arr[0],arr[1],true)
      }else{
        let arr = this.sideFilter?.stockInput.default!
        this.sideFilter?.stockInput.setRangeValue(arr[0],arr[1],true)
      }
      
      if(searchParams.has(DataKeys.category)){
        let value = searchParams.get(DataKeys.category) as string
        this.sideFilter?.categoryCheck.checkFormArray(JSON.parse(value))
      }else{
        this.sideFilter?.categoryCheck.checkFormArray(['костыль']) //пока так
      }

      if(searchParams.has(DataKeys.brand)){
        let value = searchParams.get(DataKeys.brand) as string
        this.sideFilter?.brandCheck.checkFormArray(JSON.parse(value))
      }else{
        this.sideFilter?.brandCheck.checkFormArray(['костыль']) //пока так
      }

      if(searchParams.has(FilterKeys.search)){
        let value = searchParams.get(FilterKeys.search) as string
        this.searchDOM.value = value
        this.inputHandler()
      }else{
        this.searchDOM.value = ''
        this.inputHandler()
      }

    }
  }
    
}

function renderHTML():string{
  return `
    <div class="search-bar">
      <input class = "search-bar__search" placeholder="Enter some text" name="name" />
      <select class = "search-bar__sort">
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