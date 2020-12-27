import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { BrandService } from '../../../services/brand.service';
import { map } from 'rxjs/operators'
import { BrandFormComponent } from '../brand-form/brand-form.component';

@Component({
  selector: 'ngx-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  doingSomething: boolean = false;

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
        type: 'text',
        width: '30%',
      },
      description: {
        title: 'Description',
        type: 'text',
        width: '60%',
      },
      active: {
        title: 'Active',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (cell, row) => {
          console.log("este es el active", row.active)
          let handler = row.active;
          if (handler)
            return `<div class="text-center"> <i  class="fas fa-check-circle btn-success"></i> </div>`
          return ` <div  class="text-center"> <i class="fas fa-times-circle btn-danger" ></i> </div>`
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

  constructor(
    private _brandService: BrandService,
    private _windowService: NbWindowService,
    private _toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.doingSomething = true;
    this._brandService.getBrandsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    ).subscribe(brands => {
      this.doingSomething = false;
      console.log(brands);
      this.source.load(brands);
      this.source.setPaging(1, 15);
    })
  }

  onAdd(ev) {
    console.log("ADD->", ev)
    this._windowService.open(BrandFormComponent, {
      title: `Create Brand: `,
      context: { active: false }
    });
  }

  onEdit(ev) {
    this._windowService.open(BrandFormComponent, {
      title: `Edit Brand: `,
      context: ev.data
    });

    console.log("work", ev)
  }

  userRowSelect(ev) {
    console.log(ev)
  }

  onDeleteConfirm(event): void {
    this.doingSomething = true;
    console.log(event)
    if (window.confirm('Are you sure you want to delete?')) {
      console.log("BORRAR:", event.data.id)
      this._brandService.deleteCategory(event.data.id)
        .finally(() => {
          this.doingSomething = false;
          this.showToast(`${event.data.name} deleted!`, 'top-right', 'success');
        })
    } else {
      console.log("BORRAR Descartado")
      this.doingSomething = false;

    }
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }

}
