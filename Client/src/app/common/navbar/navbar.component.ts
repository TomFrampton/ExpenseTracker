import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'aug-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    // TODO - Should this be moved out of getter?
    get showItems() {
        const isDemo = environment && environment.isDemo;

        if (isDemo) {
            const demoInitialised = !!sessionStorage.getItem('DemoInitialised');

            if (!demoInitialised) {
                return false;
            }
        }

        return true;
    }
}