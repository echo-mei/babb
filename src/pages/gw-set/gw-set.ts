///<reference path="../../services/jquery.d.ts"/>
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { TreeProvider } from '../../providers/tree/tree';
import { BabbHcProvider } from '../../providers/babb-hc/babb-hc';

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
    public babbHcProvider: BabbHcProvider,
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
          if (!gwList) resolve(gwList);
          let rootIndex = gwList.findIndex((item) => {
            return item.orgType == "0";
          })
          // 获取岗位设置表的表头以及编制汇总统计
          let caption = gwList[rootIndex].orgName + "岗位设置表";
          this.babbUnitProvider.getGwHc(gwList[rootIndex].orgOid).then((list) => {
            let hcAll = "";
            let hcList = this.babbHcProvider.sort1(list);
            hcList.forEach((item, index) => {
              hcAll += `${item.hcName}<font class="red-minus">${item.curCount}</font>名`;
              if (index < hcList.length - 1) {
                hcAll += `+`;
              }
            });
            gwList[rootIndex].caption = caption;
            gwList[rootIndex].hcAll = hcAll;
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
                  if (index == gwList.length - 1) {
                    resolve(gwList);
                  }
                }
              ).catch(
                e => {
                  reject(e);
                }
              );
            });
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
          if (!item.parentOrgOid && item.orgType != 0) {
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
          if (children && children.length) {
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
              if (c.orgType == 1) {
                n.children.push(c);
              }
              if (c.orgType == 2) {
                x.children.push(c);
                reBuild(c);
              }
            });
            node.children = [];
            if (n.children.length) {
              n.children = [{
                nsChildren: true,
                gwChildren: n.children
              }];
              node.children.push(n);
            }
            if (x.children.length) {
              node.children.push(x);
            }
          }
        }
        reBuild(data[0]);
        let that = this;
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
          renderCaption: function (nodeData) {
            return '<h1 class="org-caption">' + nodeData.caption + '<h1><p class="org-hcAll">(' + nodeData.hcAll + ')</p>';
          },
          renderTitle: function (nodeData) {
            var res = [];
            if (nodeData.nsChildren) {
              return '';
            }
            if (nodeData.orgType == 0) {
              var gwDetailList = nodeData.gwDetailList;
              if (gwDetailList.length > 0) {
                gwDetailList.forEach(function (item) {
                  res.push('<span>' + item.gwName + '</span><span>' + (item.curCount ? item.curCount : '') + '</span>')
                });
                return res;
              }
            }
            res.push('<span>' + nodeData.orgName + '</span><span>' + (nodeData.sumCount ? nodeData.sumCount : '') + '</span>');
            return res;
          },
          renderContent: function (nodeData) {
            var r = '';
            if (nodeData.orgType == 0) return '';
            if (nodeData.nsChildren) {
              nodeData.gwChildren.forEach((gw) => {
                var title = '<span>' + gw.orgName + '</span><span>' + (gw.sumCount ? gw.sumCount : '') + '</span>';
                var content = '<table>';
                gw.gwDetailList && gw.gwDetailList.forEach(function (detail) {
                  content +=
                    '<tr>' +
                    '<td>' + detail.gwName + '</td>' +
                    '<td>' + detail.curCount + '</td>' +
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
            nodeData.gwDetailList && nodeData.gwDetailList.forEach(function (detail) {
              r +=
                '<tr>' +
                '<td>' + detail.gwName + '</td>' +
                '<td>' + detail.curCount + '</td>' +
                '</tr>';
            });
            r += '</table>';
            return r;
          },
          titleStyle: function (nodeData) {
            if (nodeData.nsChildren) {
              return 'display:none;';
            }
            if (nodeData.orgType == 0) {
              return 'background: linear-gradient(to right, #ff5c55, #ff9a85)';
            }
            if (nodeData.orgType == 1) {
              return 'background: linear-gradient(to right, #5e8bfe, #84b5ff)';
            }
            if (nodeData.orgType == 2) {
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
