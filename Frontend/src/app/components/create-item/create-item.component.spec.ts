import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CreateItemComponent } from './create-item.component';
import { HeaderComponent } from '../header/header.component';
import { ToastrModule } from 'ngx-toastr';

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'mockValue',
    },
  },
};

describe('CreateItemComponent', () => {
  let component: CreateItemComponent;
  let fixture: ComponentFixture<CreateItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateItemComponent, HeaderComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormsModule,
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });
    fixture = TestBed.createComponent(CreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
