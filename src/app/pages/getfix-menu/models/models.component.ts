import { Component, OnInit } from '@angular/core';
import { NbWindowService } from '@nebular/theme';

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
    title: 'sisa',
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
        type: 'string',
      },
      categoryName: {
        title: 'Category Name',
        type: 'string',
      },
      brandName: {
        title: 'Brand Name',
        type: 'string',
      },
      active: {
        title: 'Active',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          // console.log("este es el active", row.active)
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
    private _modelService: ModelService,
    private _windowService: NbWindowService
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
      title: `Create Category: `,
      context: [{ active: false, categoryId: '' }]
    });
  }
  onEdit(ev: Model) {
    this._windowService.open(ModelFormComponent, {
      title: `Edit Category: `,
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
}
