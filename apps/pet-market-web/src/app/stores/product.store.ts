import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

// GraphQL Query
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      image
      price
      stripePriceId
    }
  }
`;

// Product Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stripePriceId: string;
}

// Store State Interface
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Product Store
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    // Load all products
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          apollo.query<{ products: Product[] }>({ query: GET_PRODUCTS }).pipe(
            tap((result) => {
              patchState(store, {
                products: result?.data?.products as Product[],
                loading: false,
              });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message,
                loading: false,
              });
              return of(null);
            })
          )
        )
      )
    ),

    // Select a product by ID
    selectProduct(id: string) {
      const product = store.products().find((p) => p.id === id) || null;
      patchState(store, { selectedProduct: product });
    },

    // Clear selected product
    clearSelection() {
      patchState(store, { selectedProduct: null });
    },

    // Reset store
    reset() {
      patchState(store, initialState);
    },
  }))
);
