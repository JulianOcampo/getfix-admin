import { Component, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { ServiceRequestDocument } from '../../../models/service-request-document';
import { GetfixRequestsService } from '../../../services/getfix-requests.service';
import { formatDate } from '@angular/common';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { TimerService } from '../../../services/timer.service';
import { environment } from '../../../../environments/environment';
import { WorkerService } from '../../../services/worker.service';
import { WorkerLocation } from '../../../models/worker-location';
import { CardSettings } from '../../../models/card-setting';
import { NotifyService } from '../../../services/notify.service';
import { User } from '../../../models/user';
import { Worker } from '../../../models/worker';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { firestore } from 'firebase';
@Component({
  selector: 'ngx-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  queries: {
    dialog: new ViewChild("dialog")
  },
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

  saveSuccess: boolean = false;
  saveError: boolean = false;
  dialog: TemplateRef<any>;
  approvedByAdmin: boolean = false;
  openDenyPaymentOption: Boolean = false;
  user: User;
  worker: Worker;
  action: string = '';
  actionsPaymentForm = this.fb.group({
    justification: new FormControl('', { validators: Validators.required, updateOn: 'change' })
  })
  constructor(
    private activatedRouter: ActivatedRoute,
    private _serviceRequestService: GetfixRequestsService,
    private _toastrService: NbToastrService,
    private _dialogService: NbDialogService,
    private themeService: NbThemeService,
    private _workerService: WorkerService,
    private _notifyService: NotifyService,
    private _timerService: TimerService,
    private fb: FormBuilder,
    @Optional() protected _dialogRef: NbDialogRef<any>,
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
        ).subscribe(async serviceRequest => {
          this.liveService = false;
          this.stopTime();
          this.serviceRequest = serviceRequest;
          this.user = Object.assign(new User, await (await serviceRequest.refUserId.get()).data())
          this.worker = Object.assign(new Worker, await (await serviceRequest.refWorkerId.get()).data())
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

  get justification() {
    return this.actionsPaymentForm.get('justification') as FormControl;
  }

  formatDate(handler: string) {
    if (handler == 'dateStart') {
      return formatDate(this.serviceRequest.dateStart.toDate(), 'dd-MM-yyyy hh:mm', 'en-US')

    } else if (handler == 'dateEstimatedArrival') {
      if (this.serviceRequest.dateEstimatedArrival)
        return formatDate(this.serviceRequest.dateEstimatedArrival.toDate(), 'dd-MM-yyyy hh:mm', 'en-US')
      else
        return '--:--'
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

  openActionForPayment(action: string) {
    debugger

    this.action = action;
    console.log(this.actionsPaymentForm)
    this._dialogRef = this._dialogService.open(this.dialog, { closeOnBackdropClick: false, closeOnEsc: false, context: { title: action == 'approve' ? 'Approving Payment' : 'Denyng Payment' } });
  }

  approvePayment() {
    this.approvedByAdmin = true;
    this._serviceRequestService.completePayment(this.serviceRequest.bill.paymentId).toPromise()
      .then(completePaymentResponse => {
        console.log(completePaymentResponse)
        this.serviceRequest.bill.statusPayment = completePaymentResponse.status;
        this.serviceRequest.bill.lastDateChange = firestore.Timestamp.fromDate(new Date());
        if (!this.serviceRequest.reasons) this.serviceRequest.reasons = { admin: '', user: '', worker: '' }
        this.serviceRequest.reasons.admin = this.justification.value;
        return this._serviceRequestService.updateServiceRequest(this.serviceRequest.id,
          {
            bill: this.serviceRequest.bill,
            reasons: this.serviceRequest.reasons,
          })
      }).then(serviceUpdated => {
        console.log(serviceUpdated)
        if (!serviceUpdated) {
          throw new Error("no se ha podido actualizar el servicio");
        }
        return this._notifyService.sendMessageToDevice(this.worker.token, environment.constants.notify.paymentCompleted).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendMessageToDevice(this.user.token, environment.constants.notify.paymentCompleted).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendEmailToUser(this.worker.email, environment.constants.notify.paymentCompletedSubject, environment.constants.notify.paymentCompleted, environment.constants.notify.paymentCompleted).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
        return this._notifyService.sendEmailToUser(this.user.email, environment.constants.notify.paymentCompletedSubject, environment.constants.notify.paymentCompleted, environment.constants.notify.paymentCompleted).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
      })
      .catch(error => {
        console.error(error)
        this.saveError = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`Service ${this.serviceRequest.id} could not be approved!`, 'top-right', 'danger');
        }, 1000);
      })
      .finally(() => {
        this.saveSuccess = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`Service ${this.serviceRequest.id} was approved sucefull!`, 'top-right', 'success');
        }, 1000);
      })
  }

  denyPayment() {
    this.approvedByAdmin = true;
    this._serviceRequestService.cancelPayment(this.serviceRequest.bill.paymentId).toPromise()
      .then(cancelPaymentResponse => {
        console.log(cancelPaymentResponse)
        this.serviceRequest.bill.statusPayment = cancelPaymentResponse.status;
        this.serviceRequest.bill.lastDateChange = firestore.Timestamp.fromDate(new Date());
        if (!this.serviceRequest.reasons) this.serviceRequest.reasons = { admin: '', user: '', worker: '' }
        this.serviceRequest.reasons.admin = this.justification.value;
        return this._serviceRequestService.updateServiceRequest(this.serviceRequest.id,
          {
            bill: this.serviceRequest.bill,
            reasons: this.serviceRequest.reasons,
          })
      }).then(serviceUpdated => {
        console.log(serviceUpdated)
        if (!serviceUpdated) {
          throw new Error("no se ha podido actualizar el servicio");
        }
        return this._notifyService.sendMessageToDevice(this.worker.token, environment.constants.notify.paymentCanceled).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendMessageToDevice(this.user.token, environment.constants.notify.paymentCanceled).toPromise()
      })
      .then(messageResponse => {
        console.log(messageResponse)
        return this._notifyService.sendEmailToUser(this.worker.email, environment.constants.notify.paymentCanceledSubject, environment.constants.notify.paymentCanceled, environment.constants.notify.paymentCanceled).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
        return this._notifyService.sendEmailToUser(this.user.email, environment.constants.notify.paymentCanceledSubject, environment.constants.notify.paymentCanceled, environment.constants.notify.paymentCanceled).toPromise()
      })
      .then(emailResponse => {
        console.log(emailResponse)
      })
      .catch(error => {
        console.error(error)
        this.saveError = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`Service ${this.serviceRequest.id} could not be denied!`, 'top-right', 'danger');
        }, 1000);
      })
      .finally(() => {
        this.saveSuccess = true;
        setTimeout(() => {
          this._dialogRef.close();
          this.showToast(`Service ${this.serviceRequest.id} was denied sucefull!`, 'top-right', 'success');
        }, 1000);
      })
  }

  showToast(message, position, status) {
    this._toastrService.show(
      status || 'Success',
      `Result: ${message}`,
      { position, status });
  }

  cancelApprove() {
    this._dialogRef.close();
    this.openDenyPaymentOption = false;
    this.approvedByAdmin = false;
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
