import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

// Augutus
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        // Material
        MatToolbarModule,
        MatButtonModule
    ],

    exports: [NavbarComponent],

    declarations: [
        NavbarComponent
    ]
})
export class AugustusCommonModule {}