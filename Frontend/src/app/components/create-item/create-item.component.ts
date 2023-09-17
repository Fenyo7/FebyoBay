import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Router } from '@angular/router';
import { AddItemDTO } from 'src/app/models/DTOs/add-item.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent {
  constructor(
    private itemService: ItemService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  itemPrice: number = 0;

  onSubmit(formValue: any) {
    // Check if user is logged in
    if (!Number(localStorage.getItem('id'))) {
      this.router.navigate(['/login']);
      this.toastr.error('Please login to create an item.');
      return;
    }

    // Check for empty name field
    if (!formValue.name) {
      this.toastr.warning('Please name your item.');
      return;
    }

    // Check for invalid price
    if (formValue.price <= 0) {
      this.toastr.warning('Please give a price greater than 0.');
      return;
    }

    // Check for empty description
    if (!formValue.description) {
      this.toastr.warning('Please describe your item.');
      return;
    }

    // Check for empty image link
    if (!formValue.imageLink) {
      this.toastr.warning('Please provide a link for the image of your item.');
      return;
    }

    let itemData: AddItemDTO = {
      UserId: Number(localStorage.getItem('id')),
      Name: formValue.name,
      Price: formValue.price,
      Description: formValue.description,
      ImageLink: formValue.imageLink,
    };

    this.itemService.createItem(itemData).subscribe(
      (response: any) => {
        this.toastr.success('Item created successfully!');
        this.router.navigate(['/items']);
      },
      (error: any) => {
        this.toastr.error('Error creating item.');
      }
    );
  }
}
