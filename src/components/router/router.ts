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
      console.log(this.isNewPage)
      this.urlUpdate()
      this.clearMain()
      await this.newPageRoute()
    },200)
  }
  
  async newPageRoute(){
    if(this.isNewPage){
      if(this.url.pathname == '/'){
        console.log('router')
        await this.loadAndCreateGallery()
        console.log(this.galleryFilter?.gallery.productsArr)
      }
      if(this.url.pathname == '/cart'){
        console.log('cart')
      }
    }
  }

  async loadAndCreateGallery(){
    let data:IDataProducts = await this.loader.load()
    let productArr = data.products
    this.galleryFilter = new GalleryFilter('main',productArr)
  }

  urlUpdate(){
    this.url = new URL(window.location.href)
  }

  isNewPageHandler():boolean{
    let newUrl = new URL(window.location.href)
    console.log(this.url.pathname, newUrl.pathname)
    return !(this.url.pathname == newUrl.pathname)
  }

  clearMain(){
    if(this.isNewPage){
      let $main = document.getElementById('main')!
      $main.innerHTML = ''
    }
  }

}
