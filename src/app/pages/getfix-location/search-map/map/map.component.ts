import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PositionModel } from '../entity/position.model';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { WorkerStatusInfo } from '../../../../models/workerStatus';
import { WorkerService } from '../../../../services/worker.service';
import { first, map } from 'rxjs/operators';
import { Worker } from '../../../../models/worker';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private _workerService: WorkerService,
    private _toastrService: NbToastrService) {
  }
  @Input()
  public set searchedPosition(position: PositionModel) {
    if (position) {
      this.position = position;
      this.zoom = 10;
      this.center = position;
      console.log(this.zoom)
    }
  }
  @Input()
  public set selectedWorkerStatus(workerStatus: WorkerStatusInfo) {
    if ((workerStatus && workerStatus.value) || workerStatus.value == 0) {
      console.log(workerStatus)
      this._workerService.getWorkerByStatus(workerStatus.value).get().pipe(
        first(),
        map(worker =>
          worker.docs.map(doc => {
            return (Object.assign(new Worker(), { id: doc.id, ...doc.data() }))
          }))
      ).subscribe(workers => {
        console.log(workers.length)
        if (workers.length > 0) {
          this.markerPositions = [];
          this.animation = google.maps.Animation.BOUNCE;
        }else{
          this.showToast(`${workers.length} workers found`, 'top-right', 'info');

        }

        workers.forEach((data, index) => {
          if (data && data.g && data.g.geopoint) {
            console.log(data.g.geopoint)
            var workerPosition = { lat: data.g.geopoint.latitude, lng: data.g.geopoint.longitude }
            var markerPositions: google.maps.LatLngLiteral = workerPosition;
            this.markerPositions.push(markerPositions);
            if (index == workers.length - 1) {
              this.showToast(`${workers.length} workers found`, 'top-right', 'success');
              this.center = markerPositions;
              setTimeout(() => {
                this.animation = null;
              }, 1000);
            }
          }
        })
      })
    }
  }
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  position: PositionModel = null;
  zoom: number = 1;
  melo: string = 'bien o que';
  center: google.maps.LatLngLiteral = { lat: 5.021428, lng: -73.995457 };
  markerPositions: google.maps.LatLngLiteral[] = [this.center];
  animation = google.maps.Animation.BOUNCE;

  image = {
    url:
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };


  addMarker(event: google.maps.MouseEvent) {
    // this.markerPositions.push(event.latLng.toJSON());
  }


  ngOnInit() {
    // set up current location
    setTimeout(() => {
      this.animation = null;
    }, 1000);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.searchedPosition = new PositionModel(
          position.coords.latitude,
          position.coords.longitude,
        );
      });
    }


  }
  openInfoWindow(marker: MapMarker) {
    console.log(marker)
    this.infoWindow.open(marker);
    this.melo = marker._marker.getPosition().toString();
    marker._marker.getMap().setZoom(6);
  }
  closeInfoWindows(marker: MapMarker) {
    // this.infoWindow.close();
  }
  cl(ev) {
    console.log(ev)
  }
  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }
}
