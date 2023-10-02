import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ItemListComponent } from './item-list.component';
import { HeaderComponent } from '../header/header.component';
import { ToastrModule } from 'ngx-toastr';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListComponent, HeaderComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
    });
    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
