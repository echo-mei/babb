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
        UNIT_CATEGORY_NAME as unitCategoryName
      FROM pad_base_unit
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
          '总计' as unitCategoryName,
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
      GROUP BY UNIT_KIND, LEVEL_CODE`;
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

  // 获取单位名称
  getUnitName(): Promise<any> {
    const sql = `SELECT UNIT_NAME, UNIT_OID
    FROM PAD_BASE_UNIT`;
    return this.db.select(sql);
  }
  // 以下获取综合查询条件
  // 系统类别
  getSyetem(): Promise<any> {
    const sql = `SELECT UNIT_CATEGORY_CODE, UNIT_CATEGORY_CODE as dicItemCode, UNIT_CATEGORY_NAME as dicItemName
    FROM PAD_BASE_UNIT group by UNIT_CATEGORY_CODE`;
    return this.db.select(sql);
  }

  // 单位性质
  getUnitXz(): Promise<any> {
    const sql = `SELECT UNIT_KIND, UNIT_KIND as dicItemCode, UNIT_KIND_NAME as dicItemName
    FROM PAD_BASE_UNIT group by UNIT_KIND`;
    return this.db.select(sql);
  }

  // 机构类别
  getJiGou(): Promise<any> {
    const sql = `SELECT LEVEL_CODE, LEVEL_CODE as dicItemCode, LEVEL_NAME as dicItemName
    FROM PAD_BASE_UNIT group by LEVEL_CODE`;
    return this.db.select(sql);
  }

  // 编制类别
  getWave(): Promise<any> {
    const sql = `SELECT HC_OID, HC_OID as dicItemCode, HC_NAME as dicItemName
    FROM PAD_BASE_UNIT_HC group by HC_OID`;
    return this.db.select(sql);
  }

  // 经费形式
  getFeeStyle(): Promise<any> {
    const sql = `SELECT BUDGET_FROM_CODE, BUDGET_FROM_CODE as dicItemCode, BUDGET_FROM_NAME as dicItemName
    FROM PAD_BASE_UNIT group by BUDGET_FROM_CODE`;
    return this.db.select(sql);
  }

  // 事业单位分类
  getWorkUnit(): Promise<any> {
    const sql = `SELECT UNIT_TYPE_BIZ_CODE, UNIT_TYPE_BIZ_CODE as dicItemCode, UNIT_TYPE_BIZ_NAME as dicItemName
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
        WHERE UNIT_NAME like '%${key}%' AND (UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where  cur_count >= ${sNum} and cur_count <= ${bNum}))`
        return this.db.select(defaultSql);
      } else {
        let defaultSql = `
        SELECT
          UNIT_NAME,
          UNIT_OID
        FROM PAD_BASE_UNIT
        WHERE UNIT_NAME like '%${key}%'`
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
      // 循环itemlist[0] 然后取单个进行拼接
      if (itemList[0].length > 0) { // UNIT_CATEGORY_CODE
        itemList[0].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR UNIT_CATEGORY_CODE IN (${item.dicItemCode})` : ` UNIT_CATEGORY_CODE IN (${item.dicItemCode})`;
        })
      }
      if (itemList[1].length > 0) { // UNIT_KIND
        itemList[1].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR UNIT_KIND IN (${item.dicItemCode})` : ` UNIT_KIND IN (${item.dicItemCode})`;
        })
      }
      if (itemList[2].length > 0) { // LEVEL_CODE
        itemList[2].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR LEVEL_CODE IN (${item.dicItemCode})` : ` LEVEL_CODE IN (${item.dicItemCode})`;
        })
      }

      if (itemList[4].length > 0) { // LEVEL_CODE
        itemList[4].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR BUDGET_FROM_CODE IN (${item.dicItemCode})` : ` BUDGET_FROM_CODE IN (${item.dicItemCode})`;
        })
      }
      if (itemList[5].length > 0) { // LEVEL_CODE
        itemList[5].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR UNIT_TYPE_BIZ_CODE IN (${item.dicItemCode})` : ` UNIT_TYPE_BIZ_CODE IN (${item.dicItemCode})`;
        })
      }
      if (itemList[3].length > 0) { // LEVEL_CODE
        itemList[3].forEach((item, index, list) => {
          sql2 += sql2 ? ` OR UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${item.dicItemCode}) and cur_count >= ${sNum} and cur_count <= ${bNum})` : ` UNIT_OID IN (select UNIT_OID from PAD_BASE_UNIT_HC where HC_OID IN (${item.dicItemCode}) and cur_count >= ${sNum} and cur_count <= ${bNum})`;
        })
      }
      let sqlAnd = `AND (`
      let sql1 = `)`;
      let sql3 = sql + sql2 + sql1;
      console.log(sql3)
      return this.db.select(sql3);
    }
  }

  // 获取单位具体信息
  getUnit(oid): Promise<any> {
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
        FROM pad_base_unit  WHERE UNIT_OID=${oid}
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows[0]);
      }).catch(reject);
    });
  }

  // 获取下设单位
  getChildUnit(oid): Promise<any> {
    const sql = `
    SELECT COUNT(UNIT_OID) as count FROM pad_base_unit WHERE ADMIN_UNIT_OID=${oid}
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows[0]);
      }).catch(reject);
    });
  }

  // 获取本单位编制统计
  getUnitHc(oid): Promise<any> {
    const sql = `
    SELECT
      unitOid,
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
        UNIT_OID as unitOid,
        HC_OID as hcOid,
        HC_NAME as hcName,
        SUM(CUR_COUNT) as curCount,
        SUM(CUR_LOCK_COUNT) as curLockCount,
        SUM(INFACT_COUNT) as infactCount,
        SUM(FRZ_COUNT) as frzCount,
        SUM(FREE_COUNT) as freeCount
      FROM pad_base_unit_hc WHERE UNIT_OID=${oid} GROUP BY HC_OID
    )
    UNION ALL
    SELECT
      UNIT_OID as unitOid,
      HC_OID as hcOid,
      HC_NAME as hcName,
      SUM(CUR_COUNT) as curCount,
      SUM(CUR_LOCK_COUNT) as curLockCount,
      SUM(INFACT_COUNT) as infactCount,
      SUM(FRZ_COUNT) as frzCount,
      SUM(FREE_COUNT) as freeCount
    FROM pad_base_unit_hc WHERE UNIT_OID=${oid} GROUP BY HC_OID
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位及其下设单位的编制统计
  getUnitHcAll(oid): Promise<any> {
    const sql = `
    SELECT
    unitOid,
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
      UNIT_OID as unitOid,
      HC_OID as hcOid,
      HC_NAME as hcName,
      SUM(CUR_COUNT) as curCount,
      SUM(CUR_LOCK_COUNT) as curLockCount,
      SUM(INFACT_COUNT) as infactCount,
      SUM(FRZ_COUNT) as frzCount,
      SUM(FREE_COUNT) as freeCount
    FROM pad_base_unit_hc WHERE UNIT_OID in (
      SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${oid} OR ADMIN_UNIT_OID=${oid}
    ) GROUP BY HC_OID
  )
  UNION ALL
  SELECT
    UNIT_OID as unitOid,
    HC_OID as hcOid,
    HC_NAME as hcName,
    SUM(CUR_COUNT) as curCount,
    SUM(CUR_LOCK_COUNT) as curLockCount,
    SUM(INFACT_COUNT) as infactCount,
    SUM(FRZ_COUNT) as frzCount,
    SUM(FREE_COUNT) as freeCount
  FROM pad_base_unit_hc WHERE UNIT_OID in (
    SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${oid} OR ADMIN_UNIT_OID=${oid}
  ) GROUP BY HC_OID
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取单位编制实有人员
  getUnitHcInfact(unitOid, hcOid) {
    let sql;
    if (hcOid) {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        SEX_CODE_NAME as sexCodeName,
        UNIT_NAME as unitName,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as administrativeDutyLevelName,
        DUTY_ATTRIBUTE_BZ_NAME as dutyAttributeBzName,
        D_POSITION_TYPE_NAME as dPositionTypeName
      FROM pad_person WHERE UNIT_OID=${unitOid} AND D_POSITION_TYPE=${hcOid}
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
      FROM pad_person WHERE UNIT_OID=${unitOid} AND (D_POSITION_TYPE is not NULL)
      `;
    }
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取单位及下设单位编制实有人员
  getUnitHcInfactAll(unitOid, hcOid) {
    let sql;
    if (hcOid) {
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        SEX_CODE_NAME as sexCodeName,
        UNIT_NAME as unitName,
        ADMINISTRATIVE_DUTY_LEVEL_NAME as administrativeDutyLevelName,
        DUTY_ATTRIBUTE_BZ_NAME as dutyAttributeBzName,
        D_POSITION_TYPE_NAME as dPositionTypeName
      FROM pad_person WHERE UNIT_OID in (
        SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${unitOid} OR ADMIN_UNIT_OID=${unitOid}
      ) AND D_POSITION_TYPE=${hcOid}
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
      FROM pad_person WHERE UNIT_OID in (
        SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${unitOid} OR ADMIN_UNIT_OID=${unitOid}
      ) AND (D_POSITION_TYPE is not NULL)
      `;
    }
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取单位编制冻结人员
  getUnitHcFrz(unitOid, hcOid) {
    let sql;
    if(hcOid){
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID=${unitOid} AND HC_OID=${hcOid}
      `;
    }else{
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID=${unitOid} AND (HC_OID is not NULL)
      `;
    }
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取单位及下设单位编制冻结人员
  getUnitHcFrzAll(unitOid, hcOid) {
    let sql;
    if(hcOid){
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID in (
        SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${unitOid} OR ADMIN_UNIT_OID=${unitOid}
      ) AND HC_OID=${hcOid}
      `;
    }else{
      sql = `
      SELECT
        UNIT_OID as unitOid,
        NAME as name,
        ID_NO as idNo,
        UNIT_NAME as unitName,
        ITEM_CODE_NAME as itemCodeName,
        CREATE_DATE as createDate
      FROM pad_hc_freeze_info WHERE UNIT_OID in (
        SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${unitOid} OR ADMIN_UNIT_OID=${unitOid}
      ) AND (HC_OID is not NULL)
      `;
    }
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }


  // 获取本单位职数统计
  getUnitLeader(oid): Promise<any> {
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
        SELECT
          UNIT_OID as unitOid,
          DUTY_ATTRIBUTE as dutyAttribute,
          DUTY_ATTRIBUTE_NAME as dutyAttributeName,
          DUTY_LEVEL as dutyLevel,
          DUTY_LEVEL_NAME as dutyLevelName,
          SUM(CUR_COUNT) as curCount,
          SUM(INFACT_COUNT) as infactCount,
          SUM(FREE_COUNT) as freeCount
        FROM pad_base_unit_leader WHERE UNIT_OID=${oid} GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
      ) GROUP BY dutyAttribute
    )
    UNION
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
    SELECT
      UNIT_OID as unitOid,
      DUTY_ATTRIBUTE as dutyAttribute,
      DUTY_ATTRIBUTE_NAME as dutyAttributeName,
      DUTY_LEVEL as dutyLevel,
      DUTY_LEVEL_NAME as dutyLevelName,
      SUM(CUR_COUNT) as curCount,
      SUM(INFACT_COUNT) as infactCount,
      SUM(FREE_COUNT) as freeCount
    FROM pad_base_unit_leader WHERE UNIT_OID=${oid} GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
    ) GROUP BY dutyAttribute
    UNION
    SELECT
      UNIT_OID as unitOid,
      DUTY_ATTRIBUTE as dutyAttribute,
      DUTY_ATTRIBUTE_NAME as dutyAttributeName,
      DUTY_LEVEL as dutyLevel,
      DUTY_LEVEL_NAME as dutyLevelName,
      SUM(CUR_COUNT) as curCount,
      SUM(INFACT_COUNT) as infactCount,
      SUM(FREE_COUNT) as freeCount
    FROM pad_base_unit_leader WHERE UNIT_OID=${oid} GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql).then(rows => {
        resolve(rows);
      }).catch(reject);
    });
  }

  // 获取本单位职数统计
  getUnitLeaderAll(oid): Promise<any> {
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
      SELECT
        UNIT_OID as unitOid,
        DUTY_ATTRIBUTE as dutyAttribute,
        DUTY_ATTRIBUTE_NAME as dutyAttributeName,
        DUTY_LEVEL as dutyLevel,
        DUTY_LEVEL_NAME as dutyLevelName,
        SUM(CUR_COUNT) as curCount,
        SUM(INFACT_COUNT) as infactCount,
        SUM(FREE_COUNT) as freeCount
      FROM pad_base_unit_leader WHERE UNIT_OID in (
        SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${oid} OR ADMIN_UNIT_OID=${oid}
      ) GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
    ) GROUP BY dutyAttribute
  )
  UNION
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
  SELECT
    UNIT_OID as unitOid,
    DUTY_ATTRIBUTE as dutyAttribute,
    DUTY_ATTRIBUTE_NAME as dutyAttributeName,
    DUTY_LEVEL as dutyLevel,
    DUTY_LEVEL_NAME as dutyLevelName,
    SUM(CUR_COUNT) as curCount,
    SUM(INFACT_COUNT) as infactCount,
    SUM(FREE_COUNT) as freeCount
  FROM pad_base_unit_leader WHERE UNIT_OID in (
      SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${oid} OR ADMIN_UNIT_OID=${oid}
    ) GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
  ) GROUP BY dutyAttribute
  UNION
  SELECT
    UNIT_OID as unitOid,
    DUTY_ATTRIBUTE as dutyAttribute,
    DUTY_ATTRIBUTE_NAME as dutyAttributeName,
    DUTY_LEVEL as dutyLevel,
    DUTY_LEVEL_NAME as dutyLevelName,
    SUM(CUR_COUNT) as curCount,
    SUM(INFACT_COUNT) as infactCount,
    SUM(FREE_COUNT) as freeCount
  FROM pad_base_unit_leader WHERE UNIT_OID in (
      SELECT UNIT_OID FROM pad_base_unit WHERE UNIT_OID=${oid} OR ADMIN_UNIT_OID=${oid}
    ) GROUP BY DUTY_ATTRIBUTE,DUTY_LEVEL ORDER BY DUTY_ATTRIBUTE
    `;
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
    WHERE a.PARENT_UNIT_OID=${oid} AND a.UNIT_KIND IS NOT 3 group by a.unit_oid ORDER BY a.ORDER_OF_ALL
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
}
