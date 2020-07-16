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
    apiKey: "AIzaSyBtfwYU2d7Oqt6UkVa95CdqqY5Eyi5uIW8",
    authDomain: "firstproyect-911a0.firebaseapp.com",
    databaseURL: "https://firstproyect-911a0.firebaseio.com",
    projectId: "firstproyect-911a0",
    storageBucket: "firstproyect-911a0.appspot.com",
    messagingSenderId: "512789171538",
    appId: "1:512789171538:web:d25215e5c6c03c4a307e8b"
  },
  firebaseRef: {
    category: '/Categories',
    brand: '/Brands',
  },
  uploadPath:{
    category: 'uploads/category_',
    brand: 'uploads/brand_',
    categoryBackup:'backup/category_',
    brandBackup:'backup/brand_',
  }

};
