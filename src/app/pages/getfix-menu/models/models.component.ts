import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { ModelService } from '../../../services/model.service';
import { map } from 'rxjs/operators';
import { ModelFormComponent } from '../model-form/model-form.component'
import { Model } from '../../../models/model';
@Component({
  selector: 'ngx-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  settings = {
    mode: 'external',
    title: 'Models',
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
        title: 'Model Name',
        type: 'text',
        width: '30%',
      },
      categoryName: {
        title: 'Category Name',
        type: 'text',
        width: '30%',
      },
      brandName: {
        title: 'Brand Name',
        type: 'text',
        width: '30%',
      },
      active: {
        title: 'Active',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (cell, row) => {
          // console.log("este es el active", row.active)
          let handler = row.active;
          if (handler)
            return `<div class="text-center" > <i  class="fas fa-check-circle btn-success"></i> </div>`
          return ` <div  class="text-center" > <i class="fas fa-times-circle btn-danger" ></i> </div>`
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
  doingSomething: boolean = false;

  constructor(
    private _modelService: ModelService,
    private _windowService: NbWindowService,
    private _toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.getModelList()
  }

  getModelList() {
    this._modelService.getModelList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(models => {
      console.log(models)
      this.source.load(models);
      this.source.setPaging(1, 15);
    })
  }

  onAdd(ev) {
    console.log("ADD->", ev)
    this._windowService.open(ModelFormComponent, {
      title: `Create Model: `,
      context: [{ active: false, categoryId: '' }]
    });
  }
  onEdit(ev: Model) {
    this._windowService.open(ModelFormComponent, {
      title: `Edit Model: `,
      context: [ev],
    });

    console.log("work", ev)
  }
  userRowSelect(ev) {
    console.log(ev)
  }

  customAction(ev) {
    console.log(ev)
  }

  onDeleteConfirm(event): void {
    console.log(event)
    this.doingSomething = true;
    if (window.confirm('Are you sure you want to delete?')) {
      console.log("BORRAR:", event.data.id)
      this._modelService.deleteCategory(event.data.id)
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
