import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  onProductAdded(product: Product) {
    this.toastr.success(`${product.name} added to cart!`, 'Added to Cart');
  }
}
