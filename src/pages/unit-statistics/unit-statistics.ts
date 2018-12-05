import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as echarts from 'echarts';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';

@Component({
  selector: 'page-unit-statistics',
  templateUrl: 'unit-statistics.html',
})
export class UnitStatisticsPage {

  categoryList: any[];

  constructor(
    protected navCtrl: NavController,
    protected navParams: NavParams,
    protected babbUnitProvider: BabbUnitProvider
  ) {
  }

  ionViewDidLoad() {
    this.gUnitChart();
    this.getUnitByKindAndCategory();
    this.getSyUnitsByLevel();
    this.getSyUnitsByBudget();
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  gUnitChart() {
    this.babbUnitProvider.statisticsUnitByKind().then(res => {
      let data = [];
      let sumCount = 0;
      res.forEach((item) => {
        const d = {
          name: item.unitKindName,
          value: item.infactCount
        };
        data.push(d);
        sumCount += item.infactCount;
      });
      data.unshift({
        name: '总计',
        value: sumCount,
      });
      var unitChart = echarts.init(document.getElementById('unit'));
      var option = {
        legend: {
          orient: 'vertical',
          right: '20%',
          top: 'center',
          selectedMode: false,
          itemHeight: 20,
          itemWidth: 32,
          textStyle: {
            fontSize: 23.2
          },
          selected: {
            '总计': false
          },
          formatter: function(name) {
            let str = name;
            str += '   ';
            str += data.find((d) => {
              return d.name == name;
            }).value;
            return str;
          }
        },
        series: [{
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['50%', '80%'],
          avoidLabelOverlap: true,
          legendHoverLink: true,
          label: {
            show: true,
            formatter: '{d}%'
          },
          data: data
        }]
      };
      unitChart.setOption(option);
    });
  }

  getUnitByKindAndCategory() {
    this.babbUnitProvider.statisticsUnitByKindAndCategory().then(res => {
      this.categoryList = res;
    });
  }

  getSyUnitsByLevel() {
    this.babbUnitProvider.statisticsSyUnitByLevel().then(res => {
      // 将"未定级"移到最后
      let first = res.shift();
      res.push(first);

      let data = [];
      let sumCount = 0;
      res.forEach((item) => {
        const d = {
          name: item.levelName,
          value: item.infactCount
        };
        data.push(d);
        sumCount += item.infactCount;
      });
      data.unshift({
        name: '事业单位数总计',
        value: sumCount,
      });
      var unitChart = echarts.init(document.getElementById('sy-unit-level'));
      var option = {
        legend: {
          orient: 'vertical',
          right: '20%',
          top: 'center',
          selectedMode: false,
          itemHeight: 20,
          itemWidth: 32,
          textStyle: {
            fontSize: 23.2
          },
          selected: {
            '事业单位数总计': false
          },
          formatter: function(name) {
            let str = name;
            str += '   ';
            str += data.find((d) => {
              return d.name == name;
            }).value;
            return str;
          }
        },
        series: [{
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['50%', '80%'],
          avoidLabelOverlap: true,
          legendHoverLink: true,
          label: {
            show: true,
            formatter: '{d}%'
          },
          data: data
        }]
      };
      unitChart.setOption(option);
    });
  }

  getSyUnitsByBudget() {
    this.babbUnitProvider.statisticsSyUnitBudget().then(res => {
      let data = [];
      let sumCount = 0;
      res.forEach((item) => {
        const d = {
          name: item.budgetFromName,
          value: item.infactCount
        };
        data.push(d);
        sumCount += item.infactCount;
      });
      data.unshift({
        name: '事业单位数总计',
        value: sumCount,
      });
      var unitChart = echarts.init(document.getElementById('sy-unit-budget'));
      var option = {
        legend: {
          orient: 'vertical',
          right: '20%',
          top: 'center',
          selectedMode: false,
          itemHeight: 20,
          itemWidth: 32,
          textStyle: {
            fontSize: 23.2
          },
          selected: {
            '事业单位数总计': false
          },
          formatter: function(name) {
            let str = name;
            str += '   ';
            str += data.find((d) => {
              return d.name == name;
            }).value;
            return str;
          }
        },
        series: [{
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['50%', '80%'],
          avoidLabelOverlap: true,
          legendHoverLink: true,
          label: {
            show: true,
            formatter: '{d}%'
          },
          data: data
        }]
      };
      unitChart.setOption(option);
    });
  }

}
