import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-items-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(200)),
    ])
  ]
})

export class ItemListComponent implements OnInit {
  @Input() items: any[] = [];
  selectedItem: any = null; // This will hold the currently selected item

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
      this.itemService.getAllItems().subscribe((data: any) => {
          this.items = data;
      });
  }

  expandItem(item: any) {
    this.selectedItem = item;
    console.log(`selected item: ${this.selectedItem.name}`);
  }

  closeItemDetail() {
    this.selectedItem = null;
  }
}
