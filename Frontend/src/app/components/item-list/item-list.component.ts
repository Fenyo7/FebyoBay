import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Subscription, switchMap } from 'rxjs';
import { updateBalanceDTO } from 'src/app/models/DTOs/updateBalance.dto';

@Component({
  selector: 'app-items-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(200)),
    ]),
  ],
})
export class ItemListComponent implements OnInit {
  @Input() itemsForSale: any[] = [];
  @Input() soldItems: any[] = [];

  protected selectedItem: any = null; // This will hold the currently selected item
  protected deleteConfirm: boolean = false;
  protected userName: string = '';

  private subscription: Subscription = new Subscription();
  private userId: number | null = null;
  private userBalance = 0;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchItems();
    this.userId = this.getUserId();
    if (this.userId != null) {
      this.getBalance();
    }
  }

  fetchItems(): void {
    this.itemService.getAllItems().subscribe((data: any) => {
      this.itemsForSale = data.filter((item: any) => !item.isSold);
      this.soldItems = data.filter((item: any) => item.isSold);
    });
  }

  expandItem(item: any) {
    this.userId = this.getUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      this.toastr.warning('You need to be logged in to see the details of items!');
      return;
    }

    this.selectedItem = item;
    this.userService.getUserById(this.selectedItem.userId).subscribe((user) => {
      this.userName = user.username;
    });
  }

  closeItemDetail() {
    this.selectedItem = null;
    this.deleteConfirm = false;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/image-not-found.png';
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
  }

  isUserTheOwner(): boolean {
    return this.selectedItem.userId === this.userId;
  }

  buyItem(): void {
    this.userId = this.getUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      this.toastr.warning('You need to be logged in to buy items!');
      return;
    }

    this.getBalance();

    if (this.selectedItem.price > this.userBalance) {
      this.toastr.warning("You don't have enough money on your account!");
      return;
    }

    this.itemService
      .buyItem(this.selectedItem.id)
      .pipe(
        switchMap((response: any) => {
          // Deduct the item's price from the user's balance
          const updateBalance: updateBalanceDTO = {
            UserId: Number(this.userId),
            Amount: -this.selectedItem.price,
          };
          return this.userService.updateBalance(updateBalance);
        })
      )
      .subscribe(
        (response: any) => {
          this.toastr.success(
            `Successfully purchased ${this.selectedItem.name}!`
          );

          // Refresh the items lists
          this.fetchItems();

          // Update the balance in the service
          const newBalance = this.userBalance - this.selectedItem.price;
          this.userService.updateBalanceInService(newBalance);

          // Reset the selected item
          this.selectedItem = null;
        },
        (error: any) => {
          this.toastr.error('Purchase failed.');
          console.log(error);
        }
      );
  }

  getUserId(): number | null {
    const userData = localStorage.getItem('id');
    return userData ? Number(userData) : null;
  }

  getBalance(): void {
    this.subscription.add(
      this.userService.getBalance(Number(this.userId)).subscribe(
        (balance: number) => {
          this.userBalance = balance;
        },
        (error) => {
          console.error('Error fetching balance:', error);
        }
      )
    );
  }

  editItem(): void {
    this.router.navigate([`/create-item/${this.selectedItem.id}`]);
  }

  deleteItem(): void {
    if (this.deleteConfirm) {
      this.itemService.deleteItem(this.selectedItem.id).subscribe(
        (response: any) => {
          this.toastr.success('Item successfully deleted');

          // Remove the deleted item from the list
          const index = this.itemsForSale.findIndex(
            (item) => item.id === this.selectedItem.id
          );
          if (index !== -1) {
            this.itemsForSale.splice(index, 1);
          }

          this.selectedItem = null;
        },
        (error: any) => {
          this.toastr.error('Could not delete item.');
          console.log(error);
        }
      );
      this.deleteConfirm = false;
    } else {
      this.toastr.warning(
        `Are you sure you want to delete ${this.selectedItem.name} from the shop?`
      );
    }
  }

  deleteToggle(): void {
    this.deleteConfirm = true;
    this.toastr.warning(
      `Are you sure you want to delete ${this.selectedItem.name} from the shop?`
    );
  }

  deleteCancel(): void {
    this.deleteConfirm = false;
  }
}
