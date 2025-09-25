import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: async () => {
      const mod = await import('./home/home');
      return mod.Home;
    },
  },
  {
    path: 'products',
    loadChildren: async () => {
      const mod = await import('./products/products');
      return mod.Products;
    },
  },
];
