import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


/**
 * By default all of the date properties that come back from the API are not actually
 * Date objects, they are ISO 8601 date strings e.g. Mon Nov 30 2020 09:33:11 GMT+0000.
 * This interceptor edits the API responses and parses the strings into actual Date objects.
 */
@Injectable({
  providedIn: 'root'
})
export class DateHttpInterceptor implements HttpInterceptor {
  iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          this.convertToDate(body);
        }
      },
      err => {
        console.error(err.error);
      }));
  }

  convertToDate(body) {
    if (body === null || body === undefined || typeof body !== 'object') {
      return body;
    }

    // If the body is a valid object then loop through it's properties...
    for (const key of Object.keys(body)) {
      const value = body[key];

      if (this.isIso8601(value)) {
        // If the property value is a valid ISO 8601 date string then parse it to a JS Date object
        body[key] = new Date(value);
      } else if (typeof value === 'object') {
        // If the property value is itself an object then recurse
        this.convertToDate(value);
      }
    }
  }

  /**
   * Determines whether or not the value passed is an ISO 8601 date string e.g. Mon Nov 30 2020 09:33:11 GMT+0000.
   *
   * @param value The value to test.
   */
  isIso8601(value) {
    if (value === null || value === undefined) {
      return false;
    }

    return this.iso8601.test(value);
  }
}
