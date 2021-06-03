/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBc0Pgxabki5tjkE8iNKtLrauFOp9rwgm8",
    authDomain: "getfix24-e3383.firebaseapp.com",
    databaseURL: "https://getfix24-e3383.firebaseio.com",
    projectId: "getfix24-e3383",
    storageBucket: "getfix24-e3383.appspot.com",
    messagingSenderId: "473139809592",
    appId: "1:473139809592:web:b870764f6c47dd12cdc5cd",
    measurementId: "G-GEL6N9EQN7"
  },
  firebaseRef: {
    category: '/Categories',
    brand: '/Brands',
    model: '/Models',
    worker: '/Workers',
    course: '/Courses',
    user: '/Users',
    serviceRequest: '/ServiceRequests',
    admin: '/Admin',
    uploadPathAdminProfile: '/UploadsAdminProfile',
    uploadProfile: '/Profile',
    location: '/Location',
    bankStorage: '/BankStorage',
  },
  uploadPath: {
    category: 'uploads/category_',
    brand: 'uploads/brand_',
    categoryBackup: 'backup/category_',
    brandBackup: 'backup/brand_',
  },
  firebaseFunctionApi: {
    url: 'https://us-central1-getfix24-e3383.cloudfunctions.net/api',
    saveCourseResult: '/saveCourseResult',
    sendMessageToDevice: '/sendMessageToDevice',
    sendMail: '/sendMail',
    workerStatus: '/workerStatus',
    completePayment: '/completePayment',
    cancelPayment: '/cancelPayment',
  },
  constants: {
    liveServiceTimer: 60,
    workerStates: {
      available: 0,
      busy: 1,
      inService: 2,
      blocked: 3,
      denyByAdmin: 4,
      pendingRequestToWork: 5
    },
    notify: {
      serviceAccepted: 'serviceaccepted',
      workerArrived: 'workerarrived',
      workerStartedFixing: 'workerstartedfixing',
      canceledByClient: 'canceledbyclient',
      canceledBWorker: 'canceledbyworker',
      serviceCompleted: 'servicecompleted',
      newService: 'newservice',
      paymentCompleted: 'paymentcompleted',
      paymentCompletedSubject: 'We have been approved a pay',
      paymentCanceled: 'paymentcanceled',
      paymentCanceledSubject: 'We have been canceled a pay',
      workerDenied: 'workerdenied',
      workerDeniedSubject: 'We found a problem with your application',
      workerApproved: 'workerapproved',
      workerApprovedSubject: 'You have been approved',
    }
  }
};
