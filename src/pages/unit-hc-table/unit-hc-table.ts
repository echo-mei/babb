import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitHcTableInfactPage } from '../unit-hc-table-infact/unit-hc-table-infact';
import { UnitHcTableFrzPage } from '../unit-hc-table-frz/unit-hc-table-frz';
import { BabbHcProvider } from '../../providers/babb-hc/babb-hc';


@Component({
  selector: 'page-unit-hc-table',
  templateUrl: 'unit-hc-table.html',
})
export class UnitHcTablePage {
  @ViewChild('hcTableWrap') hcTableWrap: ElementRef;

  // 单位信息
  unit: any;
  // 获取编制表名称
  name: any;
  // 获取单位编制函数
  hcFunc: any;
  // 获取单位编制实有数具体人员函数
  hcInfactFunc: any;
  // 获取单位编制冻结数具体人员函数
  hcFrzFunc: any;
  // 编制列表
  hcList: Array<Object> = [];
  isLoading = true;
  aviodSuperHcFlag = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
    public babbHcProvider: BabbHcProvider,
    public appCtrl: App) {
    this.unit = this.navParams.get("unit");
    this.name = this.navParams.get("name");
    this.hcFunc = this.navParams.get("hcFunc");
    this.hcInfactFunc = this.navParams.get("hcInfactFunc");
    this.hcFrzFunc = this.navParams.get("hcFrzFunc");
    this.getUnitHc();
  }

  // 获取单位的编制
  getUnitHc() {
    this.babbUnitProvider[this.hcFunc](this.unit.unitOid).then(res => {
      this.hcList = this.babbHcProvider.sort(res);
      this.isLoading = false;
    });
  }

  // 点击实有数详情
  onClickInfact(hc) {
    this.appCtrl.getRootNav().push(UnitHcTableInfactPage, {
      unit: this.unit,
      infact: hc,
      infactFunc: this.hcInfactFunc
    })
  }

  // 点击冻结数详情
  onClickFrz(hc) {
    this.appCtrl.getRootNav().push(UnitHcTableFrzPage, {
      unit: this.unit,
      hc: hc,
      hcFrzFunc: this.hcFrzFunc
    })
  }

  // 是否禁止滑动切换tab页
  aviodSuperJudge(wrap) {
    return (wrap.clientWidth < wrap.scrollWidth) ? (wrap.clientWidth < wrap.scrollWidth) : null;
  }

  ionViewDidEnter() {
    $(this.hcTableWrap.nativeElement).on('scroll', function (e) {
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
