import { TestBed } from '@angular/core/testing';

import { PagesMenuService } from './pages-menu.service';

describe('PagesMenuService', () => {
  let service: PagesMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagesMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
