import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PositionModel } from '../entity/position.model';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'ngx-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  position: PositionModel = null;
  zoom: number = 1;
  melo: string = 'bien o que';
  @Input()
  public set searchedPosition(position: PositionModel) {
    debugger
    if (position) {
      this.position = position;
      this.zoom = 12;
    }
  }
  mapMarker: MapMarker;
  constructor() {


  }
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 5.021428, lng: -73.995457 };
  markerPositions: google.maps.LatLngLiteral[] = [this.center];

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }


  ngOnInit() {
    // set up current location
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
  }
}
