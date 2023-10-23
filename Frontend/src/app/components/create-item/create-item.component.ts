import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddItemDTO } from 'src/app/models/DTOs/add-item.dto';
import { ToastrService } from 'ngx-toastr';
import { NotFoundError } from 'rxjs';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit {
  protected itemId: number | null = null;
  private item: any;
  private isValidImageLink: boolean = true;

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

    if (this.itemId) {
      this.itemService.getItemById(this.itemId).subscribe(
        (data: any) => {
          if (data) {
            // If we find the item
            this.item = data;
            if (
              Number(this.item.userId) === Number(localStorage.getItem('id'))
            ) {
              // And the item's creator is the current user
              // Fill up form data with existing item's data
              this.itemName = this.item.name;
              this.itemPrice = this.item.price;
              this.itemDescription = this.item.description;
              this.itemImageLink = this.item.imageLink;
            } else {
              // If the creator is not the current user
              this.toastr.error('Wrong item.');
              this.router.navigate(['/create-item']);
            }
          } else {
            // If the item doesn't exist (e.g., empty response)
            this.toastr.error('Item not found.');
            this.router.navigate(['/create-item']);
          }
        },
        (error: any) => {
          if (error.status === 404) {
            // If the item is not found
            this.toastr.error('Item not found.');
            this.router.navigate(['/create-item']);
          } else {
            // Other errors
            this.toastr.error('An error occurred.');
            this.router.navigate(['/create-item']);
          }
          console.log(error);
        }
      );
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
      } else if (!this.isValidImageLink) {
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
          this.toastr.success('Saved changes!');
          this.router.navigate(['/items']);
        },
        (error: any) => {
          this.toastr.error('Error editing item.');
          console.log(error);
        }
      );
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/image-not-found.png';
    this.isValidImageLink = false;
  }
  
  onImageLoad(event: any): void {
    this.isValidImageLink = true;
  }

  // Obsolete image link validation
  /* isValidImageLink(link: string): boolean {
    // Regular expression to validate URL format including those with query parameters
    const urlPattern =
      /^(http(s?):)([/|.|\w|\s|-])+(\.(jpg|jpeg|gif|png|svg|bmp|webp))(\?[\w=&]+)?$/;

    // Regular expression to validate base64 encoded image data URIs
    const dataUriPattern =
      /^data:image\/(jpeg|jpg|png|gif|svg|bmp|webp);base64,[a-zA-Z0-9+/]+={0,2}$/;

    return urlPattern.test(link) || dataUriPattern.test(link);
  } */ 
}
