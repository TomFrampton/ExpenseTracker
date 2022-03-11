import { Component } from "@angular/core";

@Component({
    selector: 'aug-card-loading-spinner',
    template: '<mat-spinner [diameter]="30"></mat-spinner>',
    styleUrls: ['./card-loading-spinner.component.scss']
})
export class CardLoadingSpinnerComponent {
}