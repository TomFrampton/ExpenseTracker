import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export class BaseUrlHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const baseUrl = environment && environment.baseUrl;

        if (req.url.startsWith('./')) {
            req = req.clone({ url: baseUrl + req.url.slice(2) });
        }

        console.log(`BaseUrlHttpInterceptor: Using URL: ${req.url}`);

        return next.handle(req);
    }
}