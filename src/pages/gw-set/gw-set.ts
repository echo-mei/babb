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

  hcDetail:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
    public treeProvider: TreeProvider
  ) {
    this.unit = this.navParams.get('unit');
  }

  onClickHome() {
    this.navCtrl.popToRoot();
  }

  ionViewDidLoad() {
    let promise = new Promise((resolve, reject) => {
      this.babbUnitProvider.getGwList(this.unit.unitOid).then(
        gwList => {
          if(!gwList) resolve(gwList);
          gwList.forEach((item, index) => {
            this.babbUnitProvider.getGwDetailList(item.orgOid, item.orgType).then(
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
        // 获取编制统计
        this.babbUnitProvider.getGwHc(root.unitOid).then((list)=>{
          this.hcDetail = list;
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
        console.log(data)
        function reBuild(node) {
          let children = node.children;
          if(children&&children.length) {
            let n = {
              orgName: '内设机构',
              orgType: 1,
              children: []
            };
            let x = {
              orgName: '下设机构',
              orgType: 2,
              children: []
            };
            children.forEach((c) => {
              if(c.orgType==1) {
                n.children.push(c);
              }
              if(c.orgType==2) {
                x.children.push(c);
                reBuild(c);
              }
            });
            node.children = [];
            if(n.children.length) {
              n.children = [{
                nsChildren: true,
                gwChildren: n.children
              }];
              node.children.push(n);
            }
            if(x.children.length) {
              node.children.push(x);
            }
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
          showContentEvent: '',
          renderTitle: function(nodeData) {
            if(nodeData.nsChildren) {
              return '';
            }
            return '<span>'+nodeData.orgName+'</span><span>'+(nodeData.sumCount ? nodeData.sumCount : '')+'</span>';
          },
          renderContent: function(nodeData) {
            var r = '';
            if(nodeData.nsChildren) {
              nodeData.gwChildren.forEach((gw) => {
                var title = '<span>'+gw.orgName+'</span><span>'+(gw.sumCount ? gw.sumCount : '')+'</span>';
                var content = '<table>';
                gw.gwDetailList&&gw.gwDetailList.forEach(function(detail) {
                  content +=
                    '<tr>'+
                        '<td>'+detail.gwName+'</td>'+
                        '<td>'+detail.curCount+'</td>'+
                    '</tr>';
                });
                content += '</table>';
                r += `
                  <div class="node-main" style="margin-bottom:5px;">
                    <div class="title">
                      <div class="title-main">${title}</div>
                    </div>
                    <div class="content" style="">
                      <div class="content-main">${content}</div>
                    </div>
                  </div>`;
              });
              return r;
            }
            r = '<table>';
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
          titleStyle: function(nodeData) {
            if(nodeData.nsChildren) {
              return 'display:none;';
            }
            if(nodeData.orgType==0) {
              return 'background: linear-gradient(to right, #ff5c55, #ff9a85)';
            }
            if(nodeData.orgType==1) {
              return 'background: linear-gradient(to right, #5e8bfe, #84b5ff)';
            }
            if(nodeData.orgType==2) {
              return 'background: linear-gradient(to right, #fba47a, #f7c06a)';
            }
          },
          data: data[0]
        });
        orgtree.$container.appendTo($('#test'));
      }
    );
  }


}
