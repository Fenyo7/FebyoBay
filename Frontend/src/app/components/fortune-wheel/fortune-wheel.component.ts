import { Component } from '@angular/core';

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.css'],
})
export class FortuneWheelComponent {
  wagerAmount: number = 0;

  spinWheel() {
    // Logic to call the backend and spin the wheel
  }

  regainMoney() {
    // Logic to call the backend to regain money
  }
}
