///<reference path="../../services/jquery.d.ts"/>
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";
import { DomSanitizer } from '@angular/platform-browser';
import { BabbHcProvider } from '../../providers/babb-hc/babb-hc';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-unit-dis-table',
  templateUrl: 'unit-dis-table.html',
})
export class UnitDisTablePage {
  @ViewChild("disTable") disTable: ElementRef;

  // 数据列表
  dataList: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babbDisProvider: BabbDisProvider,
    public babbHcProvider: BabbHcProvider,
    public screenOrientation: ScreenOrientation,
    public domSanitizer: DomSanitizer
  ) {
    this.babbDisProvider.getHcTable().then(res => {
      this.dataList = this.babbHcProvider.sort(res);
    });
  }

  ionViewDidEnter() {
    // $('#wrapper').on('scroll', function(e) {
    //   // 左侧
    //   if($(this).parent().find('.clone-title').length) {
    //     $(this).parent().find('.clone-title').show().scrollTop($(this)[0].scrollTop);
    //     $(this).parent().find('.clone-title').css({
    //       top: $(this)[0].offsetTop - 2,
    //       height: $(this).outerHeight(),
    //       width: $(this).find('tbody tr:eq(0) .table-title:eq(0)').outerWidth() + $(this).find('tbody tr:eq(0) .table-title:eq(1)').outerWidth() + 1
    //     });
    //   }else {
    //     $(this).clone().addClass('clone-title').css({
    //       position: 'fixed',
    //       top: $(this)[0].offsetTop - 2,
    //       height: $(this).outerHeight(),
    //       left: 20,
    //       'overflow': 'hidden',
    //       width: $(this).find('tbody tr:eq(0) .table-title:eq(0)').outerWidth() + $(this).find('tbody tr:eq(0) .table-title:eq(1)').outerWidth() + 1,
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
    //     $('<div>').addClass('displayer').css({
    //       position: 'fixed',
    //       top: $(this)[0].offsetTop - 2,
    //       left: 20,
    //       width:  $(this).find('thead tr:eq(0) th:eq(0)').outerWidth(),
    //       height:  $(this).find('thead tr:eq(0) th:eq(0)').outerHeight(),
    //       background: '#F2F5FA',
    //       'border-bottom': '1px solid #B9CFF4'
    //     }).appendTo($(this).parent());
    //   }
    // });
    $(this.disTable.nativeElement).on('scroll', function (e) {
      if ($(this).parent().find('.clone-header').length) {
        $(this).parent().find('.clone-header').find('table').css({
          position: 'absolute',
          top: 0,
          left: -$(this)[0].scrollLeft
        });
      } else {
        if($(this)[0].scrollTop) {
          $(this).clone().addClass('clone-header').css({
            position: 'absolute',
            top: 15,
            left: 15,
            width: $(this).outerWidth(),
            'overflow-y': 'hidden',
            height: $(this).find('table thead').height() + 1,
          }).appendTo($(this).parent());
        }
      }
    });
    //   // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        $(this.disTable.nativeElement).parent().find('.clone-header').remove();
        $(this.disTable.nativeElement).scrollTop(0);
      }
    );
  }

}
