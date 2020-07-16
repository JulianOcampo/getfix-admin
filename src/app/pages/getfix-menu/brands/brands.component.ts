import { Component, OnInit } from '@angular/core';
import { NbWindowService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { BrandService } from '../../../services/brand.service';
import { map } from 'rxjs/operators'
import { BrandFormComponent } from '../brand-form/brand-form.component';

@Component({
  selector: 'ngx-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit  {
  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {

      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      active: {
        title: 'Active',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          console.log("este es el active", row.active)
          let handler = row.active;
          if (handler)
            return `<i class="fas fa-check-circle"></i>`
          return `<i class="fas fa-times-circle"></i>`
        },
        filter: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
            resetText: 'clear',
          },
        },

      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private _brandService: BrandService,
    private windowService: NbWindowService,

  ) { }

  ngOnInit(): void {
    this.getBrands();

  }

  getBrands() {
    this._brandService.getBrandsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    ).subscribe(brands => {
      console.log(brands);
      this.source.load(brands);
    })
  }

  onAdd(ev) {
    console.log("ADD->", ev)
    this.windowService.open(BrandFormComponent, {
      title: `Create Brand: `,
      context: { active: false }
    });
  }

  onEdit(ev) {
    this.windowService.open(BrandFormComponent, {
      title: `Edit Brand: `,
      context: ev.data
    });

    console.log("work", ev)
  }

}
