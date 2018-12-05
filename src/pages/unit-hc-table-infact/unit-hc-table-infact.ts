///<reference path="../../services/jquery.d.ts"/>
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-unit-hc-table-infact',
  templateUrl: 'unit-hc-table-infact.html',
})
export class UnitHcTableInfactPage {
  @ViewChild("infactTableWrapper") infactTableWrapper:ElementRef;

  // 单位信息
  unit: any;
  // 编制信息
  hc: any;
  // 获取单位编制实有人员函数
  hcInfactFunc: any;
  // 编制实有数人员列表
  personList: Array<Object> = [];
  isLoading = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public screenOrientation: ScreenOrientation,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.hc = this.navParams.get("hc");
    this.hcInfactFunc = this.navParams.get("hcInfactFunc");
    this.getUnitHcInfact();
  }

  // 获取单位职数的实有人数详情
  getUnitHcInfact() {
    this.babbUnitProvider[this.hcInfactFunc](this.unit.unitOid, this.hc.hcOid).then(res => {
      this.personList = res;
      this.isLoading = false;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  ionViewDidEnter() {
    $(this.infactTableWrapper.nativeElement).on('scroll', function(e) {
      if($(this).parent().find('.clone-header').length) {
        $(this).parent().find('.clone-header').find('table').css({
          position: 'absolute',
          top: 0,
          left: -$(this)[0].scrollLeft
        });
      }else {
        $(this).clone().addClass('clone-header').css({
          position: 'absolute',
          top: 65,
          left: 15,
          width: $(this).outerWidth(),
          'overflow': 'hidden',
          height: $(this).find('table thead').height()+1,
        }).appendTo($(this).parent());
      }
    });
     //   // detect orientation changes
     this.screenOrientation.onChange().subscribe(
      () => {
        $(this.infactTableWrapper.nativeElement).parent().find('.clone-header').remove();
      }
    );
  }
}
