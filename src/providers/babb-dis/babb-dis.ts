
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class BabbDisProvider {

  constructor(public db: DatabaseProvider) {
  }

  // 编制情况表
  getHcTable(): Promise<any> {
    const sql = `
      select
        -1 as hcOid,
        '合计' as hcName,
        SUM(hjCurCount) AS hjCurCount,
        SUM(hjCurLockCount) AS hjCurLockCount,
        SUM(hjInfactCount) AS hjInfactCount,
        SUM(hjFrzCount) AS hjFrzCount,
        SUM(hjFreeCount) AS hjFreeCount,
        SUM(qzCurCount) AS qzCurCount,
        SUM(qzCurLockCount) AS qzCurLockCount,
        SUM(qzInfactCount) AS qzInfactCount,
        SUM(qzfrzCount) AS qzFrzCount,
        SUM(qzFreeCount) AS qzFreeCount,
        SUM(jdCurCount) AS jdCurCount,
        SUM(jdCurLockCount) AS jdCurLockCount,
        SUM(jdInfactCount) AS jdInfactCount,
        SUM(jdfrzCurCount) AS jdFrzCurCount,
        SUM(jdFreeCount) AS jdFreeCount
      from (
      select
          hc_oid as hcOid,
          hc_name as hcName,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjFrzCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjFreeCount,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzFrzCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzFreeCount,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdFrzCurCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdFreeCount
      from pad_hc_statistics t group by hc_oid
      )
      UNION ALL
      select
          hc_oid as hcOid,
          hc_name as hcName,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjFrzCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 1 AND t1.hc_oid=t.Hc_oid) AS hjFreeCount,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzFrzCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 2 AND t1.hc_oid=t.Hc_oid) AS qzFreeCount,
          (SELECT SUM(cur_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdCurCount,
          (SELECT SUM(cur_lock_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdCurLockCount,
          (SELECT SUM(infact_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdInfactCount,
          (SELECT SUM(frz_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdFrzCurCount,
          (SELECT SUM(free_count) FROM pad_hc_statistics t1 where t1.statistics_Type = 3 AND t1.hc_oid=t.Hc_oid) AS jdFreeCount
      from pad_hc_statistics t group by hc_oid`;
    return this.db.select(sql);
  }

  // 按条件获取单位领导职数
  getLeaderCountListByCondition(unitKind, dutyAttribute) {
    const sql = `
      select * from (
        select
          -1 as duteLevel,
          '小计' as duteLevelName,
          sum(hjCurCount) as hjCurCount,
          sum(hjInfactCount) as hjInfactCount,
          sum(hjFreeCount) as hjFreeCount,
          sum(qzCurCount) as qzCurCount,
          sum(qzInfactCount) as qzInfactCount,
          sum(qzFreeCount) as qzFreeCount,
          sum(jdCurCount) as jdCurCount,
          sum(jdInfactCount) as jdInfactCount,
          sum(jdFreeCount) as jdFreeCount
        from (
          select
            duty_level as duteLevel,
            duty_level_name as duteLevelName,
            (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjCurCount,
            (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjInfactCount,
            (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjFreeCount,
            (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzCurCount,
            (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzInfactCount,
            (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzFreeCount,
            (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdCurCount,
            (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdInfactCount,
            (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdFreeCount
          from pad_leader_statistics t
          where unit_kind = ${unitKind}
          and duty_attribute = '${dutyAttribute}'
          group by duty_level
        )
        UNION ALL
        select
          duty_level as duteLevel,
          duty_level_name as duteLevelName,
          (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjCurCount,
          (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjInfactCount,
          (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS hjFreeCount,
          (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzCurCount,
          (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzInfactCount,
          (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS qzFreeCount,
          (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdCurCount,
          (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdInfactCount,
          (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind} and t1.duty_attribute = '${dutyAttribute}' AND t1.duty_level=t.duty_level) AS jdFreeCount
        from pad_leader_statistics t
        where unit_kind = ${unitKind}
        and duty_attribute = '${dutyAttribute}'
        group by duty_level
      )
      where hjCurCount != 0 and hjCurCount is not null
      or (hjInfactCount != 0 and hjInfactCount is not null)
      or (hjFreeCount != 0 and hjFreeCount is not null)
      or (qzCurCount != 0 and qzCurCount is not null)
      or (qzInfactCount != 0 and qzInfactCount is not null)
      or (qzFreeCount != 0 and qzFreeCount is not null)
      or (jdCurCount != 0 and jdCurCount is not null)
      or (jdInfactCount != 0 and jdInfactCount is not null)
      or (jdFreeCount != 0 and jdFreeCount is not null)`;
    return this.db.select(sql);
  }

  // 获取单位领导总职数
  getLeaderSum(unitKind) {
    const sql = `
      select
        -1 as duteLevel,
        '总计' as duteLevelName,
        (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind}) AS hjCurCount,
        (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind}) AS hjInfactCount,
        (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 1 and t1.unit_kind = ${unitKind}) AS hjFreeCount,
        (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind}) AS qzCurCount,
        (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind}) AS qzInfactCount,
        (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 2 and t1.unit_kind = ${unitKind}) AS qzFreeCount,
        (SELECT SUM(cur_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind}) AS jdCurCount,
        (SELECT SUM(infact_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind}) AS jdInfactCount,
        (SELECT SUM(free_count) FROM pad_leader_statistics t1 where t1.statistics_Type = 3 and t1.unit_kind = ${unitKind}) AS jdFreeCount
      from pad_leader_statistics t
      where unit_kind = ${unitKind}
      group by unit_kind`;
    return this.db.select(sql);
  }

  // 获取用人情况表
  getPersonStatistics(yeType) {
    const sql = `
      select
        -1 as personType,
        '合计' as personTypeName,
        sum(hjCurCount) as hjCurCount,
        sum(qzCurCount) as qzCurCount,
        sum(jdCurCount) as jdCurCount
      from (
        select
          person_type as personType,
          person_type_name as personTypeName,
          (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 1 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS hjCurCount,
          (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 2 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS qzCurCount,
          (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 3 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS jdCurCount
        from pad_person_statistics t
        where ye_type = ${yeType}
        group by person_type
      )
      union all
      select
        person_type as personType,
        person_type_name as personTypeName,
        (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 1 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS hjCurCount,
        (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 2 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS qzCurCount,
        (SELECT SUM(cur_count) FROM pad_person_statistics t1 where t1.statistics_Type = 3 and t1.ye_type = ${yeType} and t1.person_type = t.person_type) AS jdCurCount
      from pad_person_statistics t
      where ye_type = ${yeType}
      group by person_type`;
    return this.db.select(sql);
  }
}
