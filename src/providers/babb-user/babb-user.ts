import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class BabbUserProvider {

  constructor(public db: DatabaseProvider) {
  }

  // 登陆
  login(userName, password): Promise<any> {
    const sql = `
      SELECT
        USER_NAME,
        USER_ID
      FROM PAD_USERS
      WHERE
        USER_NAME = ?
      AND
        PASSWORD = ?
      AND
        USER_STATUS = 1`;
    return new Promise((resolve, reject) => {
      this.db.select(sql, [userName, password])
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  // 修改密码
  modifyPassword(userName, password): Promise<any> {
    const sql = `
      UPDATE PAD_USERS SET PASSWORD = ? WHERE USER_NAME = ?`;
    return new Promise((resolve, reject) => {
      this.db.executeSql(sql, [password, userName])
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}
