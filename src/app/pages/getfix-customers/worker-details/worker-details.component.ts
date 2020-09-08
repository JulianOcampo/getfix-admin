import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkerService } from '../../../services/worker.service';

@Component({
  selector: 'ngx-worker-details',
  templateUrl: './worker-details.component.html',
  styleUrls: ['./worker-details.component.scss']
})
export class WorkerDetailsComponent implements OnInit {
  public worker: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _workerService: WorkerService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this._workerService.getWorker(params.id).get()
          .subscribe(
            _worker => {
              this.worker = { id: _worker.id, ..._worker.data() }
              console.log(this.worker)
            }

          )

        console.log(params)
      }
    )
  }

}
