import { IProduct,DataKeys } from "../../types";
import { SideFilter } from "./side_filter";


export class CheckboxSection{
  data:IProduct[]
  container:HTMLElement
  parent:SideFilter
  keyName:DataKeys
  constructor(selector:HTMLElement,data:IProduct[],parent:SideFilter,keyName:DataKeys){
    this.container = selector
    this.data = data
    this.parent = parent
    this.keyName = keyName
  }
  testFunction(){
    this.data.forEach(e=>{
      console.log(e[this.keyName])
    })
  }
}