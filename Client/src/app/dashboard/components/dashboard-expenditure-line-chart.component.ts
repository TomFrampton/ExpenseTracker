import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

export interface DashboardExpenditureLineChartData {
    firstMonth: {
        month: number,
        year: number
    },
    series: {
        name: string,
        data: number[]
    }[]
}

@Component({
    selector: 'app-dashboard-expenditure-line-chart',
    templateUrl: './dashboard-expenditure-line-chart.component.html'
})
export class DashboardExpenditureLineChartComponent implements OnChanges {
    @Input() data: DashboardExpenditureLineChartData;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue) {
            const data = changes.data.currentValue as DashboardExpenditureLineChartData;

            Highcharts.chart('chart', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                  text: null
                },
                yAxis: {
                  title: {
                    text: 'Expenditure (£)'
                  }
                },
                xAxis: {
                    type: 'datetime'
                },
                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
                },
                plotOptions: {
                  series: {
                    label: {
                      connectorAllowed: false
                    },
                    pointStart: Date.UTC(data.firstMonth.year, data.firstMonth.month, 1),
                    pointIntervalUnit: 'month',
                    pointInterval: 1
                  }
                },
                series: data.series.map(serie => ({
                    ...serie,
                    type: 'line'
                })),
                responsive: {
                  rules: [{
                    condition: {
                      maxWidth: 500
                    },
                    chartOptions: {
                      legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                      }
                    }
                  }]
                }
              });
            }
        }
    }