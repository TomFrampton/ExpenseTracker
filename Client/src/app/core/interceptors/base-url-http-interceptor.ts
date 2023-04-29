import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export class BaseUrlHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiUrl = environment && environment.apiUrl;

        if (req.url.startsWith('./')) {
            req = req.clone({ url: apiUrl + req.url.slice(2) });
        }

        console.log(`BaseUrlHttpInterceptor: Using URL: ${req.url}`);

        return next.handle(req);
    }
}