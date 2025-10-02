import { afterNextRender, Component, inject } from '@angular/core';
import { ProductStore } from '../stores/product.store';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  ProductStore = inject(ProductStore);

  constructor() {
    afterNextRender(() => {
      this.ProductStore.loadProducts();
      console.log('all products is :', this.ProductStore.products());
    });
  }
}
