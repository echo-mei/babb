///<reference path="../../services/jquery.d.ts"/>
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";

@Component({
  selector: 'unit-dis-sy-leader-table',
  templateUrl: 'unit-dis-sy-leader-table.html',
})
export class UnitDisSyLeaderTablePage {

  syLeaderSum = {};
  syUnitLeaderCountList = [];
  syOrgLeaderCountList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    this.babbDisProvider.getLeaderSum(2).then(
      list => {this.syLeaderSum = list[0];}
    );
    this.babbDisProvider.getLeaderCountListByCondition(2, '010110').then(
      list => {this.syUnitLeaderCountList = list;}
    );
    this.babbDisProvider.getLeaderCountListByCondition(2, '010120').then(
      list => {this.syOrgLeaderCountList = list;}
    );
  }

  // ionViewDidEnter() {
  //   // $('#sy').on('scroll', function(e) {
  //   //   if($(this).parent().find('.clone-title').length) {
  //   //     $(this).parent().find('.clone-title').show().scrollTop($(this)[0].scrollTop);
  //   //     $(this).parent().find('.clone-title').css({
  //   //       top: $(this)[0].offsetTop - 2
  //   //     });
  //   //   }else {
  //   //     $(this).clone().addClass('clone-title').css({
  //   //       position: 'fixed',
  //   //       top: $(this)[0].offsetTop - 2,
  //   //       height: $(this).outerHeight(),
  //   //       left: 20,
  //   //       'overflow': 'hidden',
  //   //       width: $(this).find('tbody tr:eq(0) .table-title:eq(0)').outerWidth() + $(this).find('tbody tr:eq(0) .table-title:eq(1)').outerWidth() + 1,
  //   //     }).appendTo($(this).parent());
  //   //   }
  //   //   if($(this).parent().find('.clone-header').length) {
  //   //     $(this).parent().find('.clone-header').css({
  //   //       top: $(this)[0].offsetTop - 2
  //   //     });
  //   //     $(this).parent().find('.clone-header').show().find('table').css({
  //   //       position: 'absolute',
  //   //       top: 0,
  //   //       left: -$(this)[0].scrollLeft
  //   //     });
  //   //   }else {
  //   //     $(this).clone().addClass('clone-header').css({
  //   //       position: 'fixed',
  //   //       top: $(this)[0].offsetTop - 2,
  //   //       left: 20,
  //   //       width: $(this).outerWidth(),
  //   //       'overflow': 'hidden',
  //   //       height: $(this).find('table thead').height(),
  //   //     }).appendTo($(this).parent());
  //   //   }
  //   //   if(!$(this).parent().find('.displayer').length) {
  //   //     $('<div>').addClass('displayer').css({
  //   //       position: 'fixed',
  //   //       top: $(this)[0].offsetTop - 2,
  //   //       left: 20,
  //   //       width:  $(this).find('thead tr:eq(0) th:eq(0)').outerWidth(),
  //   //       height:  $(this).find('thead tr:eq(0) th:eq(0)').outerHeight(),
  //   //       background: '#F2F5FA',
  //   //       'border-bottom': '1px solid #B9CFF4'
  //   //     }).appendTo($(this).parent());
  //   //   }else {
  //   //     $(this).parent().find('.displayer').css({
  //   //       top: $(this)[0].offsetTop - 2
  //   //     });
  //   //   }
  //   // });
  //   $("#sy").on('scroll', function(e) {
  //     if($(this).parent().find('.clone-header').length) {
  //       $(this).parent().find('.clone-header').find('table').css({
  //         position: 'absolute',
  //         top: 0,
  //         left: -$(this)[0].scrollLeft
  //       });
  //     }else {
  //       $(this).clone().addClass('clone-header').css({
  //         position: 'absolute',
  //         top: 15,
  //         left: 15,
  //         width: $(this).outerWidth(),
  //         'overflow': 'hidden',
  //         height: $(this).find('table thead').height()+1,
  //       }).appendTo($(this).parent());
  //     }
  //   });
  // }

}
