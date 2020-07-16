import { Component, OnInit } from '@angular/core';
import { NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoryService } from '../../../services/category.service';
import { map } from 'rxjs/operators'

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
    private windowService: NbWindowService,
    private _categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories();

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
