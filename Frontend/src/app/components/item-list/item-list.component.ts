import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-items-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '150px',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('collapsed <=> expanded', [animate('0.5s')]),
    ]),
  ],
})
export class ItemListComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((data) => {
      this.items = data;
      this.items.forEach(item => item.collapsed = true);
    });
  }

  toggleItemState(item: any) {
    item.collapsed = !item.collapsed;
    let index = this.items.findIndex(i => i === item);

    for(let i = 0; i < this.items.length; i++){
      if(i != index){
        this.items[i].collapsed = true;
      }
    }
  }

  closeItemDetail(item: any, event: Event) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the card
    item.state = 'collapsed';
  }
}
