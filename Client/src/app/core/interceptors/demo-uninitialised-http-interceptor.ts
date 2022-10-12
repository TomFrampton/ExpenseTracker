import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
  export class DemoUninitialisedHttpInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
            // When there is no error nothing to do
        },
        err => {
          if (err.status === 475) {
            return this.router.navigate(['./demo']);
          }

          console.error(err.error);
        }));
    }
}