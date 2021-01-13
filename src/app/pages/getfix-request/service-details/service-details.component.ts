import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { ServiceRequestDocument } from '../../../models/service-request-document';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { formatDate } from '@angular/common';
import { NbThemeService } from '@nebular/theme';
import { TimerService } from '../../../services/timer.service';
import { environment } from '../../../../environments/environment';
import { WorkerService } from '../../../services/worker.service';
import { WorkerLocation } from '../../../models/worker-location';
import { CardSettings } from '../../../models/card-setting';

@Component({
  selector: 'ngx-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {

  suscriptionServiceDetails: any = [];
  suscriptionHelper: Array<any> = [];
  serviceRequestId: string = '';
  serviceRequest: ServiceRequestDocument = new ServiceRequestDocument;
  readonly position = { lat: 51.678418, lng: 7.809007 };
  center: google.maps.LatLngLiteral = { lat: 6, lng: -70 };
  animation = google.maps.Animation.BOUNCE;
  markerWorkerPosition: google.maps.LatLngLiteral = this.center;
  markerUserPosition: google.maps.LatLngLiteral = this.center;
  markerWorkerOptions: google.maps.MarkerOptions = {
    icon: {
      url:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    },
    animation: this.animation,
  }
  markerUserOptions: google.maps.MarkerOptions = {
    icon: {
      url:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32),
    },
    animation: this.animation,

  }
  vertices: google.maps.LatLngLiteral[] = [
    { lat: 13, lng: 13 },
    { lat: -13, lng: 0 },
  ];
  polylineOptions: google.maps.PolylineOptions = {
    path: this.vertices,
    strokeColor: '#3366ff',
    icons: [
      {
        repeat: '33%',
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 2,
          strokeColor: 'black'
        }
      }
    ]
  }
  zoom = 12;
  workerLiveLocations: google.maps.LatLngLiteral[] = [this.center];
  time: string = '00:00:00';
  timerHandler: any;
  solarValue: number;
  lightCard: CardSettings = {
    title: 'Active live mode',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
  ];
  private alive = true;

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: 'warning',
        },
      ],
      dark: this.commonStatusCardsSet,
    };
  liveService: boolean = false;
  constructor(
    private activatedRouter: ActivatedRoute,
    private _serviceRequestService: GetfixRequestsService,
    private themeService: NbThemeService,
    private _timerService: TimerService,
    private _workerService: WorkerService,
  ) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });
  }

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(params => {
      this.serviceRequestId = params.id;
      this.suscriptionServiceDetails = this._serviceRequestService.getServiceRequest(params.id).snapshotChanges()
        .pipe(
          map(data => ({ id: data.payload.id, ...data.payload.data() }) as ServiceRequestDocument)
        ).subscribe(serviceRequest => {
          this.liveService = false;
          this.stopTime();
          this.serviceRequest = serviceRequest;
          var workerPosition: google.maps.LatLngLiteral = { lat: serviceRequest.locationResponse.latitude, lng: serviceRequest.locationResponse.longitude };
          var userPosition: google.maps.LatLngLiteral = { lat: serviceRequest.locationRequest.latitude, lng: serviceRequest.locationRequest.longitude };
          this.markerWorkerPosition = workerPosition;
          this.markerUserPosition = userPosition;

          this.vertices = [
            { lat: serviceRequest.locationResponse.latitude, lng: serviceRequest.locationResponse.longitude },
            { lat: serviceRequest.locationRequest.latitude, lng: serviceRequest.locationRequest.longitude },
          ]
          this.polylineOptions.path = this.vertices;

          this.center = this.setCenterMap(this.vertices);
          console.log(this.serviceRequest)
        })
      this.suscriptionHelper.push({ suscriber: this.suscriptionServiceDetails })

    })
  }

  formatDate(handler: string) {
    if (handler == 'dateStart') {
      return formatDate(this.serviceRequest.dateStart.toDate(), 'dd-MM-yyyy hh:mm', 'en-US')

    } else if (handler == 'dateEstimatedArrival') {
      return formatDate(this.serviceRequest.dateEstimatedArrival.toDate(), 'dd-MM-yyyy hh:mm', 'en-US')

    }
  }

  openInfoWindow(marker) {
    console.log(marker)
  }

  onInViewportChange(ev) {
    if (ev) {
      setTimeout(() => {
        this.markerUserOptions.animation = null;
        this.markerWorkerOptions.animation = null;
        this.animation = null;
      }, 3000);
    }

  }

  getStateService(stateService: number): string {
    var finalStateService = '';
    switch (stateService) {
      case 0:
        finalStateService = 'Denied by worker and searching new one'
        break;
      case 1:
        finalStateService = 'Pending (in process of acceptance)'
        break;
      case 2:
        finalStateService = 'Service Accepted'
        break;
      case 3:
        finalStateService = 'Worker Arrived'
        break;
      case 4:
        finalStateService = 'Worker Started Fixing'
        break;
      case 5:
        finalStateService = 'Service Completed'
        break;
      case 6:
        finalStateService = 'Canceled by Client'
        break;
      case 7:
        finalStateService = 'Canceled by Worker'
        break;
    }
    return finalStateService;
  }

  setCenterMap(pointers: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral {
    var centerLatArray = [];
    var centerLngArray = [];

    for (let i = 0; i < pointers.length; i++) {
      var centerCoords = pointers[i];

      if (isNaN(Number(centerCoords.lat))) {
      } else {
        centerLatArray.push(Number(centerCoords.lat));
      }

      if (isNaN(Number(centerCoords.lng))) {
      } else {
        centerLngArray.push(Number(centerCoords.lng));
      }
    }

    var centerLatSum = centerLatArray.reduce(function (a, b) { return a + b; });
    var centerLngSum = centerLngArray.reduce(function (a, b) { return a + b; });

    var centerLat = centerLatSum / pointers.length;
    var centerLng = centerLngSum / pointers.length;

    console.log(centerLat);
    console.log(centerLng);
    var finalCenter: google.maps.LatLngLiteral = {
      lat: centerLat,
      lng: centerLng
    }
    return finalCenter;
  }

  setLiveService() {
    if (this.liveService) {
      this.liveService = false;
      this.stopTime();

    } else {
      this.liveService = true;
      this.getTime();

    }
  }
  getTime() {
    let start = Date.now();
    this.timerHandler = setInterval(() => {
      this._timerService.setTime(start);
      this.time = this._timerService.getTime();

      if (this.isMultiple(this._timerService.getSeconds(), environment.constants.liveServiceTimer)) {
        this._workerService.getWorkerLocation(this.serviceRequest.refWorkerId).get()
          .pipe(
            map(ref => {
              return { ...Object.assign(new WorkerLocation, { id: ref.id, ...ref.data() }) }
            })
          ).subscribe(data => {
            this.workerLiveLocations = [{ lat: data.coordinates.latitude, lng: data.coordinates.longitude }]
            console.log(data.coordinates)
          })
        console.log(this.time)
      }
    }, 1000);
  }

  stopTime() {
    clearInterval(this.timerHandler);
    this.time = '00:00:00'
  }

  isMultiple(value: number, multiple: number): boolean {
    let resto = value % multiple;
    if (resto == 0)
      return true;
    else
      return false;
  }

  ngOnDestroy() {
    console.log(this.suscriptionHelper.length, this.suscriptionHelper)
    this.suscriptionHelper.forEach(suscription => {
      console.log("abierta", suscription)
      if (!suscription.suscriber.closed) {
        suscription.suscriber.unsubscribe();
        suscription.suscriber.remove;
        console.log("Cerrando suscripciones..: cerrada?", suscription.suscriber.closed)
      }
    });
    this.alive = false;
    this.liveService = false;
    this.stopTime();
  }
}
