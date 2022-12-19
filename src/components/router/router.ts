import { eventedPushState } from "./events_history";
import { Loader } from "../loader/loader";
import { IDataProducts } from "../../types";
import { GalleryFilter } from "../gallery/gallery_filter";


export class Router{
  loader:Loader
  galleryFilter:GalleryFilter|null
  isNewPage:boolean = true
  url:URL
  constructor(){
    this.loader = new Loader()
    this.galleryFilter = null
    this.url = new URL(window.location.href)
    this.historyEventTarcker()
    this.newPageRoute()
    this.isNewPage = false
  }
  historyEventTarcker(){
    window.addEventListener('onpushstate', ()=>{
      this.historyEventHendler()
    })
    
    window.addEventListener('popstate', ()=>{
      this.historyEventHendler()
    })
  }
  historyEventHendler(){
    setTimeout(async()=>{ //это костыль
      this.isNewPage = this.isNewPageHandler()
      this.urlUpdate()
      this.clearMain()
      await this.newPageRoute()
    },100)
  }
  
  async newPageRoute(){
    if(this.isNewPage){
      if(this.url.pathname == '/'){
        await this.loadAndCreateGallery()
      }
      else if(this.url.pathname == '/cart'){
        
      }else if((await this.getProductRouteList()).includes(this.url.pathname)){
        await this.createItemPage()
      }else{
        alert('it"s a 404 live with it')
      }
    }
  }

  async getProductRouteList(){
    let data = await this.loader.load()
    return data.reduce((acc:string[],e)=>{
      acc.push(`/product${e.id}`)
      return acc
    },[])

  }

  async loadAndCreateGallery(){
    let data = await this.loader.load()
    this.galleryFilter = new GalleryFilter('main',data)
  }

  async createItemPage(){
    await this.loadAndCreateGallery()
    let $main = document.getElementById('main')!
    $main.innerHTML = ''
    let productItemsArr = this.galleryFilter?.gallery.productsArr
    let id = parseInt(this.url.pathname.replace(/[^\d]/g, ''))
    productItemsArr = productItemsArr?.filter(e=>e.id == id)
    if(productItemsArr)
    productItemsArr[0].selfPageRender()
  }

  urlUpdate(){
    this.url = new URL(window.location.href)
  }

  isNewPageHandler():boolean{
    let newUrl = new URL(window.location.href)
    return !(this.url.pathname == newUrl.pathname)
  }

  clearMain(){
    if(this.isNewPage){
      let $main = document.getElementById('main')!
      $main.innerHTML = ''
    }
  }

}
