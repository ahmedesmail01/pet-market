import { signalStore, withState } from '@ngrx/signals';

import { Product } from '@prisma/client';

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  {
    providedIn: 'root',
  },

  withState({
    products: [],
  })
);
