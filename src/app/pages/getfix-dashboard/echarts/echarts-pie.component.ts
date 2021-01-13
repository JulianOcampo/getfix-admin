import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EChartsOption } from 'echarts';
import { environment } from '../../../../environments/environment';
import { WorkerService } from '../../../services/worker.service';
import { Worker } from '../../../models/worker'
@Component({
  selector: 'ngx-echarts-pie-getfix',
  template: `
    <div echarts [options]="options" [merge]= "dynamicData" class="echart"></div>
  `,
})
export class GetfixEchartsPieComponent implements AfterViewInit, OnDestroy {
  options: EChartsOption = {};
  dynamicData: any = {};
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private _workerService: WorkerService

  ) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;


      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          data: ['Available', 'Busy', 'In Service', 'Blocked', 'Denied', 'Pending'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: false, type: ['line', 'bar', 'stack'] },
            // restore: { show: true },
            saveAsImage: { show: true },
          }
        },
        series: [
          {
            name: 'Worker states',
            type: 'pie',
            radius: '45%',
            center: ['50%', '50%'],
            data: [
              { value: 1, name: 'Available' },
              { value: 1, name: 'Busy' },
              { value: 1, name: 'In Service' },
              { value: 1, name: 'Blocked' },
              { value: 1, name: 'Denied' },
              { value: 1, name: 'Pending' },
            ],
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor,

            },
            label: {
              color: echarts.textColor,
              formatter: '{b}: {bold|{c}} ({d}%)',
              rich: {
                bold: {
                  fontWeight: 'bold'
                }
              }

            },
            labelLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              }
            },
          },
        ],
      };

      this.setWorkers(this._workerService.workers)

      this._workerService.sendWorkersObservable
        .subscribe(workers => {
          this.setWorkers(workers)
        })

    });
  }

  setWorkers(workers: Worker[]) {
    this.dynamicData = Object.assign({}, this.options)
    let available = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.available))
    let busy = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.busy))
    let inService = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.inService))
    let blocked = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.blocked))
    let denyByAdmin = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.denyByAdmin))
    let pendingRequestToWork = workers.filter(worker => (worker.workerStatus == environment.constants.workerStates.pendingRequestToWork))
    this.dynamicData.series[0].data = []
    this.dynamicData.series[0].data =
      [{
        value: available.length,
        name: 'Available'
      },
      {
        value: busy.length,
        name: 'Busy'
      },
      {
        value: inService.length,
        name: 'In Service'
      },
      {
        value: blocked.length,
        name: 'Blocked'
      },
      {
        value: denyByAdmin.length,
        name: 'Denied'
      },
      {
        value: pendingRequestToWork.length,
        name: 'Pending'
      },]
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
