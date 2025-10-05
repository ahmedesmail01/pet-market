import { afterNextRender, Component, inject } from '@angular/core';
import { ProductStore } from '../stores/product.store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [JsonPipe],
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
