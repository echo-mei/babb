import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UnitZhSearchResultPage } from '../unit-zh-search-result/unit-zh-search-result';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';

@Component({
  selector: 'page-unit-zh-search',
  templateUrl: 'unit-zh-search.html',
})
export class UnitZhSearchPage {

  // 选择列表
  dataList = [
    { 'title': '系统类别', 'detail': [] },
    { 'title': '单位性质', 'detail': [] },
    { 'title': '机构级别', 'detail': [] },
    { 'title': '编制类别', 'detail': [] },
    { 'title': '经费形式', 'detail': [] },
    { 'title': '事业单位分类', 'detail': [] }
  ];
  key: any;
  smallNum: any;
  bigNum: any;
  list: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babb: BabbUnitProvider,
    public alertCtrl: AlertController
  ) {
    this.initData();
  }

  initData() {
    this.babb.getSyetem().then(res => {
      this.dataList[0].detail = res;
    })
    this.babb.getUnitXz().then(res => {
      this.dataList[1].detail = res;
    })
    this.babb.getJiGou().then(res => {
      let tempItem;
      res.forEach((item, index, list) => {
        if(item.LEVEL_CODE == 113) {
          tempItem = item;
          res.splice(index, 1);
        }
      });
      console.log(res);
      res.push(tempItem);      
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

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  getItem(detail) {
    detail.isSelected = !detail.isSelected;
  };

  getSearchList() {
    this.list = [];
    this.dataList.forEach((item) => {
      let search = [];
      item.detail.forEach((item1) => {
        if (item1.isSelected) {
          search.push(item1);
        }
      });
      this.list.push(search);
    })
    return this.list;
  }

  reset() {
    this.key = '';
    this.bigNum = '';
    this.smallNum = '';
    this.dataList.forEach((item) => {
      item.detail.forEach((item1) => {
        if (item1.isSelected) {
          item1.isSelected = !item1.isSelected;
        }
      });
    })
    this.list = [];
  }

  // 判断输入范围是否合法
  getSmallBig() {
    var regPos = /^\d+(\.\d+)?$/; 
    var a = this.smallNum;
    var b = this.bigNum;
    if(a == undefined || a == '' || a == null) {
    }else {
      if(a.indexOf('+') != -1 || a.indexOf('-') != -1) {
        this.smallNum = '';
        return false;
      };
      
      if(!regPos.test(a)) {
        this.smallNum = '';
        return false;
      };
    }
    if(b == undefined || b == '' || b == null) {
    }else {
      if(b.indexOf('+') != -1 || b.indexOf('-') != -1) {
        this.bigNum = '';
        return false;
      };
      
      if(!regPos.test(b)) {
        this.bigNum = '';
        return false;
      };
    }
    return true;
  }

  toResult() {
    if(!this.getSmallBig()) {
      const alert1 = this.alertCtrl.create({
        title: '提示',
        subTitle: '输入不合法，请输入正整数',
        buttons: ['确定']
      });
      alert1.present();
      return;
    }
    this.navCtrl.push(UnitZhSearchResultPage, {
      searchList: this.getSearchList(),
      waveList: this.dataList[3],
      key: this.key,
      smallNum: this.smallNum,
      bigNum: this.bigNum
    });
  }
}
