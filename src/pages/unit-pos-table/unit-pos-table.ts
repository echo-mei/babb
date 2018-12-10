import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitHcTableInfactPage } from '../unit-hc-table-infact/unit-hc-table-infact';

/**
 * Generated class for the UnitPosTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-unit-pos-table',
  templateUrl: 'unit-pos-table.html',
})
export class UnitPosTablePage {
  @ViewChild('posTableWrap') posTableWrap: ElementRef;

  // 单位信息
  unit: any;
  // 获取职数表名称
  name: any;
  // 获取单位职数函数
  leaderFunc: any;
  // 职数实有人数反查函数
  leaderInfactFunc: any;
  // 职数列表
  leaderList: Array<Object> = [];
  isLoading = true;
  aviodSuperHcFlag = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
    public appCtrl: App) {
    this.unit = this.navParams.get("unit");
    this.name = this.navParams.get("name");
    this.leaderFunc = this.navParams.get("leaderFunc");
    this.leaderInfactFunc = this.navParams.get("leaderInfactFunc");
    this.getUnitLeader();
  }

  // 获取领导职数表
  getUnitLeader() {
    this.babbUnitProvider[this.leaderFunc](this.unit.unitOid).then(res => {
      this.leaderList = res;
      this.isLoading = false;
    });
  }

  // 获取单位领导职数、内下设领导职数各多少个，总共在页面占几列
  getCol(str) {
    let attr = this.leaderList.filter(item => item["dutyAttribute"] == str);
    return attr.length;
  }

  aviodSuperJudge(wrap) {
    return (wrap.clientWidth < wrap.scrollWidth) ? (wrap.clientWidth < wrap.scrollWidth) : null;
  }

  onClickInfact(leader) {
    this.appCtrl.getRootNav().push(UnitHcTableInfactPage, {
      unit: this.unit,
      infact: leader,
      infactFunc: this.leaderInfactFunc
    })
  }

  ionViewDidEnter() {
    $(this.posTableWrap.nativeElement).on('scroll', function (e) {
      // 冻结列
      if ($(this).parent().find('.clone-title').length) {

      } else {
        if ($(this)[0].scrollTop) {
          $(this).clone().addClass('clone-title').css({
            background: '#fff',
            position: 'fixed',
            top: $(this)[0].offsetTop,
            height: $(this).outerHeight(),
            left: 20,
            'overflow': 'hidden',
            width: $(this).find('thead tr:eq(0) .table-title:eq(0)').outerWidth() + 1,
          }).appendTo($(this).parent());
        }
      }
    });
  }


}
