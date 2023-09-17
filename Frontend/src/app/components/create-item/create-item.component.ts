import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Router } from '@angular/router';
import { AddItemDTO } from 'src/app/models/DTOs/add-item.dto';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent {
  constructor(private itemService: ItemService, private router: Router) {}

  onSubmit(formValue: any) {
    const userId = 1; // Dummy data until login implemented

    let itemData : AddItemDTO = {
      userId: 1,
      name: formValue.name,
      price: formValue.price,
      description: formValue.description,
      imageLink: formValue.imageLink,
    }

    this.itemService.createItem(itemData).subscribe(
      (response) => {
        // Successful creation
        console.log('Item created successfully!', response);
        this.router.navigate(['/items']);
      },
      (error) => {
        // Error
        console.error('Error creating item:', error);
      }
    );
  }
}
