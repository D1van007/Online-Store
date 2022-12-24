class SearchHandler{
  currentUrl:URL
  constructor(){
    this.currentUrl = new URL(window.location.href)
  }
  parseUrl(){
    this.currentUrl = new URL(window.location.href)
    console.log(this.currentUrl)
  }
  addParams(name:string,value:string|number[]|string[]){
    let strValue:string
    if(typeof value == 'string'){
      strValue = value
    }else{
      strValue = JSON.stringify(value)
    }
    console.log(strValue)
    if(strValue){
      this.currentUrl.searchParams.set(name,strValue)
      //history.pushState({},'',this.currentUrl.pathname)
    }
    history.pushState({},'',this.currentUrl.pathname+'?'+this.currentUrl.searchParams.toString())
    console.log('push to url')
  }
  deleteParams(name:string){
    this.currentUrl.searchParams.delete(name)
    if(this.currentUrl.searchParams.toString()){
      history.pushState({},'',this.currentUrl.pathname+'?'+this.currentUrl.searchParams.toString())
    }else{
      history.pushState({},'',this.currentUrl.pathname)
    }
  }
}

export const searchHandler = new SearchHandler()