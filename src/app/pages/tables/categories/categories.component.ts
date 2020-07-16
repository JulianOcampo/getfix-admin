import { Component, OnInit } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { CategoryFormComponent } from '../../category-form/category-form.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

import { map } from 'rxjs/operators'
import { CustomViewComponent } from 'ng2-smart-table/lib/components/cell/cell-view-mode/custom-view.component';

@Component({
  selector: 'ngx-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

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
    // actions: {
    //   custom: [
    //     {
    //       name: 'viewAction',
    //       title: '<i class="ion-document" title="view"></i>'
    //     },
    //     {
    //       name: 'editAction',
    //       title: '<i class="ion-edit" title="Edit"></i>'
    //     },
    //     {
    //       name: 'deleteAction',
    //       title: '<i class="far fa-trash-alt" title="delete"></i>'
    //     }
    //   ],
    //    position: 'right',
    //    add: false,
    //   edit: false,
    //   delete: false
    // },
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

  public categories: any;

  constructor(
    private service: SmartTableData,
    private windowService: NbWindowService,
    private _categoryService: CategoryService
  ) {
    // const data = this.service.getData();
  }

  ngOnInit() {
    this.getCategories();
    console.log("oninit")
    // this.source.load([]);

  }

  getCategories() {
    this._categoryService.getCategoriesList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(categories => {
      console.log(categories)
      this.source.load(categories);
    })
  }

  onDeleteConfirm(event): void {
    console.log(event)
    if (window.confirm('Are you sure you want to delete?')) {
      console.log("BORRAR:", event.data.id)
      this._categoryService.deleteCategory(event.data.id)
    } else {
      console.log("BORRAR Descartado")
    }
  }

  userRowSelect(ev) {
    console.log(ev)
  }
  customAction(ev) {
    console.log(ev)
  }

  onAdd(ev) {
    console.log("ADD->", ev)
    this.windowService.open(CategoryFormComponent, {
      title: `Create Category: `,
      context: { active: false }
    });
  }

  onEdit(ev) {
    this.windowService.open(CategoryFormComponent, {
      title: `Edit Category: `,
      context: ev.data
    });

    console.log("work", ev)
  }



}
