import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HealthService } from './health.service';
import { HealthPageComponent } from './health-page.component';

const routes = [
    { path: '', component: HealthPageComponent }
];

@NgModule({
    declarations: [HealthPageComponent],

    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ],

    providers: [HealthService]
})
export class HealthModule {}