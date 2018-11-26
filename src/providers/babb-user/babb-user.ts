import { Injectable } from '@angular/core';
import { UserDatabaseProvider } from '../database/database';

@Injectable()
export class BabbUserProvider {

  constructor(public db: UserDatabaseProvider) {
  }

  // 登陆
  login(userId, password): Promise<any> {
    const sql = `
      SELECT
        IDENTIFY_ID as identifyId,
        USER_NAME as userName,
        USER_ID as userId,
        USER_TYPE as userType
      FROM PAD_USERS
      WHERE
        USER_ID = ?
      AND
        PASSWORD = ?`;
    return new Promise((resolve, reject) => {
      this.db.select(sql, [userId, password])
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  // 获取旧密码
  getOldPassword(userId): Promise<any> {
    const sql = `
    SELECT PASSWORD as password FROM PAD_USERS WHERE USER_ID='${userId}'`;
    return new Promise((resolve,reject) => {
      this.db.select(sql)
      .then(res => {
        resolve(res[0]);
      })
      .catch(err => {
        reject(err);
      });
    })
  }

  // 修改密码
  modifyPassword(userId, password): Promise<any> {
    const sql = `
      UPDATE PAD_USERS SET PASSWORD = ? WHERE USER_ID = ?`;
    return new Promise((resolve, reject) => {
      this.db.executeSql(sql, [password, userId])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // 获取所有用户
  getUsers(): Promise<any> {
    const sql = `
      SELECT
        IDENTIFY_ID as identifyId,
        USER_ID as userId,
        USER_NAME as userName,
        USER_TYPE as userType
      FROM PAD_USERS
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

  // 获取普通用户
  getExceptMeUsers(identifyId): Promise<any> {
    const sql = `
      SELECT
        IDENTIFY_ID as identifyId,
        USER_ID as userId,
        USER_NAME as userName,
        USER_TYPE as userType
      FROM PAD_USERS
      WHERE IDENTIFY_ID IS NOT ${identifyId}
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

  // 新增普通用户
  addUser(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let index;
      this.getUsers().then(res => {
        index = res[res.length-1].identifyId+1;
        const sql = `
        INSERT INTO PAD_USERS (IDENTIFY_ID,USER_ID,PASSWORD,USER_TYPE,USER_NAME) VALUES (${index},'${params.userId}','88888888',${params.userType},'${params.userName}')`;
        this.db.executeSql(sql)
          .then(res => {
            resolve({ res });
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  }

  // 删除普通用户
  deleteUser(userId): Promise<any> {
    const sql = `
    DELETE FROM PAD_USERS WHERE USER_ID = '${userId}'`;
    return new Promise((resolve, reject) => {
      this.db.executeSql(sql)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // 更新普通用户用户名
  updateUser(params): Promise<any> {
    const sql = `
    UPDATE PAD_USERS SET USER_ID ='${params.userId}',USER_NAME ='${params.userName}',USER_TYPE=${params.userType} WHERE IDENTIFY_ID = ${params.identifyId}`;
    return new Promise((resolve, reject) => {
      this.db.executeSql(sql)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // 根据用户名查找用户
  getUser(userId): Promise<any> {
    const sql = `
    SELECT * FROM PAD_USERS WHERE USER_ID = '${userId}'`;
    return new Promise((resolve, reject) => {
      this.db.select(sql)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
