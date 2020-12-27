import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { ManageFormComponent } from '../manage-form/manage-form.component';
import { LocalDataSource } from 'ng2-smart-table';
import { CourseService } from '../../../services/course.service';
import { map } from 'rxjs/operators';
import { Course } from '../../../models/course';

@Component({
  selector: 'ngx-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  settings = {
    mode: 'external',
    title: 'Manage Courses',
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
        title: 'Course Name',
        type: 'text',
        width: '44%',
      },
      categoryName: {
        title: 'Category Name',
        type: 'text',
        width: '34%',

      },
      totalQuestions: {
        title: 'Total Questions',
        type: 'text',
        sortDirection: 'desc',
        width: '10%',
      },
      active: {
        title: 'Active',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (cell, row) => {
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
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private _windowService: NbWindowService,
    private _courseService: CourseService,
    private _toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }


  getCourses() {
    this._courseService.getCourseList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data(), totalQuestions: c.payload.doc.data().questions.length })
        ))
    ).subscribe(courses => {
      console.log(courses)
      this.source.load(courses);
      this.source.setPaging(1, 15);
    })
  }

  onAdd(ev) {
    console.log("ADD->", ev)
    this._windowService.open(ManageFormComponent, {
      title: `Create Course: `,
      context: [{ active: false, courseId: '' }]
    });
  }
  onEdit(ev: Course) {
    this._windowService.open(ManageFormComponent, {
      title: `Edit Category: `,
      context: [ev],
    });

    console.log("work", ev)
  }
  onDeleteConfirm(event) {
    console.log(event.data.id)
    if (window.confirm(`Are you shure to delete test #: ${event.data.name} ?`)) {
      this._courseService.deleteCourse(event.data.id)
        .then(() => {
          console.log('Eliminado con exito')
          this.showToast(`${event.data.name} deleted!`, 'top-right', 'success');
        })
    }

  }
  userRowSelect(ev) {
    console.log(ev)
  }
  customAction(ev) {
    console.log(ev)
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }

}
