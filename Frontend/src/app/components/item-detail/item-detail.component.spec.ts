import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ItemDetailComponent } from './item-detail.component';
import { HeaderComponent } from '../header/header.component';

describe('ItemDetailComponent', () => {
  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemDetailComponent, HeaderComponent],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
