interface IProduct{
    "id": number
    "title": string
    "description": string
    "price": number
    "discountPercentage": number
    "rating": number
    "stock": number
    "brand": string
    "category": string
    "thumbnail": string
    "images": string[]
}

interface IDataProducts{
  limit: number
  products:IProduct[]
  skip: number
  total: number
}

export {IDataProducts, IProduct}