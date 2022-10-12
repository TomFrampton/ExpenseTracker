import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';

import {
    BaseUrlHttpInterceptor,
    CredentialsHttpInterceptor,
    DateHttpInterceptor,
    DemoUninitialisedHttpInterceptor
} from './interceptors';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BaseUrlHttpInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CredentialsHttpInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: DateHttpInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: DemoUninitialisedHttpInterceptor, multi: true }
    ]
})
export class CoreModule {}