import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';
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

  doingSomething: boolean = false;
  source: LocalDataSource = new LocalDataSource();

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
    private _categoryService: CategoryService,
    private _windowService: NbWindowService,
    private _toastrService: NbToastrService,
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
      this.source.setPaging(1, 5);

    })
  }

  onDeleteConfirm(event): void {
    console.log(event)
    this.doingSomething = true;
    if (window.confirm('Are you sure you want to delete?')) {
      console.log("BORRAR:", event.data.id)
      this._categoryService.deleteCategory(event.data.id)
        .finally(() => {
          this.doingSomething = false;
          this.showToast(`${event.data.name} deleted!`, 'top-right', 'success');
        })
    } else {
      console.log("BORRAR Descartado")
      this.doingSomething = false;
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
    this._windowService.open(CategoryFormComponent, {
      title: `Create Category: `,
      context: { active: false }
    });
  }

  onEdit(ev) {
    this._windowService.open(CategoryFormComponent, {
      title: `Edit Category: `,
      context: ev.data
    });

    console.log("work", ev)
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }
}
