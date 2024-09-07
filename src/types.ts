export interface Product {
  id: string;
  name: string;
  amount_1: number;
  amount_2: number;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
}

export interface CartItem {
  id?: string;
  quantity: number;
  expand: {
    of_product: Product;
  };
}

export interface IAddress {
  id: string;
  name: string;
  addr_1: string;
  addr_2: string;
  pincode: string;
  city: string;
  gstin: string;
  mobile: string;
}

export interface IOrder {
  id: string;
  ref_id: string;
  order_amount: number;
  order_status: string;
  is_complete: boolean;
  at_address: IAddress;
  created: string;
  expand: {
    orderlines_via_of_order: {
      id: string;
      expand: { of_product: Product };
    }[];
  };
}
