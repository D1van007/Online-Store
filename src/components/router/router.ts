export class MyRouter{
  constructor(){
    
  }
 
  route(event:any){
    event = event || window.event;
    event.preventDefault();
    if(event.target)
    window.history.pushState({}, "", event.target.href);
  }
}