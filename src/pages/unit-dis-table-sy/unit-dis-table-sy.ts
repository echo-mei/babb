///<reference path="../../services/jquery.d.ts"/>
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-unit-dis-table-sy',
  templateUrl: 'unit-dis-table-sy.html',
})
export class UnitDisTableSyPage {
  @ViewChild("disTableSy") disTableSy: ElementRef;

  isLoading = true;
  dataList: any[] = [];

  jdAllSum = {
    unitSum: 0,
    sybzNum: 0,
    infactNum: 0,
    freeNum: 0,
    ylNum: 0,
    kyNum: 0,
    gyyeNum: 0,
    unit5Num: 0,
    unit6Num: 0,
    unit7Num: 0,
    unit8Num: 0,
    org7Num: 0,
    org8Num: 0
  };

  allSum = {
    unitSum: 0,
    sybzNum: 0,
    infactNum: 0,
    freeNum: 0,
    ylNum: 0,
    kyNum: 0,
    gyyeNum: 0,
    unit5Num: 0,
    unit6Num: 0,
    unit7Num: 0,
    unit8Num: 0,
    org7Num: 0,
    org8Num: 0
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public screenOrientation: ScreenOrientation,
    public babbUnitProvider: BabbUnitProvider) {
    this.babbUnitProvider.listSyUnitHc().then(list => {
      list.forEach((unit) => {
        let group = this.dataList.find((g) => {
          return g.adminUnitOid == unit.adminUnitOid;
        });
        if (!group) {
          group = {
            adminUnitOid: unit.adminUnitOid,
            adminUnitName: unit.adminUnitName,
            unitList: [],
            streeOffFlag: unit.streeOffFlag
          };
          this.dataList.push(group);
        }
        group.unitList.push(unit);
      });
      let numb = 0;
      this.dataList.forEach((group) => {
        let jdSum = {
          unitName: `${group.adminUnitName}下属${group.unitList.length}个事业单位小计`,
          sybzNum: 0,
          infactNum: 0,
          freeNum: 0,
          ylNum: 0,
          kyNum: 0,
          gyyeNum: 0,
          unit5Num: 0,
          unit6Num: 0,
          unit7Num: 0,
          unit8Num: 0,
          org7Num: 0,
          org8Num: 0
        };
        group.unitList.forEach((unit) => {
          unit.numb = ++numb;
          jdSum.sybzNum += unit.sybzNum;
          jdSum.infactNum += unit.infactNum;
          jdSum.freeNum += unit.freeNum;
          jdSum.ylNum += unit.ylNum;
          jdSum.kyNum += unit.kyNum;
          jdSum.gyyeNum += unit.gyyeNum;
          jdSum.unit5Num += unit.unit5Num;
          jdSum.unit6Num += unit.unit6Num;
          jdSum.unit7Num += unit.unit7Num;
          jdSum.unit8Num += unit.unit8Num;
          jdSum.org7Num += unit.org7Num;
          jdSum.org8Num += unit.org8Num;
          if (unit.streeOffFlag == 'Y') {
            this.jdAllSum.unitSum++;
            this.jdAllSum.sybzNum += unit.sybzNum;
            this.jdAllSum.infactNum += unit.infactNum;
            this.jdAllSum.freeNum += unit.freeNum;
            this.jdAllSum.ylNum += unit.ylNum;
            this.jdAllSum.kyNum += unit.kyNum;
            this.jdAllSum.gyyeNum += unit.gyyeNum;
            this.jdAllSum.unit5Num += unit.unit5Num;
            this.jdAllSum.unit6Num += unit.unit6Num;
            this.jdAllSum.unit7Num += unit.unit7Num;
            this.jdAllSum.unit8Num += unit.unit8Num;
            this.jdAllSum.org7Num += unit.org7Num;
            this.jdAllSum.org8Num += unit.org8Num;
          }
          this.allSum.unitSum++;
          this.allSum.sybzNum += unit.sybzNum;
          this.allSum.infactNum += unit.infactNum;
          this.allSum.freeNum += unit.freeNum;
          this.allSum.ylNum += unit.ylNum;
          this.allSum.kyNum += unit.kyNum;
          this.allSum.gyyeNum += unit.gyyeNum;
          this.allSum.unit5Num += unit.unit5Num;
          this.allSum.unit6Num += unit.unit6Num;
          this.allSum.unit7Num += unit.unit7Num;
          this.allSum.unit8Num += unit.unit8Num;
          this.allSum.org7Num += unit.org7Num;
          this.allSum.org8Num += unit.org8Num;
        });
        if (group.streeOffFlag == 'Y') {
          group.unitList.push(jdSum);
        }
      });
      this.isLoading = false;
    });
  }

  ionViewDidEnter() {
    // $('#disTableSy').on('scroll', function(e) {
    //   // 左侧
    //   if($(this).parent().find('.clone-title').length) {
    //     $(this).parent().find('.clone-title').show().scrollTop($(this)[0].scrollTop);
    //     $(this).parent().find('.clone-title').css({
    //       top: $(this)[0].offsetTop - 2,
    //       height: $(this).outerHeight(),
    //       width: $(this).find('tbody tr:eq(0) .table-title:eq(0)').outerWidth() + 1
    //     });
    //   }else {
    //     $(this).clone().addClass('clone-title').css({
    //       position: 'fixed',
    //       top: $(this)[0].offsetTop - 2,
    //       height: $(this).outerHeight(),
    //       left: 20,
    //       'overflow': 'hidden',
    //       width: $(this).find('tbody tr:eq(0) .table-title:eq(0)').outerWidth() + 1,
    //     }).appendTo($(this).parent());
    //   }
    //   // 头部
    //   if($(this).parent().find('.clone-header').length) {
    //     $(this).parent().find('.clone-header').show().css({
    //       width: $(this).outerWidth(),
    //       height: $(this).find('table thead').height()
    //     });
    //     $(this).parent().find('.clone-header').find('table').css({
    //       position: 'absolute',
    //       top: 0,
    //       left: -$(this)[0].scrollLeft
    //     });
    //   }else {
    //     $(this).clone().addClass('clone-header').css({
    //       position: 'fixed',
    //       top: $(this)[0].offsetTop - 2,
    //       left: 20,
    //       width: $(this).outerWidth(),
    //       'overflow': 'hidden',
    //       height: $(this).find('table thead').height(),
    //     }).appendTo($(this).parent());
    //   }
    //   // 左上角
    //   if($(this).parent().find('.displayer').length) {
    //     $(this).parent().find('.displayer').css({
    //       width:  $(this).find('thead tr:eq(0) th:eq(0)').outerWidth(),
    //       height:  $(this).find('thead tr:eq(0) th:eq(0)').outerHeight()
    //     });
    //   }else {
    //     $('<table><tr><th>主管部门</th></tr></table>').addClass('displayer').css({
    //       position: 'fixed',
    //       top: $(this)[0].offsetTop - 2,
    //       left: 20,
    //       width:  $(this).find('thead tr:eq(0) th:eq(0)').outerWidth(),
    //       height:  $(this).find('thead tr:eq(0) th:eq(0)').outerHeight(),
    //       background: '#F2F5FA',
    //       'border-bottom': '1px solid #B9CFF4',
    //       'font-size': '20px'
    //     }).appendTo($(this).parent());
    //   }
    // });
    $(this.disTableSy.nativeElement).on('scroll', function (e) {
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
            top: 15,
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
        $(this.disTableSy.nativeElement).parent().find('.clone-header').remove();
        $(this.disTableSy.nativeElement).scrollTop(0);
      }
    );
  }

}
