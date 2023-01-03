interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface IDataProducts {
  limit: number;
  products: IProduct[];
  skip: number;
  total: number;
}

enum DataKeys {
  brand = 'brand',
  category = 'category',
  price = 'price',
  stock = 'stock',
}
enum FilterKeys {
  search = 'search',
  sort = 'sort',
  page = 'page'
}

export { IDataProducts, IProduct, DataKeys, FilterKeys };
