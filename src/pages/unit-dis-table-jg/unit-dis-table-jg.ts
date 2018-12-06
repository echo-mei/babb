import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-unit-dis-table-jg',
  templateUrl: 'unit-dis-table-jg.html',
})
export class UnitDisTableJgPage {
  @ViewChild("disTableJg") disTableJg: ElementRef;

  isLoading = true;
  dataList = [{
    name: '区直单位',
    unitList: []
  }, {
    name: '各街道',
    unitList: []
  }];

  allSum = {
    bzNum: 0,
    xzNum: 0,
    xzglNum: 0,
    xzzfNum: 0,
    zfNum: 0,
    infactNum: 0,
    freeNum: 0,
    ylNum: 0,
    kyNum: 0,
    gyyeNum: 0,
    unitzzldNum: 0,
    unitfzldNum: 0,
    orgFcjLdNum: 0,
    orgZkjLdNum: 0,
    orgFkjLdNum: 0
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public screenOrientation: ScreenOrientation,
    public babbUnitProvider: BabbUnitProvider) {
    this.babbUnitProvider.listJgUnitHc().then(list => {
      list.forEach((unit) => {
        if (unit.streeOffFlag == 'Y') {
          this.dataList[1].unitList.push(unit);
        } else {
          this.dataList[0].unitList.push(unit);
        }
      });
      let numb = 0;
      this.dataList.forEach((group) => {
        let sum = {
          unitName: `${group.name}小计`,
          bzNum: 0,
          xzNum: 0,
          xzglNum: 0,
          xzzfNum: 0,
          zfNum: 0,
          infactNum: 0,
          freeNum: 0,
          ylNum: 0,
          kyNum: 0,
          gyyeNum: 0,
          unitzzldNum: 0,
          unitfzldNum: 0,
          orgFcjLdNum: 0,
          orgZkjLdNum: 0,
          orgFkjLdNum: 0
        };
        group.unitList.forEach((unit) => {
          unit.numb = ++numb;
          sum.bzNum += unit.bzNum;
          sum.xzNum += unit.xzNum;
          sum.xzglNum += unit.xzglNum;
          sum.xzzfNum += unit.xzzfNum;
          sum.zfNum += unit.zfNum;
          sum.infactNum += unit.infactNum;
          sum.freeNum += unit.freeNum;
          sum.ylNum += unit.ylNum;
          sum.kyNum += unit.kyNum;
          sum.gyyeNum += unit.gyyeNum;
          sum.unitzzldNum += unit.unitzzldNum;
          sum.unitfzldNum += unit.unitfzldNum;
          sum.orgFcjLdNum += unit.orgFcjLdNum;
          sum.orgZkjLdNum += unit.orgZkjLdNum;
          sum.orgFkjLdNum += unit.orgFkjLdNum;

          this.allSum.bzNum += unit.bzNum;
          this.allSum.xzNum += unit.xzNum;
          this.allSum.xzglNum += unit.xzglNum;
          this.allSum.xzzfNum += unit.xzzfNum;
          this.allSum.zfNum += unit.zfNum;
          this.allSum.infactNum += unit.infactNum;
          this.allSum.freeNum += unit.freeNum;
          this.allSum.ylNum += unit.ylNum;
          this.allSum.kyNum += unit.kyNum;
          this.allSum.gyyeNum += unit.gyyeNum;
          this.allSum.unitzzldNum += unit.unitzzldNum;
          this.allSum.unitfzldNum += unit.unitfzldNum;
          this.allSum.orgFcjLdNum += unit.orgFcjLdNum;
          this.allSum.orgZkjLdNum += unit.orgZkjLdNum;
          this.allSum.orgFkjLdNum += unit.orgFkjLdNum;
        });
        group.unitList.push(sum);
        this.isLoading = false;
      });
    });
  }

  fixHead() {
    let obj = this.disTableJg.nativeElement;
    $(obj).clone().addClass('clone-header').css({
      position: 'absolute',
      top: 15,
      left: 15,
      width: $(obj).outerWidth(),
      'overflow': 'hidden',
      height: $(obj).find('table thead').height() + 1,
    }).appendTo($(obj).parent());
  }

  ionViewDidLoad() {
    setTimeout(() => {
      let obj = this.disTableJg.nativeElement;
      console.log("初次进来",obj.clientWidth,obj.clientHeight,obj.scrollHeight)
      if (obj.clientHeight < obj.scrollHeight) {
        this.fixHead();
      }
      $(obj).on('scroll', () => {
        if ($(obj).parent().find('.clone-header').length) {
          $(obj).parent().find('.clone-header').find('table').css({
            position: 'absolute',
            top: 0,
            left: -$(obj)[0].scrollLeft
          });
        }
      });

      this.screenOrientation.onChange().subscribe(
        () => {
          $(obj).parent().find('.clone-header').remove();
          $(obj).scrollTop(0).scrollLeft(0);
          console.log("旋转为"+this.screenOrientation.type,obj.clientWidth,obj.clientHeight,obj.scrollHeight)
          setTimeout(()=>{
            this.fixHead();
          },1000)
        }
      );
    }, 500)
    // $(this.disTableJg.nativeElement).on('scroll', function (e) {
    //   if ($(this).parent().find('.clone-header').length) {
    //     $(this).parent().find('.clone-header').find('table').css({
    //       position: 'absolute',
    //       top: 0,
    //       left: -$(this)[0].scrollLeft
    //     });
    //   }
    // });
    //   //   // detect orientation changes
    // this.screenOrientation.onChange().subscribe(
    //   () => {
    //     setTimeout(()=>{
    //       $(this.disTableJg.nativeElement).parent().find('.clone-header').remove();
    //     },1000)
    //   }
    // );
    // $(this.disTableJg.nativeElement).on('scroll', function(e) {
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
    //     $('<table><tr><th>单位类别</th></tr></table>').addClass('displayer').css({
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
  }

}
