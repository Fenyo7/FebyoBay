import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  // Features array
  features: string[] = [
    'Register to the application',
    'Sign in to the application',
    'Modify user data',
    'Delete user account',
    'Logout of the application',
    'Create a sellable item',
    'List existing sellable items',
    "View a specific sellable item's details",
    'Buy a sellable item',
    "Edit a user's item",
    "Delete a user's item",
    'Fortune wheel to increase wealth',
    'Backend integration tests',
    'Backend unit tests',
    'Frontend snapshot tests',
    'Frontend & Backend CI',
    'Deployed to Railway through CD',
  ];
}
