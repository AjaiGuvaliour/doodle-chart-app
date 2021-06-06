import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './chart.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        ChartComponent
    ],
    imports: [
        CommonModule,
        ChartRoutingModule,
        FormsModule
    ]
})
export class ChartModule { }
