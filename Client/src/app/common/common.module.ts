import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Augutus
import { NavbarComponent } from './navbar/navbar.component';
import { CardLoadingSpinnerComponent } from './loading-spinner/card-loading-spinner.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        // Material
        MatToolbarModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],

    exports: [
        CardLoadingSpinnerComponent,
        NavbarComponent
    ],

    declarations: [
        CardLoadingSpinnerComponent,
        NavbarComponent
    ]
})
export class AugustusCommonModule {}