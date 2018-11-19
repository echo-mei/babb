///<reference path="../../services/jquery.d.ts"/>
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { TreeProvider } from '../../providers/tree/tree';

@Component({
  selector: 'page-gw-set',
  templateUrl: 'gw-set.html',
})
export class GwSetPage {

  unit: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
    public treeProvider: TreeProvider
  ) {
    this.unit = this.navParams.get('unit');
  }

  ionViewDidLoad() {
    let promise = new Promise((resolve, reject) => {
      this.babbUnitProvider.getGwList(this.unit.unitOid).then(
        gwList => {
          if(!gwList) resolve(gwList);
          gwList.forEach((item, index) => {
            this.babbUnitProvider.getGwDetailList(item.unitGwOid).then(
              gwDetailList => {
                let sum;
                item.gwDetailList = gwDetailList;
                gwDetailList && gwDetailList.forEach((r) => {
                  sum || (sum = 0);
                  sum += r.curCount;
                });
                item.sumCount = sum;
                if(index==gwList.length-1) {
                  resolve(gwList);
                }
              }
            ).catch(
              e => {
                reject(e);
              }
            );
          });
        }
      ).catch(
        e => {
          reject(e);
        }
      );
    });
    promise.then(
      (res: any[]) => {
        let root = res.find((item) => {
          return item.orgType == 0;
        });
        res.forEach((item) => {
          if(!item.parentOrgOid&&item.orgType!=0) {
            item.parentOrgOid = root.orgOid;
          }
        });
        let data = this.treeProvider.buildTree(res, {
          id: 'orgOid',
          parentId: 'parentOrgOid',
          children: 'children'
        });
        function reBuild(node) {
          let children = node.children;
          if(children&&children.length) {
            let n = {
              orgName: '内设机构',
              children: []
            };
            let x = {
              orgName: '下设机构',
              children: []
            };
            children.forEach((c) => {
              if(c.orgType==1) {
                n.children.push(c);
              }
              if(c.orgType==2) {
                x.children.push(c);
              }
              reBuild(c);
            });
            node.children = [n, x];
          }
        }
        reBuild(data[0]);
        var orgtree = new Orgtree({
          width: 1000,
          height: 500,
          direction: 't2b',
          scalable: false,
          canMove: false,
          canAddNode: false,
          editable: false,
          showContent: true,
          showContentEvent: 'click',
          renderTitle: function(nodeData) {
            return '<span>'+nodeData.orgName+'</span><span>'+(nodeData.sumCount ? nodeData.sumCount : '')+'</span>';
          },
          renderContent: function(nodeData) {
            var r = '<table>';
            nodeData.gwDetailList&&nodeData.gwDetailList.forEach(function(detail) {
              r +=
                '<tr>'+
                      '<td>'+detail.gwName+'</td>'+
                      '<td>'+detail.curCount+'</td>'+
                  '</tr>';
            });
            r += '</table>';
            return r;
          },
          data: data[0]
        });
        orgtree.$container.appendTo($('#test'));
      }
    );
  }


}
