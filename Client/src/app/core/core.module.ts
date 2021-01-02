import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BaseUrlHttpInterceptor } from './http/base-url-http-interceptor';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BaseUrlHttpInterceptor, multi: true }
    ]
})
export class CoreModule {}