import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DemoService } from 'src/app/core/services/demo.service';

@Component({
    selector: 'aug-demo-page',
    template: `
        <h2>Welcome to Demo</h2>
        <button (click)="onStartDemoClick()">Click to Start</button>
    `
})
export class DemoPageComponent {
    constructor(private demoService: DemoService, private router: Router, private snackBar: MatSnackBar) {}

    onStartDemoClick() {
        this.demoService.start().subscribe(
            () => {
                sessionStorage.setItem("DemoInitialised", "true");
                this.router.navigate(['./transactions']);
            },
            err => {
                this.snackBar.open('Error initialising demo', null, { duration: 2000 });
            });
    }
}