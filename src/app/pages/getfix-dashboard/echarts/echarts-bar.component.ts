import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EChartsOption } from 'echarts';
import { UserService } from '../../../services/user.service';
import { WorkerService } from '../../../services/worker.service';
@Component({
  selector: 'ngx-echarts-bar-getfix',
  template: `
    <div echarts [options]="options" [merge]= "dynamicData" class="echart"></div>
  `,
})
export class GetfixEchartsBarComponent implements OnInit, AfterViewInit {
  options: EChartsOption = {};
  dynamicData: any = {};
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private _userService: UserService,
    private _workerService: WorkerService
  ) { }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.successLight, colors.primaryLight],
        legend: {
          data: ['Users', 'Workers'],
          align: 'left',
        },
        tooltip: {},
        xAxis: {
          data: ['Customers registers'],
          silent: false,
          splitLine: {
            show: false,
          },
        },
        yAxis: {},
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            // restore: { show: true },
            saveAsImage: { show: true },
          }
        },
        series: [
          {
            name: 'Users',
            type: 'bar',
            data: [1],
            barWidth: '30%',
            label: {
              show: true,
              rotate: 0,
              // align: app.config.align,
              // verticalAlign: app.config.verticalAlign,
              position: 'insideBottom',
              distance: 10,
              formatter: '{bold|{c}}',
              rich: {
                bold: {
                  fontWeight: 'bold'
                }
              }
            },
            animationDelay: (idx) => idx * 10,
          },
          {
            name: 'Workers',
            type: 'bar',
            data: [1],
            barWidth: '30%',
            label: {
              show: true,
              rotate: 0,
              // align: app.config.align,
              // verticalAlign: app.config.verticalAlign,
              position: 'insideBottom',
              distance: 10,
              formatter: '{bold|{c}}',
              rich: {
                bold: {
                  fontWeight: 'bold'
                }
              }
            },
            animationDelay: (idx) => idx * 10 + 100,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: (idx) => idx * 5,
      };
      this.dynamicData = Object.assign({}, this.options)
      this.dynamicData.series[0].data = [this._userService.users.length]
      this.dynamicData.series[1].data = [this._workerService.workers.length]
      this._userService.sendUsersObservable
        .subscribe(users => {
          this.dynamicData = Object.assign({}, this.options)
          this.dynamicData.series[0].data = [users.length]
        })
      this._workerService.sendWorkersObservable
        .subscribe(workers => {
          this.dynamicData = Object.assign({}, this.options)
          this.dynamicData.series[1].data = [workers.length]

        })

    });


  }


}
