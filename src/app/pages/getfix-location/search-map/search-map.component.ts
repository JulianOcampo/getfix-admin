import { Component } from '@angular/core';
import { WorkerStatusInfo } from '../../../models/workerStatus';
import { PositionModel } from './entity/position.model';

@Component({
  selector: 'ngx-search-map',
  templateUrl: './search-map.component.html',
})
export class SearchMapComponent {
  searchedPosition: PositionModel = new PositionModel();
  selectedWorkerStatus: WorkerStatusInfo = new WorkerStatusInfo();
  setPosition(position: PositionModel) {
    this.searchedPosition = position;
  }

  setWorkerStatus(workerStatus: WorkerStatusInfo) {
    this.selectedWorkerStatus = workerStatus;
  }
}
