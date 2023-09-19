import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  private subscription: Subscription = new Subscription();
  protected username: string | null = null;
  private id: number | null = null;
  protected balance: number = 0;

  constructor (private userService: UserService) {}

  ngOnInit(): void {
    this.username = this.getUsername();
    this.id = this.getId();

    if(this.id){
      this.getBalance();
    }
  }

  getUsername(): string | null {
    const userData = localStorage.getItem('name');
    return userData ? userData : null;
  }

  getId(): number | null {
    const userData = localStorage.getItem('id');
    return userData ? Number(userData) : null;
  }

  getBalance(): void {
    this.subscription.add(
      this.userService.getBalance(this.id ? this.id : 0).subscribe(
        (balance: number) => {
          this.balance = balance;
        },
        (error) => {
          console.error('Error fetching balance:', error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
  }
}
