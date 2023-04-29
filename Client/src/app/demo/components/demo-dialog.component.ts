import { animate, group, query, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemoService } from '@app/core/services/demo.service';

export const navigate = trigger('navigate', [
    // When going to previous page
    transition(':decrement', [
        // Get the element that has just been added to the DOM
        query(':enter', [
            // Initial state
            style({
                width: '100%',
                transform: 'translateX(-100%)',
            }),
            // Amimate slide right
            animate('300ms ease', style({
                opacity: 1,
                width: '100%',
                transform: 'translateX(0%)',
            }))
        ])
    ]),
    // When going to the next page
    transition(':increment', [
        query(':enter', [
            // Initial state
            style({
                width: '100%',
                transform: 'translateX(100%)',
            }),
            // Animate slide left
            animate('300ms ease', style({
                opacity: 1,
                transform: 'translateX(0%)',
            })),
        ])
    ])
]);

@Component({
    templateUrl: './demo-dialog.component.html',
    styleUrls: ['./demo-dialog.component.scss'],
    animations: [navigate],
})
export class DemoDialogComponent {
    private readonly PAGES = 4;

    page: number = 1;
    isLoading: boolean = false;

    get showStartDemoButton() {
        return this.page == this.PAGES;
    }

    get showNextButton() {
        return this.page < this.PAGES;
    }

    get isPreviousEnabled() {
        return !this.isLoading && this.page > 1;
    }

    get isNextEnabled() {
        return !this.isLoading;
    }

    get isStartDemoEnabled() {
        return !this.isLoading && this.page === this.PAGES;
    }

    get nextButtonText() {
        return this.page < this.PAGES ? 'Next' : 'Start Demo';
    }

    constructor(
        private dialogRef: MatDialogRef<DemoDialogComponent>,
        private snackBar: MatSnackBar,
        private demoService: DemoService) {}

    onPreviousClick() {
        if (this.page > 1) {
            this.page--;
        }
    }

    onNextClick() {
        if (this.page < this.PAGES) {
            this.page++;
        } else {
            this.startDemo();
        }
    }

    private startDemo() {
        this.isLoading = true;

        // Show dialog do this or should the container do it?
        this.demoService.start().subscribe(
            () => {
                sessionStorage.setItem("DemoInitialised", "true");
                this.dialogRef.close();
            },
            err => {
                this.snackBar.open('Error initialising demo', null, { duration: 2000 });
            });
    }
}