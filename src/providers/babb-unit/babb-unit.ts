import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { TreeProvider } from '../tree/tree';
import { defaults } from 'ionic-angular/umd/util/util';

@Injectable()
export class BabbUnitProvider {

  constructor(
    protected db: DatabaseProvider,
    protected tree: TreeProvider
  ) {
  }

  getVersion(): Promise<any> {
    const sql = `
      select max(create_date) as createDate from pad_data_create_info
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows[0].createDate);
      }).catch(reject);
    });
  }

  // 获取单位树
  getUnitTree(): Promise<any> {
    // const sql = `WITH RECURSIVE
    //   unit_tree(UNIT_OID, UNIT_NAME, PARENT_UNIT_OID, UNIT_CATEGORY_CODE, UNIT_CATEGORY_NAME, level) AS (
    //     SELECT UNIT_OID, UNIT_NAME, PARENT_UNIT_OID, UNIT_CATEGORY_CODE, UNIT_CATEGORY_NAME, 0 FROM pad_base_unit WHERE PARENT_UNIT_OID is null
    //     UNION ALL
    //     SELECT pbu.UNIT_OID, pbu.UNIT_NAME, pbu.PARENT_UNIT_OID, pbu.UNIT_CATEGORY_CODE, pbu.UNIT_CATEGORY_NAME, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
    //     ORDER BY 1 DESC
    //   )
    //   SELECT
    //     UNIT_NAME as unitName,
    //     UNIT_OID as unitOid,
    //     PARENT_UNIT_OID as parentUnitOid,
    //     UNIT_CATEGORY_CODE as unitCategoryCode,
    //     UNIT_CATEGORY_NAME as unitCategoryName
    //   FROM unit_tree`;
    const sql = `
      SELECT
        UNIT_NAME as unitName,
        UNIT_OID as unitOid,
        PARENT_UNIT_OID as parentUnitOid,
        UNIT_CATEGORY_CODE as unitCategoryCode,
        UNIT_CATEGORY_NAME as unitCategoryName,
        STREET_OFF_FLAG as streetOffFlag
      FROM pad_base_unit
      order by unit_category_code, unit_kind, ORDER_OF_ALL
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        let unitTree = this.tree.buildTree(rows, {
          id: 'unitOid',
          parentId: 'parentUnitOid'
        });
        resolve(unitTree);
      }).catch(reject);
    });
  }

  // 区机构数统计：by unit_kind
  statisticsUnitByKind(): Promise<any> {
    const sql = `
      SELECT
        SUM(INFACT_COUNT) as infactCount,
        UNIT_KIND as unitKind,
        UNIT_KIND_NAME as unitKindName
      FROM PAD_UNIT_STATISTICS
      GROUP BY UNIT_KIND`;
    return this.db.select(sql);
  }

  // 单位数统计: by UNIT_KIND, UNIT_CATEGORY_CODE
  statisticsUnitByKindAndCategory(): Promise<any> {
    const sql = `
      select
          -1 as unitCategoryCode,
          '小计' as unitCategoryName,
          SUM(syCount) AS syCount,
          SUM(cgCount) AS cgCount,
          SUM(jgCount) AS jgCount,
          SUM(sumCount) AS sumCount
      from (
          select
              *,
              ifnull(syCount, 0)+ifnull(cgCount, 0)+ifnull(jgCount, 0) as sumCount
          from (
          select
              UNIT_CATEGORY_CODE as unitCategoryCode,
              UNIT_CATEGORY_NAME as unitCategoryName,
              (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where UNIT_KIND = 103 AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS syCount,
              (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where (UNIT_KIND = 104 OR UNIT_KIND = 107) AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS cgCount,
              (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where UNIT_KIND != 103 AND UNIT_KIND != 104 AND UNIT_KIND != 107 AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS jgCount
          from PAD_UNIT_STATISTICS t
          GROUP BY UNIT_CATEGORY_CODE
          )
      )
      UNION ALL
      select
          *,
          ifnull(syCount, 0)+ifnull(cgCount, 0)+ifnull(jgCount, 0) as sumCount
      from (
      select
          UNIT_CATEGORY_CODE as unitCategoryCode,
          UNIT_CATEGORY_NAME as unitCategoryName,
          (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where UNIT_KIND = 103 AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS syCount,
          (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where (UNIT_KIND = 104 OR UNIT_KIND = 107) AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS cgCount,
          (SELECT SUM(INFACT_COUNT) FROM PAD_UNIT_STATISTICS t1 where UNIT_KIND != 103 AND UNIT_KIND != 104 AND UNIT_KIND != 107 AND t1.UNIT_CATEGORY_CODE=t.UNIT_CATEGORY_CODE) AS jgCount
      from PAD_UNIT_STATISTICS t
      GROUP BY UNIT_CATEGORY_CODE
      )`;
    return this.db.select(sql);
  }

  // 事业单位数量情况（按最高行政管理岗位等级分类）
  statisticsSyUnitByLevel(): Promise<any> {
    const sql = `
      SELECT
        SUM(INFACT_COUNT) as infactCount,
        LEVEL_CODE as levelCode,
        LEVEL_NAME as levelName
      FROM PAD_UNIT_STATISTICS
      WHERE UNIT_KIND = 103
      GROUP BY UNIT_KIND, LEVEL_CODE
      ORDER BY LEVEL_CODE asc`;
    return this.db.select(sql);
  }

  // 事业单位数量情况（按经费形式划分）
  statisticsSyUnitBudget(): Promise<any> {
    const sql = `
      SELECT
        SUM(INFACT_COUNT) as infactCount,
        BUDGET_FROM_CODE as budgetFromCode,
        BUDGET_FROM_NAME as budgetFromName
      FROM PAD_UNIT_STATISTICS
      WHERE UNIT_KIND = 103
      GROUP BY UNIT_KIND, BUDGET_FROM_CODE`;
    return this.db.select(sql);
  }

  // 获取所有单位名列表
  getUnitNameList(): Promise<any> {
    const sql = `
      SELECT
        UNIT_OID as unitOid,
        UNIT_NAME as unitName
      FROM PAD_BASE_UNIT`;
    return this.db.select(sql);
  }

  // 通过单位名查找单位
  findUnitListByName(unitName: string): Promise<any> {
    const sql = `
      SELECT
        UNIT_OID as unitOid,
        UNIT_NAME as unitName
      FROM PAD_BASE_UNIT
      WHERE UNIT_NAME LIKE ?`;

    const secondShowSql = `
      SELECT
        UNIT_OID as unitOid,
        UNIT_NAME as unitName,
        SECOND_NAME_SHOW as secondNmae
      FROM PAD_BASE_UNIT
      WHERE SECOND_NAME_SHOW LIKE ?`;

    const secondWorkSql = `
      SELECT
        UNIT_OID as unitOid,
        UNIT_NAME as unitName,
        SECOND_NAME_WORK as secondNmae
      FROM PAD_BASE_UNIT
      WHERE SECOND_NAME_WORK LIKE ?`;

    return this.db.select(sql, ['%' + unitName.split('').join('%') + '%']).then(res => {
      if (res.length > 0) {
        return this.db.select(sql, ['%' + unitName.split('').join('%') + '%']);
      } else {
        return this.db.select(secondShowSql, ['%' + unitName.split('').join('%') + '%']).then(res => {
          if (res.length > 0) {
            return this.db.select(secondShowSql, ['%' + unitName.split('').join('%') + '%']);
          } else {
            return this.db.select(secondWorkSql, ['%' + unitName.split('').join('%') + '%']).then(res => {
              if (res.length > 0) {
                return this.db.select(secondWorkSql, ['%' + unitName.split('').join('%') + '%']);
              }
            })
          }
        })
      }
    })
  }

  // 以下获取综合查询条件
  // 系统类别
  getSyetem(): Promise<any> {
    const sql = `
      SELECT
        UNIT_CATEGORY_CODE,
        UNIT_CATEGORY_CODE as dicItemCode,
        UNIT_CATEGORY_NAME as dicItemName
    FROM PAD_BASE_UNIT group by UNIT_CATEGORY_CODE`;
    return this.db.select(sql);
  }

  // 单位性质
  getUnitXz(): Promise<any> {
    const sql = `
      SELECT
        UNIT_KIND_NEW,
        UNIT_KIND_NEW as dicItemCode,
        UNIT_KIND_NEW_NAME as dicItemName
      FROM PAD_BASE_UNIT group by UNIT_KIND_NEW`;

    return this.db.select(sql);
  }

  // 机构类别
  getJiGou(): Promise<any> {
    const sql = `
      SELECT
        LEVEL_CODE,
        LEVEL_CODE as dicItemCode,
        LEVEL_NAME as dicItemName
      FROM PAD_BASE_UNIT group by LEVEL_CODE`;
    return this.db.select(sql);
  }

  // 编制类别
  getWave(): Promise<any> {
    const sql = `
      SELECT
        HC_OID,
        HC_OID as dicItemCode,
        HC_NAME as dicItemName
      FROM PAD_BASE_UNIT_HC group by HC_OID`;
    return this.db.select(sql);
  }

  // 经费形式
  getFeeStyle(): Promise<any> {
    const sql = `
      SELECT
        BUDGET_FROM_CODE,
        BUDGET_FROM_CODE as dicItemCode,
        BUDGET_FROM_NAME as dicItemName
      FROM PAD_BASE_UNIT group by BUDGET_FROM_CODE`;
    return this.db.select(sql);
  }

  // 事业单位分类
  getWorkUnit(): Promise<any> {
    const sql = `
      SELECT
        UNIT_TYPE_BIZ_CODE,
        UNIT_TYPE_BIZ_CODE as dicItemCode,
        UNIT_TYPE_BIZ_NAME as dicItemName
      FROM PAD_BASE_UNIT group by UNIT_TYPE_BIZ_CODE`;
    return this.db.select(sql);
  }

  // 根据综合查询条件挨个去查询匹配地单位
  getAllResult(itemList, key = '', sNum, bNum): Promise<any> {
    let _this = false;
    itemList.forEach((myItem, index, list) => {
      if (myItem.length != 0) {
        _this = true;
      }
    })
    if (!_this) {
      if (sNum != '' || bNum != '') {
        let defaultSql = `SELECT
          UNIT_NAME,
          UNIT_OID
        FROM PAD_BASE_UNIT
        WHERE UNIT_NAME like '%${key}%' AND (UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where  cur_count >= ${sNum} and cur_count <= ${bNum}))`;
        return this.db.select(defaultSql);
      } else {
        let defaultSql = `
        SELECT
          UNIT_NAME,
          UNIT_OID
        FROM PAD_BASE_UNIT
        WHERE UNIT_NAME like '%${key}%'`;
        return this.db.select(defaultSql);
      }
    } else {
      let sql = `
        SELECT
          UNIT_NAME,
          UNIT_OID
        FROM PAD_BASE_UNIT
        WHERE UNIT_NAME like '%${key}%' AND (`;
      let sql2 = ``;
      if (itemList[0].length > 0) { // UNIT_CATEGORY_CODE
        // itemList[0].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR UNIT_CATEGORY_CODE IN (${item.dicItemCode})` : ` UNIT_CATEGORY_CODE IN (${item.dicItemCode})`;
        // })
        let ins = '';
        itemList[0].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        sql2 += sql2 ? ` AND UNIT_CATEGORY_CODE IN (${ins})` : ` UNIT_CATEGORY_CODE IN (${ins})`;

      }
      if (itemList[1].length > 0) { // UNIT_KIND
        // itemList[1].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR UNIT_KIND IN (${item.dicItemCode})` : ` UNIT_KIND IN (${item.dicItemCode})`;
        // })
        let ins = '';
        itemList[1].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        sql2 += sql2 ? ` AND UNIT_KIND_NEW IN (${ins})` : ` UNIT_KIND_NEW IN (${ins})`;
      }
      if (itemList[2].length > 0) { // LEVEL_CODE
        // itemList[2].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR LEVEL_CODE IN (${item.dicItemCode})` : ` LEVEL_CODE IN (${item.dicItemCode})`;
        // })
        let ins = '';
        itemList[2].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        sql2 += sql2 ? ` AND LEVEL_CODE IN (${ins})` : ` LEVEL_CODE IN (${ins})`;
      }

      if (itemList[4].length > 0) { // BUDGET_FROM_CODE
        // itemList[4].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR BUDGET_FROM_CODE IN (${item.dicItemCode})` : ` BUDGET_FROM_CODE IN (${item.dicItemCode})`;
        // })
        let ins = '';
        itemList[4].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        sql2 += sql2 ? ` AND BUDGET_FROM_CODE IN (${ins})` : ` BUDGET_FROM_CODE IN (${ins})`;
      }
      if (itemList[5].length > 0) { // UNIT_OID
        // itemList[5].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR UNIT_TYPE_BIZ_CODE IN (${item.dicItemCode})` : ` UNIT_TYPE_BIZ_CODE IN (${item.dicItemCode})`;
        // })
        let ins = '';
        itemList[5].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        sql2 += sql2 ? ` AND UNIT_TYPE_BIZ_CODE IN (${ins})` : ` UNIT_TYPE_BIZ_CODE IN (${ins})`;
      }
      if (itemList[3].length > 0) { // LEVEL_CODE
        // itemList[3].forEach((item, index, list) => {
        //   sql2 += sql2 ? ` OR UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${item.dicItemCode}) and cur_count >= ${sNum} and cur_count <= ${bNum})` : ` UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${item.dicItemCode}) and cur_count >= ${sNum} and cur_count <= ${bNum})`;
        // })
        let ins = '';
        itemList[3].forEach((item, index, list) => {
          ins += item.dicItemCode + ',';
        });
        ins = ins.substr(0, ins.length - 1);
        if (sNum != '' || bNum != '') {
          sql2 += sql2 ? ` AND UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${ins}) and cur_count >= ${sNum} and cur_count <= ${bNum})` : ` UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${ins}) and cur_count >= ${sNum} and cur_count <= ${bNum})`;
        } else {
          sql2 += sql2 ? ` AND UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${ins}))` : ` UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${ins}))`;
        }
      }
      let sql1 = `)`;
      let sql3 = sql + sql2 + sql1;
      return this.db.select(sql3);
    }
  }

  getGwList(unitOid): Promise<any> {
    return new Promise((resolve, reject) => {
      let sql = `select
        UNIT_GW_OID as unitGwOid,
        UNIT_OID as unitOid,
        ORG_OID as orgOid,
        ORG_NAME as orgName,
        PRAENT_ORG_OID as parentOrgOid,
        PRAENT_ORG_NAME as parentOrgName,
        ORG_TYPE as orgType
      from pad_base_unit_gw a`;
      this.db.select(`select unit_kind as unitKind from pad_base_unit where unit_oid = ${unitOid}`).then(
        unit => {
          if (unit[0]['unitKind'] != 3) { // 机关、参公
            sql += ` where unit_oid = (select admin_unit_oid from pad_base_unit where unit_oid = ${unitOid})`;
          } else { // 事业
            sql += ` where unit_oid = ${unitOid}`;
          }
          this.db.select(sql).then(resolve).catch(reject);
        }
      );
    });
    // const sql = `select
    //     UNIT_GW_OID as unitGwOid,
    //     UNIT_OID as unitOid,
    //     ORG_OID as orgOid,
    //     ORG_NAME as orgName,
    //     PRAENT_ORG_OID as parentOrgOid,
    //     PRAENT_ORG_NAME as parentOrgName,
    //     ORG_TYPE as orgType
    //   from pad_base_unit_gw a
    //   where unit_oid = (select admin_unit_oid from pad_base_unit where unit_oid = ${unitOid})`;
    // return this.db.select(sql);
  }

  // 获取岗位设置表title编制数
  getGwHc(uid): Promise<any> {
    const sql = `
    select
      unit_oid as unitOid,
      hc_name as hcName,
      cur_count as curCount
    from pad_base_unit_gw_hc where unit_oid=${uid} and cur_count<>0
    `;
    return this.db.select(sql);
  }

  // 岗位设置表
  getGwSet(uid): Promise<any> {
    const sql = `select
        a.UNIT_GW_OID as unitGwOid,
        a.UNIT_OID as unitOid,
        a.ORG_OID as orgOid,
        a.ORG_NAME as orgName,
        a.PRAENT_ORG_OID as parentOrgOid,
        a.PRAENT_ORG_NAME as parentOrgName,
        a.ORG_TYPE as orgType,
        b.GW_NAME as gwName
      from pad_base_unit_gw a
      left join pad_base_unit_gw_detail b
      on a.unit_gw_oid = b.unit_gw_oid
      where a.unit_oid = (select admin_unit_oid from pad_base_unit where unit_oid = ${uid})`;
    return this.db.select(sql);
  }

  // 岗位设置表 detail
  getGwDetailList(orgOid, orgType): Promise<any> {
    const sql = `
      SELECT
        UNIT_GW_DETAIL_OID as unitGwDetailOid,
        UNIT_GW_OID as unitGwOid,
        GW_NAME as gwName,
        CUR_COUNT as curCount,
        ORDER_OF_ALL as orderOfAll
      FROM PAD_BASE_UNIT_GW_DETAIL
      WHERE UNIT_GW_OID = ${orgOid}
      AND ORG_TYPE = ${orgType}`;
    return this.db.select(sql);
  }

  // 三定文件
  getThreeFile(uid): Promise<any> {
    const sql = `SELECT *
    FROM PAD_GOV_FILE where UNIT_OID = ${uid} AND GOV_FILE_TYPE = 1`;
    return this.db.select(sql);
  }

  // 三定文件
  getHistoryFile(uid): Promise<any> {
    const sql = `SELECT *
    FROM PAD_GOV_FILE where UNIT_OID = ${uid} AND GOV_FILE_TYPE = 2`;
    return this.db.select(sql);
  }

  // 获取单位具体信息
  getUnit(unitOid): Promise<any> {
    const sql = `
        SELECT
          UNIT_NAME as unitName,
          UNIT_OID as unitOid,
          UNIT_FUNCTION as unitFunction,
          PARENT_UNIT_OID as parentUnitOid,
          UNIT_CATEGORY_CODE as unitCategoryCode,
          UNIT_CATEGORY_NAME as unitCategoryName,
          UNIT_KIND as unitKind,
          SECOND_NAME_WORK as secondNameWork,
          SECOND_NAME_SHOW as secondNameShow,
          ADMIN_UNIT_OID as adminUnitOid,
          ADMIN_UNIT_NAME as adminUnitName,
          LEVEL_CODE as levelCode,
          LEVEL_NAME as levelName,
          BUDGET_FROM_CODE as budgetFromCode,
          BUDGET_FROM_NAME as budgetFromName,
          UNIT_TYPE_BIZ_CODE as unitTypeBizCode,
          UNIT_TYPE_BIZ_NAME as unitTypeBizName
        FROM pad_base_unit  WHERE UNIT_OID=${unitOid}
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows[0]);
      }).catch(reject);
    });
  }

  // 获取下设单位
  getChildUnit(unitOid): Promise<any> {
    const sql = `
    SELECT UNIT_OID as unitOid FROM pad_base_unit WHERE PARENT_UNIT_OID=${unitOid}
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取编制sql
  getHcSql(unitOidRange) {
    const sql = `
    SELECT
      0 as hcOid,
      '总编制' as hcName,
      SUM(curCount) as curCount,
      SUM(curLockCount) as curLockCount,
      SUM(infactCount) as infactCount,
      SUM(frzCount) as frzCount,
      SUM(freeCount) as freeCount
    from
    (
      SELECT
        HC_OID as hcOid,
        HC_NAME as hcName,
        SUM(CUR_COUNT) as curCount,
        SUM(CUR_LOCK_COUNT) as curLockCount,
        (select count(*) from pad_person p where p.D_POSITION_TYPE = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `)) as infactCount,
        (select count(*) from pad_hc_freeze_info p where p.HC_OID = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `)) as frzCount,
        SUM(CUR_COUNT)-SUM(CUR_LOCK_COUNT)-(select count(*) from pad_person p where p.D_POSITION_TYPE = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `))-(select count(*) from pad_hc_freeze_info p where p.HC_OID = h.HC_OID and p.UNIT_OID in(` + unitOidRange + `)) as freeCount
      FROM
        pad_base_unit_hc h WHERE h.UNIT_OID in (`+ unitOidRange + `)
        and
        (h.CUR_COUNT<>0 or h.CUR_LOCK_COUNT<>0 or h.INFACT_COUNT<>0 or h.FRZ_COUNT<>0 or h.FREE_COUNT<>0)
      GROUP BY h.HC_OID
      union all
        select
          D_POSITION_TYPE as hcOid,
          D_POSITION_TYPE_NAME as hcName,
          0 as curCount,
          0 as curLockCount,
          count(*) as infactCount,
          (select count(*) from pad_hc_freeze_info f where f.UNIT_OID = p.UNIT_OID and f.HC_OID = p.D_POSITION_TYPE) as frzCount,
          0-count(*)- (select count(*) from pad_hc_freeze_info f where f.UNIT_OID = p.UNIT_OID and f.HC_OID = p.D_POSITION_TYPE) as freeCount
          from pad_person p
        where
          p.unit_oid in (`+ unitOidRange + `)
          and
          p.D_POSITION_TYPE not in (select hc_oid FROM pad_base_unit_hc WHERE UNIT_OID in (`+ unitOidRange + `)) group by D_POSITION_TYPE
      union all
        select
          HC_OID as hcOid,
          HC_NAME as hcName,
          0 as curCount,
          0 as curLockCount,
          0 as infactCount,
          count(*) as frzCount,
          0-count(*) as freeCount from pad_hc_freeze_info p
        where
          p.unit_oid in (`+ unitOidRange + `)
          and
          p.hc_oid not in (select hc_oid FROM pad_base_unit_hc WHERE UNIT_OID in (`+ unitOidRange + `))
          and
          p.hc_oid not in (select D_POSITION_TYPE FROM pad_person WHERE UNIT_OID in (`+ unitOidRange + `))
        group by p.hc_oid
    )
    UNION ALL
      SELECT
        HC_OID as hcOid,
        HC_NAME as hcName,
        SUM(CUR_COUNT) as curCount,
        SUM(CUR_LOCK_COUNT) as curLockCount,
        (select count(*) from pad_person p where p.D_POSITION_TYPE = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `)) as infactCount,
        (select count(*) from pad_hc_freeze_info p where p.HC_OID = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `)) as frzCount,
        SUM(CUR_COUNT)-SUM(CUR_LOCK_COUNT)-(select count(*) from pad_person p where p.D_POSITION_TYPE = h.HC_OID and p.UNIT_OID in(`+ unitOidRange + `))-(select count(*) from pad_hc_freeze_info p where p.HC_OID = h.HC_OID and p.UNIT_OID in(` + unitOidRange + `)) as freeCount
      FROM pad_base_unit_hc h
      WHERE
      h.UNIT_OID in (`+ unitOidRange + `)
      and
      (h.CUR_COUNT<>0 or h.CUR_LOCK_COUNT<>0 or h.INFACT_COUNT<>0 or h.FRZ_COUNT<>0 or h.FREE_COUNT<>0)
      GROUP BY h.HC_OID
    union all
      select
        D_POSITION_TYPE as hcOid,
        D_POSITION_TYPE_NAME as hcName,
        0 as curCount,
        0 as curLockCount,
        count(*) as infactCount,
        (select count(*) from pad_hc_freeze_info f where f.UNIT_OID = p.UNIT_OID and f.HC_OID = p.D_POSITION_TYPE) as frzCount,
        0-count(*)- (select count(*) from pad_hc_freeze_info f where f.UNIT_OID = p.UNIT_OID and f.HC_OID = p.D_POSITION_TYPE) as freeCount
        from pad_person p
      where
        p.unit_oid in (`+ unitOidRange + `)
        and
        p.D_POSITION_TYPE not in (select hc_oid FROM pad_base_unit_hc WHERE UNIT_OID in (`+ unitOidRange + `)) group by D_POSITION_TYPE
    union all
      select
        HC_OID as hcOid,
        HC_NAME as hcName,
        0 as curCount,
        0 as curLockCount,
        0 as infactCount,
        count(*) as frzCount,
        0-count(*) as freeCount from pad_hc_freeze_info p
      where
        p.unit_oid in (`+ unitOidRange + `)
        and
        p.hc_oid not in (select hc_oid FROM pad_base_unit_hc WHERE UNIT_OID in (`+ unitOidRange + `))
        and
        p.hc_oid not in (select D_POSITION_TYPE FROM pad_person WHERE UNIT_OID in (`+ unitOidRange + `))
      group by p.hc_oid
    `;
    return sql;
  }

  // 获取本单位编制统计
  getUnitHc(unitOid): Promise<any> {
    const sql = this.getHcSql(`${unitOid}`);
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取下设单位的编制统计
  getUnitHcInter(unitOid): Promise<any> {
    const sql = this.getHcSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE PARENT_UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及下设单位的编制统计
  getUnitHcAll(unitOid): Promise<any> {
    const sql = this.getHcSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
      `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取卫生和计生局的医院的编制统计
  getUnitHcHos(unitOid): Promise<any> {
    const sql = this.getHcSql(`
      SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('80101', '80103', '80302', '80502', '80307')
      `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取教育局学校的编制统计
  getUnitHcEdu(unitOid): Promise<any> {
    const sql = this.getHcSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('10501', '10601', '10602', '10603','10604', '10606')
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取实有人员的sql
  getHcInfactSql(unitOidRange, hc) {
    let sql;
    // hcOid为0表示总实有数统计
    if (hc.hcOid) {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        SEX_CODE_NAME as sexCodeName,
        UNIT_NAME as unitName,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as administrativeDutyLevelName,
        DUTY_ATTRIBUTE_BZ_NAME as dutyAttributeBzName,
        D_POSITION_TYPE_NAME as dPositionTypeName
      FROM pad_person WHERE UNIT_OID in (`+ unitOidRange + `) AND D_POSITION_TYPE=${hc.hcOid} order by D_POSITION_TYPE
      `;
    } else {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        SEX_CODE_NAME as sexCodeName,
        UNIT_NAME as unitName,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as administrativeDutyLevelName,
        DUTY_ATTRIBUTE_BZ_NAME as dutyAttributeBzName,
        D_POSITION_TYPE_NAME as dPositionTypeName
      FROM pad_person WHERE UNIT_OID in (`+ unitOidRange + `) AND (D_POSITION_TYPE is not NULL) order by D_POSITION_TYPE
      `;
    }
    return sql;
  }

  // 获取单位编制实有人员
  getUnitHcInfact(unitOid, hc) {
    const sql = this.getHcInfactSql(`${unitOid}`, hc);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取下设单位编制实有人员
  getUnitHcInfactInter(unitOid, hc) {
    const sql = this.getHcInfactSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE PARENT_UNIT_OID = ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, hc);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及下设单位编制实有人员
  getUnitHcInfactAll(unitOid, hc) {
    const sql = this.getHcInfactSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE UNIT_OID = ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, hc);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取卫生和计生局的医院编制实有人员
  getUnitHcInfactHos(unitOid, hc) {
    const sql = this.getHcInfactSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('80101', '80103', '80302', '80502', '80307')
    `, hc);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取教育局下学校的编制实有人员
  getUnitHcInfactEdu(unitOid, hc) {
    const sql = this.getHcInfactSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('10501', '10601', '10602', '10603','10604', '10606')
    `, hc);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取冻结人员的sql
  getHcFrzSql(unitOidRange, hcOid) {
    let sql;
    // hcOid为0表示总实有数统计
    if (hcOid) {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID in (`+ unitOidRange + `) AND HC_OID=${hcOid} order by HC_OID
      `;
    } else {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID in (`+ unitOidRange + `) AND (HC_OID is not NULL) order by HC_OID
      `;
    }
    return sql;
  }
  // 获取单位编制冻结人员
  getUnitHcFrz(unitOid, hcOid) {
    const sql = this.getHcFrzSql(`${unitOid}`, hcOid);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取下设单位编制冻结人员
  getUnitHcFrzInter(unitOid, hcOid) {
    const sql = this.getHcFrzSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE PARENT_UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, hcOid);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及下设单位编制冻结人员
  getUnitHcFrzAll(unitOid, hcOid) {
    const sql = this.getHcFrzSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, hcOid);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取卫生计生局下医院的编制冻结人员
  getUnitHcFrzHos(unitOid, hcOid) {
    const sql = this.getHcFrzSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('80101', '80103', '80302', '80502', '80307')
    `, hcOid);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取教育局下医院的编制冻结人员
  getUnitHcFrzEdu(unitOid, hcOid) {
    const sql = this.getHcFrzSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('10501', '10601', '10602', '10603','10604', '10606')
    `, hcOid);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 职数统计sql
  getLeaderSql(unitOidRange) {
    // 单位领导
    const unitAttribute = '010110';
    // 内设机构领导
    const unitInterAttribute = '010120';
    const sql = `
    SELECT
      unitOid,
      '0' as dutyAttribute,
      '0' as dutyAttributeName,
      '0' as dutyLevel,
      '总职数' as dutyLevelName,
      SUM(curCount) as curCount,
      SUM(infactCount) as infactCount,
      SUM(freeCount) as freeCount
    from(
      SELECT
        unitOid,
        dutyAttribute,
        dutyAttributeName,
        '0' as dutyLevel,
        '小计' as dutyLevelName,
        SUM(curCount) as curCount,
        SUM(infactCount) as infactCount,
        SUM(freeCount) as freeCount
      from
      (
        select * from (
          SELECT
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            DUTY_LEVEL as dutyLevel,
            DUTY_LEVEL_NAME as dutyLevelName,
            SUM(CUR_COUNT) as curCount,
            (select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as infactCount,
            SUM(CUR_COUNT)-(select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as freeCount
          FROM pad_base_unit_leader h WHERE UNIT_OID in (`+ unitOidRange + `) and (CUR_COUNT<>0 or INFACT_COUNT<>0 or FREE_COUNT<>0)
          GROUP BY h.DUTY_ATTRIBUTE,h.DUTY_LEVEL
          union all
          select
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
            ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
            0 as curCount,
            count(*) as infactCount,
            0-count(*) as freeCount
          from pad_person p
          where
            p.unit_oid in (`+ unitOidRange + `)
            and
            p.ADMINISTRATIVE_DUTY_LEVEL not in (
              select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
            )
            and
            p.DUTY_ATTRIBUTE='${unitAttribute}'
            GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
          union all
          select
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
            ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
            0 as curCount,
            count(*) as infactCount,
            0-count(*) as freeCount
          from pad_person p
          where
            p.unit_oid in (`+ unitOidRange + `)
            and
            p.ADMINISTRATIVE_DUTY_LEVEL not in (
              select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitInterAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
            )
            and
            p.DUTY_ATTRIBUTE='${unitInterAttribute}'
            GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
        ) order by dutyAttribute,dutyLevel
      ) GROUP BY dutyAttribute
    )
    UNION all
    SELECT
      unitOid,
      dutyAttribute,
      dutyAttributeName,
      '0' as dutyLevel,
      '小计' as dutyLevelName,
      SUM(curCount) as curCount,
      SUM(infactCount) as infactCount,
      SUM(freeCount) as freeCount
      from
      (
        select * from (
          SELECT
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            DUTY_LEVEL as dutyLevel,
            DUTY_LEVEL_NAME as dutyLevelName,
            SUM(CUR_COUNT) as curCount,
            (select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as infactCount,
            SUM(CUR_COUNT)-(select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as freeCount
          FROM pad_base_unit_leader h WHERE UNIT_OID in (`+ unitOidRange + `) and (CUR_COUNT<>0 or INFACT_COUNT<>0 or FREE_COUNT<>0)
          GROUP BY h.DUTY_ATTRIBUTE,h.DUTY_LEVEL
          union all
          select
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
            ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
            0 as curCount,
            count(*) as infactCount,
            0-count(*) as freeCount
          from pad_person p
          where
            p.unit_oid in (`+ unitOidRange + `)
            and
            p.ADMINISTRATIVE_DUTY_LEVEL not in (
              select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
            )
            and
            p.DUTY_ATTRIBUTE='${unitAttribute}'
            GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
          union all
          select
            UNIT_OID as unitOid,
            DUTY_ATTRIBUTE as dutyAttribute,
            DUTY_ATTRIBUTE_NAME as dutyAttributeName,
            ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
            ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
            0 as curCount,
            count(*) as infactCount,
            0-count(*) as freeCount
          from pad_person p
          where
            p.unit_oid in (`+ unitOidRange + `)
            and
            p.ADMINISTRATIVE_DUTY_LEVEL not in (
              select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitInterAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
            )
            and
            p.DUTY_ATTRIBUTE='${unitInterAttribute}'
            GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
        ) order by dutyAttribute,dutyLevel
      ) GROUP BY dutyAttribute
    UNION all
    select * from (
      SELECT
        UNIT_OID as unitOid,
        DUTY_ATTRIBUTE as dutyAttribute,
        DUTY_ATTRIBUTE_NAME as dutyAttributeName,
        DUTY_LEVEL as dutyLevel,
        DUTY_LEVEL_NAME as dutyLevelName,
        SUM(CUR_COUNT) as curCount,
        (select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as infactCount,
        SUM(CUR_COUNT)-(select count(*) from pad_person p where p.DUTY_ATTRIBUTE = h.DUTY_ATTRIBUTE and p.ADMINISTRATIVE_DUTY_LEVEL=h.DUTY_LEVEL and p.UNIT_OID in (`+ unitOidRange + `)) as freeCount
      FROM pad_base_unit_leader h WHERE UNIT_OID in (`+ unitOidRange + `) and (CUR_COUNT<>0 or INFACT_COUNT<>0 or FREE_COUNT<>0)
      GROUP BY h.DUTY_ATTRIBUTE,h.DUTY_LEVEL
      union all
      select
        UNIT_OID as unitOid,
        DUTY_ATTRIBUTE as dutyAttribute,
        DUTY_ATTRIBUTE_NAME as dutyAttributeName,
        ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
        0 as curCount,
        count(*) as infactCount,
        0-count(*) as freeCount
      from pad_person p
      where
        p.unit_oid in (`+ unitOidRange + `)
        and
        p.ADMINISTRATIVE_DUTY_LEVEL not in (
          select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
        )
        and
        p.DUTY_ATTRIBUTE='${unitAttribute}'
        GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
      union all
      select
        UNIT_OID as unitOid,
        DUTY_ATTRIBUTE as dutyAttribute,
        DUTY_ATTRIBUTE_NAME as dutyAttributeName,
        ADMINISTRATIVE_DUTY_LEVEL as dutyLevel,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as dutyLevelName,
        0 as curCount,
        count(*) as infactCount,
        0-count(*) as freeCount
      from pad_person p
      where
        p.unit_oid in (`+ unitOidRange + `)
        and
        p.ADMINISTRATIVE_DUTY_LEVEL not in (
          select DUTY_LEVEL FROM pad_base_unit_leader l WHERE l.UNIT_OID in (`+ unitOidRange + `) and l.DUTY_ATTRIBUTE='${unitInterAttribute}' and (l.CUR_COUNT<>0 or l.INFACT_COUNT<>0 or l.FREE_COUNT<>0)
        )
        and
        p.DUTY_ATTRIBUTE='${unitInterAttribute}'
        GROUP BY p.DUTY_ATTRIBUTE,p.ADMINISTRATIVE_DUTY_LEVEL
    ) order by dutyAttribute,dutyLevel
    `;

    return sql;
  }

  // 获取本单位职数统计
  getUnitLeader(unitOid): Promise<any> {
    const sql = this.getLeaderSql(`${unitOid}`);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取下设单位职数统计
  getUnitLeaderInter(unitOid): Promise<any> {
    const sql = this.getLeaderSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE PARENT_UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及下设单位职数统计
  getUnitLeaderAll(unitOid): Promise<any> {
    const sql = this.getLeaderSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE UNIT_OID =  ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取卫生计生局下医院的职数统计
  getUnitLeaderHos(unitOid): Promise<any> {
    const sql = this.getLeaderSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('80101', '80103', '80302', '80502', '80307')
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取教育局下学校的职数统计
  getUnitLeaderEdu(unitOid): Promise<any> {
    const sql = this.getLeaderSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('10501', '10601', '10602', '10603','10604', '10606')
    `);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取职数实有人员的sql
  getLeaderInfactSql(unitOidRange, leader) {
    let attributeRange;
    if (leader.dutyAttribute == "0") {
      attributeRange = "'010110','010120'";
    } else {
      attributeRange = `'${leader.dutyAttribute}'`;
    }
    let sql = `
    SELECT
      UNIT_OID as unitOid,
      NAME as name,
      SEX_CODE_NAME as sexCodeName,
      UNIT_NAME as unitName,
      ADMINISTRATIVE_DUTY_LEVEL_NAME as administrativeDutyLevelName,
      DUTY_ATTRIBUTE_NAME as dutyAttributeBzName,
      D_POSITION_TYPE_NAME as dPositionTypeName
    FROM pad_person WHERE UNIT_OID in (`+ unitOidRange + `) AND DUTY_ATTRIBUTE IN (` + attributeRange + `) `;

    if (leader.dutyAttribute != "0") {
      if (leader.dutyLevel != "0") {
        sql += `AND ADMINISTRATIVE_DUTY_LEVEL='${leader.dutyLevel}' order by DUTY_ATTRIBUTE,ADMINISTRATIVE_DUTY_LEVEL`;
      } else {
        // leader.dutyLevel为0表示单位/内设机构实有数统计
        sql += `order by DUTY_ATTRIBUTE,ADMINISTRATIVE_DUTY_LEVEL`;
      }
    } else {
      // leader.dutyAttribute为0表示总实有数统计
      sql += `order by DUTY_ATTRIBUTE,ADMINISTRATIVE_DUTY_LEVEL`;
    }

    return sql;
  }


  // 获取单位职数实有人员
  getUnitLeaderInfact(unitOid, leader) {
    const sql = this.getLeaderInfactSql(`${unitOid}`, leader);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取下设单位职数实有人员
  getUnitLeaderInfactInter(unitOid, leader) {
    const sql = this.getLeaderInfactSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE PARENT_UNIT_OID = ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, leader);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及下设单位职数实有人员
  getUnitLeaderInfactAll(unitOid, leader) {
    const sql = this.getLeaderInfactSql(`
      WITH RECURSIVE
      unit_tree(UNIT_OID, PARENT_UNIT_OID, level) AS (
        SELECT UNIT_OID, PARENT_UNIT_OID,  0 FROM pad_base_unit WHERE UNIT_OID = ${unitOid}
        UNION ALL
        SELECT pbu.UNIT_OID, pbu.PARENT_UNIT_OID, unit_tree.level+1 FROM pad_base_unit pbu JOIN unit_tree ON pbu.PARENT_UNIT_OID=unit_tree.UNIT_OID
        ORDER BY 1 DESC
      )
      SELECT
        UNIT_OID as unitOid
      FROM unit_tree
    `, leader);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取卫生和计生局的医院职数实有人员
  getUnitLeaderInfactHos(unitOid, leader) {
    const sql = this.getLeaderInfactSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('80101', '80103', '80302', '80502', '80307')
    `, leader);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取教育局下学校的职数实有人员
  getUnitLeaderInfactEdu(unitOid, leader) {
    const sql = this.getLeaderInfactSql(`
    SELECT UNIT_OID FROM PAD_BASE_UNIT WHERE ADMIN_UNIT_OID = ${unitOid} AND INDUSTRY_CODE IN ('10501', '10601', '10602', '10603','10604', '10606')
    `, leader);

    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取某单位的内设机构
  getUnitInterOrg(oid): Promise<any> {
    const sql = `
    SELECT
      ORG_OID as orgOid,
      ORG_NAME as orgName,
      LEVEL_NAME as levelName,
      ORG_FUNCTION as orgFunction
    FROM pad_base_unit_org WHERE UNIT_OID=${oid} ORDER BY ORDER_OF_ALL
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取某单位的下设机构
  getUnitInterUnit(oid): Promise<any> {
    const sql = `
    SELECT
      UNIT_NAME as unitName,
      a.UNIT_OID as unitOid,
      PARENT_UNIT_OID as parentUnitOid,
      UNIT_KIND as unitKind,
      LEVEL_NAME as levelName,
      sum(b.cur_count) as curCount,
      sum(b.infact_count) as infactCount
    FROM pad_base_unit as a
    left join pad_base_unit_hc as b
    on a.unit_oid = b.UNIT_OID
    WHERE a.PARENT_UNIT_OID=${oid} AND a.UNIT_KIND<>3 group by a.unit_oid ORDER BY a.ORDER_OF_ALL
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取某单位的下属事业单位
  getUnitInterInstitution(oid): Promise<any> {
    const sql = `
    SELECT
      UNIT_NAME as unitName,
      a.UNIT_OID as unitOid,
      PARENT_UNIT_OID as parentUnitOid,
      UNIT_KIND as unitKind,
      LEVEL_NAME as levelName,
      sum(b.cur_count) as curCount,
      sum(b.infact_count) as infactCount
    FROM pad_base_unit as a
    left join pad_base_unit_hc as b
    on a.unit_oid = b.UNIT_OID
    WHERE a.PARENT_UNIT_OID=${oid} AND a.UNIT_KIND=3 group by a.unit_oid ORDER BY a.ORDER_OF_ALL
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取宝安区事业编制使用情况表
  listSyUnitHc() {
    const sql = `
      select
        street_off_flag as streeOffFlag,
        admin_order as adminOrderFlag,
        unit_order as unitOrder,
        admin_unit_oid as adminUnitOid,
        admin_unit_name as adminUnitName,
        unit_name as unitName,
        level_name as levelName,
        sybz_num as sybzNum,
        INFACT_NUM as infactNum,
        FREE_NUM as freeNum,
        YL_NUM as ylNum,
        KY_NUM as kyNum,
        budget_from_name as budgetFromName,
        GYYE_NUM as gyyeNum,
        UNIT_5_NUM as unit5Num,
        UNIT_6_NUM as unit6Num,
        UNIT_7_NUM as unit7Num,
        UNIT_8_NUM as unit8Num,
        ORG_7_NUM as org7Num,
        ORG_8_NUM as org8Num
      from pad_sy_unit_hc
      order by street_off_flag, admin_order, unit_order`;
    return this.db.select(sql);
  }

  // 获取宝安区机关编制使用情况表
  listJgUnitHc() {
    const sql = `
      select
        street_off_flag as streeOffFlag,
        unit_name as unitName,
        BZ_NUM as bzNum,
        XZ_NUM as xzNum,
        XZGL_NUM as xzglNum,
        XZZF_NUM as xzzfNum,
        ZF_NUM as zfNum,
        INFACT_NUM as infactNum,
        FREE_NUM as freeNum,
        YL_NUM as ylNum,
        KY_NUM as kyNum,
        GYYE_NUM as gyyeNum,
        UNITZZLD_NUM as unitzzldNum,
        UNITFZLD_NUM as unitfzldNum,
        ORG_FCJ_LD_NUM as orgFcjLdNum,
        ORG_ZKJ_LD_NUM as orgZkjLdNum,
        ORG_FKJ_LD_NUM as orgFkjLdNum
      from pad_jg_unit_hc
      order by street_off_flag, order_of_all`;
    return this.db.select(sql);
  }
}
