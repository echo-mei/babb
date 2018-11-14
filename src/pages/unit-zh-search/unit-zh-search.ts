import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UnitZhSearchResultPage } from '../unit-zh-search-result/unit-zh-search-result';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';

@Component({
  selector: 'page-unit-zh-search',
  templateUrl: 'unit-zh-search.html',
})
export class UnitZhSearchPage {

  // 页面数据
  dataList = [];
  searchList = [];

  key: any;
  smallNum: any;
  bigNum: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babb: BabbUnitProvider
  ) {
    this.initData();
  }

  initData() {
    this.dataList = [
      {
        'title': '系统类别',
        'detail': []
      },
      {
        'title': '单位性质',
        'detail': []
      },
      {
        'title': '机构类别',
        'detail': []
      },
      {
        'title': '编制类别',
        'detail': []
      },
      {
        'title': '经费形式',
        'detail': []
      },
      {
        'title': '事业单位分类',
        'detail': []
      }
    ];
    this.babb.getSyetem().then(res => {
      this.dataList[0].detail = res;
    })
    this.babb.getUnitXz().then(res => {
      this.dataList[1].detail = res;
    })
    this.babb.getJiGou().then(res => {
      this.dataList[2].detail = res;
    })
    this.babb.getWave().then(res => {
      this.dataList[3].detail = res;
    })
    this.babb.getFeeStyle().then(res => {
      this.dataList[4].detail = res;
    })
    this.babb.getWorkUnit().then(res => {
      this.dataList[5].detail = res;
    })
  }

  getItem(detail, indexF, index) {
    detail.isSelected = !detail.isSelected;
    // if(this.searchList.indexOf(detail) == -1){
    //   this.searchList.push(detail);
    // }else {
    //   if(this.searchList.indexOf(detail) > -1) {
    //     this.searchList.splice(this.searchList.indexOf(detail), 1);
    //   }
    // }
    // console.log(this.searchList)

    // this.searchList.forEach((item, index, list)=>{
    //   if(item.UNIT_TYPE_BIZ_CODE) {
    //     console.log(item, 1)
    //   }
    // })
  };
  getSearchList() {
    // dataList
    let list = [[], [], [], [], [], []];
    this.dataList.forEach((item, index) => {
      item.detail.forEach((item1) => {
        if (item1.isSelected) {
          list[index].push(item1);
        }
      })
    })
    return list;
  }
  toResult() {
    this.navCtrl.push(UnitZhSearchResultPage, {
      searchList: this.getSearchList(),
      waveList: this.dataList[3],
      key: this.key,
      smallNum: this.smallNum,
      bigNum: this.bigNum
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
