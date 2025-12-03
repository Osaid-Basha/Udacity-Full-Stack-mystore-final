import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  submitted = false;
  customerName = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      fullName: [''],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern("^[0-9\\s-]{16,}$")
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern("^(0[1-9]|1[0-2])\\/[0-9]{2}$")
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{3,4}$")
      ]]
    });

    this.customerName = this.checkoutForm.get('fullName')?.value ?? '';
  }

  onSubmit() {
    this.submitted = true;
    this.handleNameChange(this.customerName);

    // Normalize card number to digits before validation/navigation
    const cardControl = this.checkoutForm.get('cardNumber');
    const rawCard = (cardControl?.value ?? '').toString();
    const normalizedCard = rawCard.replace(/[\s-]/g, '');
    cardControl?.setValue(normalizedCard);
    cardControl?.markAsTouched();
    cardControl?.updateValueAndValidity();

    this.checkoutForm.markAllAsTouched();

    if (this.checkoutForm.valid) {
      this.cartService.clear();

      this.router.navigate(['/order-success']);
    }
  }

  get f() {
    return this.checkoutForm.controls;
  }

  handleNameChange(value: string) {
    this.customerName = value;
    const control = this.checkoutForm.get('fullName');
    control?.setValue(value);
    control?.markAsDirty();
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }
}
