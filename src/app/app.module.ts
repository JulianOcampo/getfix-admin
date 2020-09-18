/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule as ngFormsModule, ReactiveFormsModule as ngReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

//firebase
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { NbFirebasePasswordStrategy, NbFirebaseAuthModule } from '@nebular/firebase-auth'
import { NbAuthModule } from '@nebular/auth';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ngFormsModule,
    ngReactiveFormsModule,
    ColorPickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NbFirebaseAuthModule,
    NbAuthModule.forRoot({
      strategies: [
        NbFirebasePasswordStrategy.setup({
          name: 'password',
          login: {
            redirect: {
              success: 'pages/get-fix-menu/categories',
            },
            // defaultMessages:['Login Successfully!'],
          },
          register: {
            redirect: {
              success: 'pages/get-fix-menu/categories',
            },
          },
          logout: {
            redirect: {
              success: 'auth/login',
            },
          },
          requestPassword: {
            redirect: {
              success: 'auth/request-password',
            },
          },
          resetPassword: {
            redirect: {
              success: 'auth/request-password',
            },
          },
        }),
      ],
      forms: {
        login: {
          strategy: 'password',
          rememberMe: true,
          socialLinks: [],

        },
        register: {
          strategy: 'password',
          terms: true,
          socialLinks: [],
        },
        logout: {
          strategy: 'password',
        },
        requestPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        resetPassword: {
          strategy: 'password',
          socialLinks: [],
        },
        validation: {
          password: {
            required: true,
            minLength: 5,
            maxLength: 50,
          },
          email: {
            required: true,
          },
          fullName: {
            required: false,
            minLength: 4,
            maxLength: 50,
          },
        },

      }
    })

  ],
  providers: [
    { provide: SETTINGS, useValue: {} },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
