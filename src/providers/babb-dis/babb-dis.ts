
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
/*
  Generated class for the BabbDisProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BabbDisProvider {

  constructor(public db: DatabaseProvider) {
    console.log('Hello BabbDisProvider Provider');
  }
  //获取编制情况表
  getPreparationTable(): Promise<any> {
    const sql = `
        select * from PAD_HC_STATISTICS  ORDER BY HC_OID 
        `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        })
    });
  }
  //获取数的总和
  getPreparationSum(statisticsType, field): Promise<any> {
    const sql = `
      select sum(CUR_COUNT) as curTotal,
      sum(CUR_LOCK_COUNT) as curLockTotal,
      sum(INFACT_COUNT) as infactTotal,
      sum(FRZ_COUNT)  as frzTotal,
      sum(FREE_COUNT) as freeTotal
      from PAD_HC_STATISTICS WHERE STATISTICS_TYPE=${statisticsType} AND HC_NAME IN (${field})
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        })
    });
  }
  //获取数类别的数组
  getPreparationCountTypeSum(statisticsType, countType): Promise<any> {
    const sql = `
  select ${countType},HC_OID
  from PAD_HC_STATISTICS WHERE STATISTICS_TYPE=${statisticsType} ORDER BY HC_OID
  `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        })
    });
  }
  //获取STATISTICS_TYPE和DUTY_ATTRIBUTE的数据
  getLeaderField(unitKind, dutyAttribute): Promise<any> {
    const sql = `
        select * from PAD_LEADER_STATISTICS WHERE UNIT_KIND=${unitKind} AND DUTY_ATTRIBUTE=${dutyAttribute} ORDER BY DUTY_LEVEL
        `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  //获取小计的数量
  getOffsmallCount(unitKind, statisticsType, dutyAttribute): Promise<any> {
    const sql = `
      select sum(CUR_COUNT) as curCount,
      SUM(INFACT_COUNT) as infactCount,
      SUM(FREE_COUNT) as freeCount from PAD_LEADER_STATISTICS 
      WHERE UNIT_KIND=${unitKind} and STATISTICS_TYPE=${statisticsType} and DUTY_ATTRIBUTE=${dutyAttribute}
      `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  getOffcountType(unitKind, statisticsType): Promise<any> {
    const sql = `
    select sum(CUR_COUNT) as curCount,
    SUM(INFACT_COUNT) as infactCount,
    SUM(FREE_COUNT) as freeCount from PAD_LEADER_STATISTICS 
    WHERE UNIT_KIND=${unitKind} and STATISTICS_TYPE=${statisticsType}
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          console.log(rows[0])
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  //获取每行各个字段和的数据
  getOffFieldData(unitKind, statisticsType, dutyAttribute): Promise<any> {
    const sql = `
    select DUTY_LEVEL,CUR_COUNT,INFACT_COUNT,FREE_COUNT from PAD_LEADER_STATISTICS where UNIT_KIND=${unitKind} 
    and STATISTICS_TYPE=${statisticsType} 
    and DUTY_ATTRIBUTE=${dutyAttribute} ORDER BY DUTY_LEVEL;
    `;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        })
    });
  }
}
