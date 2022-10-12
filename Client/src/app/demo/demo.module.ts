import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AugustusCommonModule } from '@aug/common/common.module';

import { DemoPageComponent } from './containers';

const routes: Routes = [
    { path: 'demo', component: DemoPageComponent, children: [] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        AugustusCommonModule
    ],
    declarations: [
        // Containers
        DemoPageComponent,

        // Components
    ]
})
export class DemoModule {}