import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service'; 

@Component({
  selector: 'app-items-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    console.log('init');
    this.itemService.getAllItems().subscribe(data => {
      this.items = data;
    });
    console.log(this.items);
  }
}
