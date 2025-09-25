import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '@prisma/client';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { tap } from 'rxjs';

// Define the proper response type
type GetProductsResult = {
  products: Product[];
};

// Properly type the GraphQL query
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
` as import('../../../../../node_modules/@apollo/client/core').TypedDocumentNode<GetProductsResult>;

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
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    loadProducts() {
      patchState(store, { loading: true, error: null });

      const q: QueryRef<GetProductsResult> =
        apollo.watchQuery<GetProductsResult>({ query: GET_PRODUCTS });

      q.valueChanges
        .pipe(
          tap({
            next: ({ data }) =>
              patchState(store, {
                products: data?.products || [],
                loading: false,
              }),
            error: (error) =>
              patchState(store, {
                error: error.message ?? 'Unknown error',
                loading: false,
              }),
          })
        )
        .subscribe();
    },
  }))
);
