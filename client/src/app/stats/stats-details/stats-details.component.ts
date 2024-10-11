import { Component, computed, inject, input, model, ViewEncapsulation } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts, ThemeOption } from 'ngx-echarts';
import { ThemeService } from '../../shared/theme';
import { FeedbackPeriod } from '../stats.types';
import { pluckFeedbackMonthStats } from '../stats.utils';

// Note: the different chart colors are taken from:
//    https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors

@Component({
  selector: 'app-stats-details',
  host: { class: 'app-stats-details' },
  standalone: true,
  providers: [provideEcharts()],
  imports: [MatSliderModule, NgxEchartsDirective],
  templateUrl: './stats-details.component.html',
  styleUrl: './stats-details.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StatsDetailsComponent {
  detailsPlucked = input.required({ alias: 'details', transform: pluckFeedbackMonthStats });

  period = input.required<FeedbackPeriod>();

  length = input.required<number>();

  start = model.required<number>();

  end = model.required<number>();

  private theme = inject(ThemeService).theme;

  protected chartTheme = computed((): ThemeOption | string | null => (this.theme() === 'dark' ? 'dark' : null));

  protected usersOverviewChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'All',
          data: plucked.uniqueUsers,
          type: 'line',
          color: '#80DEEA', // Cyan
        },
        {
          name: 'Givers or receivers',
          data: plucked.uniqueGiversOrReceivers,
          type: 'bar',
          color: '#BA68C8', // Purple
        },
        {
          name: 'Requesters',
          data: plucked.uniqueRequesters,
          type: 'bar',
          color: '#FFA72680', // Orange 80%
        },
      ],
    };
  });

  protected giversAndReceiversChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Givers or receivers',
          data: plucked.uniqueGiversOrReceivers,
          type: 'line',
          color: '#BA68C8', // Purple
        },
        {
          name: 'Givers',
          data: plucked.uniqueGivers,
          type: 'bar',
          color: '#64B5F6', // Blue
        },
        {
          name: 'Receivers',
          data: plucked.uniqueReceivers,
          type: 'bar',
          color: '#F06292', // Pink
        },
      ],
    };
  });

  protected feedbacksChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Spontaneous',
          data: plucked.spontaneousFeedback,
          type: 'bar',
          stack: 'counts',
          color: '#81C784', // Green
        },
        {
          name: 'Replied',
          data: plucked.requestedFeedbackDone,
          type: 'bar',
          stack: 'counts',
          color: '#FFA726', // Orange
        },
        {
          name: 'Requested',
          data: plucked.requestedFeedbackPending,
          type: 'bar',
          stack: 'counts',
          color: '#FFA72685', // Orange 80%
        },
      ],
    };
  });
}
