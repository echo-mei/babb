import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-unit-hc-table-frz',
  templateUrl: 'unit-hc-table-frz.html',
})
export class UnitHcTableFrzPage {
  @ViewChild("frzTableWrapper") frzTableWrapper:ElementRef;

  // 单位信息
  unit: any;
  // 编制信息
  hc: any;
  // 获取单位编制实有人员函数
  hcFrzFunc: any;
  // 编制实有数人员列表
  personList: Array<Object> = [];
  isLoading=true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public screenOrientation: ScreenOrientation,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.hc = this.navParams.get("hc");
    this.hcFrzFunc = this.navParams.get("hcFrzFunc");
    this.getUnitHcFrz();
  }

  // 获取单位职数的冻结人数详情
  getUnitHcFrz() {
    this.babbUnitProvider[this.hcFrzFunc](this.unit.unitOid,this.hc.hcOid).then(res => {
      this.personList = res;
      this.isLoading = false;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  ionViewDidEnter() {
    $(this.frzTableWrapper.nativeElement).on('scroll', function(e) {
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
        $(this.frzTableWrapper.nativeElement).parent().find('.clone-header').remove();
      }
    );
  }
}
