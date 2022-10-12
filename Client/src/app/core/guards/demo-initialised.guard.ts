import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { DemoService } from '../services/demo.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DemoInitialisedGuard implements CanActivate {
    constructor(private demoService: DemoService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
        // If we are in demo mode then check it has been initialised, otherwise reroute to demo initialisation page
        const demoInitialised = sessionStorage.getItem('DemoInitialised');

        if (environment.isDemo) {
            if (!demoInitialised) {
                this.router.navigate(['/demo']);
                return false;
            }
        }

        return true;
    }
}