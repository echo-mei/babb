import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, DbTransaction } from '@ionic-native/sqlite';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { INIT_SQL } from './sql';

@Injectable()
export class DatabaseProvider {

  private win: any = window;

  private DB_NAME = 'BA_DATA.db';
  private DB_LOCATION = 'default';

  private db: SQLiteObject;

  constructor(
    protected sqlite: SQLite,
    protected sqliteDbCopy: SqliteDbCopy,
    protected file: File,
    protected platform: Platform
  ) {
  }

  initDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.platform.is('cordova')) {
        this.sqliteDbCopy.checkDbOnStorage(this.DB_NAME, this.file.externalRootDirectory).then(
          () => {
            this.sqliteDbCopy.copyDbFromStorage(this.DB_NAME, 0, this.file.externalRootDirectory+this.DB_NAME, false).then(
              () => {
                this.file.removeFile(this.file.externalRootDirectory, this.DB_NAME);
                this.openDatabase().then(resolve).catch(reject);
              }
            ).catch(
              e => {
                console.log('复制db失败', e);
                reject(e);
              }
            )
          }
        ).catch(
          (e) => {
            console.log('========检查源db出错========', e);
            this.openDatabase().then(resolve).catch(reject);
          }
        );
      }else {
        this.db = this.win.openDatabase(this.DB_NAME, '1.0', this.DB_NAME, 10 * 1024 * 1024);

        // String.prototype.trim = function() {
        //   return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        // }
        // const sqls = INIT_SQL.split(';');
        // sqls.forEach((sql, i) => {
        //   this.executeSql(sql+';').then(res => {
        //     console.log(i);
        //     if(i==sqls.length-1) {
        //       console.log('执行完毕');
        //       resolve();
        //     }
        //   }).catch(err => {
        //     console.log(sql, err);
        //     if(i==sqls.length-1) {
        //       console.log('执行完毕');
        //       resolve();
        //     }
        //   })
        // });

        resolve({});
      }
    });
  }

  openDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: this.DB_NAME,
        location: this.DB_LOCATION
      }).then(db => {
        this.db = db;
        resolve(db);
      }).catch(err => {
        reject(err);
        console.log('打开数据库失败', err);
      });
    });
  }

  executeSql(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: DbTransaction) => {
        tx.executeSql(sql, params, (tx, res) => {
          resolve(res);
        }, (tx, err) => {
          console.log('sql执行错误', err);
          reject(err);
        });
      });
    });
  }

  select(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.executeSql(sql, params).then(res => {
        let rows = [];
        for(let i=0; i<res.rows.length; i++) {
          rows.push(res.rows.item(i));
        }
        resolve(rows);
      }).catch(reject);
    });
  }

}
