import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-three-file',
  templateUrl: 'three-file.html',
})
export class ThreeFilePage {

  fileList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileOpener: FileOpener,
  ) {
    this.initData();
  }

  initData() {
    this.fileList = [
      {
        'fileName': 'a.doc',
        'fileTitle': '中共深圳至宝安区委组织部三定文件'
      },
      {
        'fileName': 'b.doc',
        'fileTitle': '中共深圳市宝安区委组织部三定文件中共深圳市宝安区委组织部三定文件室'
      },
      {
        'fileName': 'c.doc',
        'fileTitle': '中共深圳市宝安区委组织部三定文件'
      }
    ]
  }

  getFileMimeType(fileType: string): string {
    let mimeType: string = '';

    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }

  fileOpen(fileName) {
    let fileFirst = 'fileDir';
    let threeDir = 'threeDir';
    let fileType = fileName.fileName.split('.')[1];
    let mineType = this.getFileMimeType(fileType);
    this.file.checkDir(this.file.externalRootDirectory, fileFirst).then(
      res => {
        this.file.checkDir(this.file.externalRootDirectory+fileFirst+'/', threeDir).then(
          res => {
            this.fileOpener.open(this.file.externalRootDirectory+fileFirst+'/'+threeDir+'/'+fileName.fileName, mineType).then(
              data => {
                console.log('open success')
              }
            ).catch(
              error => {
                console.log('open fail', this.file.dataDirectory + 'icon.png', error)
              }
            )
          }
        ).catch(
          res=>{
            alert('No Such Dirctory, contact the adminer');
            // this.file.createDir(this.file.externalRootDirectory+fileFirst, threeDir, false).then(

            // ).catch(res=>{
            //   console.log(res);
            // });
          }
        );

      //   this.file.checkDir(this.file.externalRootDirectory+'/'+fileFirst, historyDir).then(
      //     res => {
      //       alert('进来历史沿革文件夹目录了');
      //     }
      //   ).catch(
      //     res=>{
      //       alert('没有历史沿革文件夹目录');
      //       this.file.createDir(this.file.externalRootDirectory+'/'+fileFirst, historyDir, false);
      //     }
      //   )
      }
    ).catch(
      err => {
        alert('No Such dir')
        this.file.createDir(this.file.externalRootDirectory, fileFirst, false);
      }
    )
  }

}
