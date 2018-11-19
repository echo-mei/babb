import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { ModalController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';

@Injectable()
export class FileProvider {

  constructor(
    private transfer: FileTransferObject,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private fileOpener: FileOpener,
    private file: File
  ) {
    //判断文件夹是否存在 不存在创建 这里必须是外部文件 巨坑无比
    this.file.checkDir(this.file.externalDataDirectory, "").then(_ => console.log('Directory exists')).catch(err => {
      this.file.createDir(this.file.externalDataDirectory, "", true).then(result => {
        console.log("success")
      }).catch(err => {
        console.log("err:" + JSON.stringify(err))
      })
    });
  }

  /**
   * 上传文件
   * @param imgPath 文件路径
   * @param serverUrl 接口地址
   */
  upload(imgPath, serverUrl): Promise<any> {
    let options: FileUploadOptions = {
      fileKey: 'pic',//表单name
      fileName: imgPath.substring(imgPath.lastIndexOf("/") + 1, imgPath.length),
      httpMethod: 'post',
      params: {}
    }
    return new Promise((resolve, reject) => {
      this.transfer.upload(imgPath, serverUrl, options)
        .then((data) => {
          resolve(JSON.parse(data['response']));
        }, (err) => {
          reject(err)
        })
    });

  }

  /**
   * 下载文件
   * @param path
   * @param fileName
   */
  download(path: string, fileName: string) {
    this.transfer.download(path, this.file.externalDataDirectory + fileName, true).then((entry) => {
      this.openFile(decodeURI(entry.toURL()))
    }, (error) => {
      console.log("error:" + JSON.stringify(error))
    });
  }


  /**
   * 调起文件选择器选择文件
   */
  chooseFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fileChooser.open().then(uri => {
        this.resolveUri(uri).then(path => {
          resolve(path);
        })
      }).catch(e => {
        reject(e);
      })
    })
  }

  /**
   * 解析uri
   * @param uri
   */
  resolveUri(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.filePath.resolveNativePath(uri).then(filePath => {
        resolve(filePath);
      }).catch(err => {
        reject(err);
      });
    })

  }

  /**
   * 打开文件
   * @param path
   */
  openFile(path: string) {
    this.fileOpener.open(path, this.getFileMimeType(path.substring(path.lastIndexOf(".") + 1, path.length)))
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', JSON.stringify(e)));
  }

  /**
   * 获取文件类型
   * @param fileType
   */
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

}
