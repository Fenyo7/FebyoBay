import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddItemDTO } from 'src/app/models/DTOs/add-item.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit {
  protected itemId: number | null = null;
  private item: any;

  itemName: string = '';
  itemPrice: number = 0;
  itemDescription: string = '';
  itemImageLink: string = '';

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id')
      ? Number(this.route.snapshot.paramMap.get('id'))
      : null;
    console.log(this.itemId);
    if (this.itemId) {
      this.itemService.getItemById(this.itemId).subscribe((data: any) => {
        this.item = data;
        this.itemName = this.item.name;
        this.itemPrice = this.item.price;
        this.itemDescription = this.item.description;
        this.itemImageLink = this.item.imageLink;
      });
    }
  }

  onSubmit() {
    // Validate input data
    {
      // Check if user is logged in
      if (!Number(localStorage.getItem('id'))) {
        this.router.navigate(['/login']);
        this.toastr.error('Please login to create an item.');
        return;
      }

      // Check for empty name field
      if (!this.itemName) {
        this.toastr.warning('Please name your item.');
        return;
      }

      // Check for invalid price
      if (this.itemPrice <= 0) {
        this.toastr.warning('Please give a price greater than 0.');
        return;
      }

      // Check for empty description
      if (!this.itemDescription) {
        this.toastr.warning('Please describe your item.');
        return;
      }

      // Check for empty or faulty image link
      if (!this.itemImageLink) {
        this.toastr.warning(
          'Please provide a link for the image of your item.'
        );
        return;
      } else if (!this.isValidImageLink(this.itemImageLink)) {
        this.toastr.warning('Please provide a valid picture link.');
        return;
      }
    }

    let itemData: AddItemDTO = {
      UserId: Number(localStorage.getItem('id')),
      Name: this.itemName,
      Price: this.itemPrice,
      Description: this.itemDescription,
      ImageLink: this.itemImageLink,
    };

    if (!this.itemId) {
      this.itemService.createItem(itemData).subscribe(
        (response: any) => {
          this.toastr.success('Item created successfully!');
          this.router.navigate(['/items']);
        },
        (error: any) => {
          this.toastr.error('Error creating item.');
          console.log(error);
        }
      );
    } else {
      this.itemService.editItem(this.itemId, itemData).subscribe(
        (response: any) => {
          this.toastr.success('Item succesfully edited');
          this.router.navigate(['/items']);
        },
        (error: any) => {
          this.toastr.error('Error editing item.');
          console.log(error);
        }
      );
    }
  }

  isValidImageLink(link: string): boolean {
    // Regular expression to validate URL format
    const urlPattern = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)$/;

    // Regular expression to validate base64 encoded image data URIs
    const dataUriPattern =
      /^data:image\/(jpeg|jpg|png|gif);base64,[a-zA-Z0-9+/]+={0,2}$/;

    return urlPattern.test(link) || dataUriPattern.test(link);
  }
}
