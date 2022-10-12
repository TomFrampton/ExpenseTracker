import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export class CredentialsHttpInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment && environment.isDemo) {
            req = req.clone({ withCredentials: true });
        }

        return next.handle(req);
    }
}