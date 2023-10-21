import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { updateBalanceDTO } from 'src/app/models/DTOs/updateBalance.dto';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.css'],
})
export class FortuneWheelComponent {
  wagerAmount: number = 0;
  userId: number | null = null;
  userBalance: number = 0;
  isSpinning: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserId();
    if (this.userId != null) {
      this.getBalance();
    }
  }

  onSpinWheelClick(): void {
    if(this.wagerAmount <= 0){
      this.toastr.warning('Please put in a valid amount!');
      return;
    }

    this.userService.spinWheel().subscribe((response) => {
      this.updateUserBalance(-this.wagerAmount);
      if (this.wagerAmount > this.userBalance) {
        this.toastr.warning("You don't have this much money! :(");
        return;
      }
      this.isSpinning = true;
      const segmentId = response.selectedSegment;
      const segmentDegree = 360 / 10; // For 10 segments
      const totalRotations = 8; // Number of full rotations for added effect
      const finalDegree =
        totalRotations * 360 + segmentId * segmentDegree + segmentDegree / 2;
      const multipliers = [10, 3, 0, 2, 5, 3, 0, 2, 3, 5];

      const innerWheel = document.querySelector('.inner-wheel') as HTMLElement;

      innerWheel.style.transition = 'none';
      innerWheel.style.transform = 'rotate(0deg)';

      requestAnimationFrame(() => {
        innerWheel.style.transition =
          'transform 8s cubic-bezier(0.23, 1, 0.32, 1)';
        innerWheel.style.transform = `rotate(${finalDegree}deg)`;
      });

      setTimeout(() => {
        const multiplier = multipliers[segmentId];
        const outcome = this.wagerAmount * multiplier;

        if (multiplier === 0) {
          this.toastr.warning('You lost your wager!');
        } else {
          this.toastr.success(`You won ${multiplier}x!`);
          this.updateUserBalance(outcome); // Use the updateUserBalance method to add the prize
        }
        this.isSpinning = false;
      }, 8000);
    });
  }

  updateUserBalance(amount: number): void {
    const dto: updateBalanceDTO = {
      UserId: Number(this.userId),
      Amount: amount,
    };

    this.userService.updateBalance(dto).subscribe(
      (response) => {
        if (response.message === "User's balance updated successfully") {
          this.userBalance += amount; // Update the local balance
          this.userService.updateBalanceInService(this.userBalance);
        } else {
          this.toastr.error('Something went wrong!');
          console.error('Unexpected response:', response.message);
        }
      },
      (error) => {
        this.toastr.error('Error updating balance!');
        console.error('Error updating balance:', error);
      }
    );
  }

  onRegainMoneyClick(): void {
    this.getBalance();

    if (this.userBalance > 0) {
      this.toastr.warning('You can only get free money if you have none!');
      return;
    }

    const dto: updateBalanceDTO = {
      UserId: Number(this.userId),
      Amount: 10000,
    };
    this.userService.updateBalance(dto).subscribe((response) => {
      this.toastr.success(`You now have ${dto.Amount} Ft!`);
    });
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
}
