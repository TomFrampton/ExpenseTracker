import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

// Expense Tracker
import { NavbarComponent } from './navbar/navbar.component';
import { CardLoadingSpinnerComponent } from './loading-spinner/card-loading-spinner.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        // Material
        MatToolbarModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDividerModule
    ],

    exports: [
        // Material
        MatCardModule,
        MatDividerModule,
        MatButtonModule,
        MatProgressSpinnerModule,

        NavbarComponent,
        CardLoadingSpinnerComponent
    ],

    declarations: [
        CardLoadingSpinnerComponent,
        NavbarComponent
    ]
})
export class ExpensesCommonModule {}