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
  @ViewChild("infactTableWrapper") infactTableWrapper: ElementRef;

  // 单位信息
  unit: any;
  // 编制/职数信息
  infact: any;
  // 获取单位编制/职数实有人员函数
  infactFunc: any;
  // 编制实有数人员列表
  personList: Array<Object> = [];
  isLoading = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public screenOrientation: ScreenOrientation,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.infact = this.navParams.get("infact");
    this.infactFunc = this.navParams.get("infactFunc");
    this.getUnitInfact();
  }

  // 获取单位编制的实有人数详情
  getUnitInfact() {
    this.babbUnitProvider[this.infactFunc](this.unit.unitOid, this.infact).then(res => {
      this.personList = res;
      this.isLoading = false;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  ionViewDidEnter() {
    $(this.infactTableWrapper.nativeElement).on('scroll', function (e) {
      if ($(this).parent().find('.clone-header').length) {
        $(this).parent().find('.clone-header').find('table').css({
          position: 'absolute',
          top: 0,
          left: -$(this)[0].scrollLeft
        });
      } else {
        if ($(this)[0].scrollTop) {
          $(this).clone().addClass('clone-header').css({
            position: 'absolute',
            top: 65,
            left: 15,
            width: $(this).outerWidth(),
            'overflow': 'hidden',
            height: $(this).find('table thead').height() + 1,
          }).appendTo($(this).parent());
        }
      }
    });
    //   // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        $(this.infactTableWrapper.nativeElement).parent().find('.clone-header').remove();
        $(this.infactTableWrapper.nativeElement).scrollTop(0);
      }
    );
  }
}
