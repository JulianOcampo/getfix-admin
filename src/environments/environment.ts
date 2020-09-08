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
    apiKey: "AIzaSyDIrtIe2W0Fssbmjxtg85e_YxO17C6PIpA",
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
  },
  uploadPath: {
    category: 'uploads/category_',
    brand: 'uploads/brand_',
    categoryBackup: 'backup/category_',
    brandBackup: 'backup/brand_',
  },
  firebaseFunctionApi: {
    url: 'https://us-central1-getfix24-e3383.cloudfunctions.net/api',
    saveCourseResult: '/saveCourseResult'
  },


};
