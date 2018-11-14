import { Injectable } from '@angular/core';

@Injectable()
export class TreeProvider {

  fields = {
    id: 'id',
    parentId: 'parentId',
    children: 'children'
  };

  nodes: any[];

  buildTree(nodes: any[], fields?: {
    id?: string,
    parentId?: string,
    children?: string
  }) {
    this.fields = Object.assign(this.fields, fields);
    this.nodes = nodes;
    return this.buildJSONTree();
  }

  private buildJSONTree() {
    let rootNodes = this.getRootNodes();
    rootNodes.forEach((node) => {
      this.buildChildNodes(node);
    });
    return rootNodes;
  }

  private buildChildNodes(node) {
    let children = this.getChildNodes(node);
    children.forEach((child) => {
      this.buildChildNodes(child);
    });
    node[this.fields.children] = children;
  }

  private getChildNodes(node) {
    let childNodes = [];
    this.nodes.forEach((child) => {
      if(node[this.fields.id]==child[this.fields.parentId] && child[this.fields.id]!=node[this.fields.id]) {
        childNodes.push(child);
      }
    });
    return childNodes;
  }

  private getRootNodes() {
    let rootNodes = [];
    this.nodes.forEach((node) => {
      if(!node[this.fields.parentId]) {
        rootNodes.push(node);
      }
    });
    return rootNodes;
  }

}
