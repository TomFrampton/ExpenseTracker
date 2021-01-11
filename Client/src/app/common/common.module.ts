import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [NavbarComponent],

    declarations: [
        NavbarComponent
    ]
})
export class AugustusCommonModule {}