/**
 * 参数：
 * childrenField [string] children的字段名
 * width [number] 宽度
 * height [number] 高度
 * direction ['l2r'|'t2b'] 方向
 * scalable [boolean] 是否可缩放
 * maxScale [number] 最大放大倍数
 * minScale [number] 最小缩小倍数
 * canMove [boolean] 可拖拽
 * canAddNode [boolean] 是否可添加节点
 * editNodeTpl [(nodeData)] 自定义添加|修改模板
 * addNodeData [()] 自定义添加数据
 * editNodeData [()] 自定义修改节点数据
 * showContent [boolean] 是否展示节点内容
 * showContentEvent ['click'|'hover'] 展示|隐藏节点内容的鼠标事件
 * renderCaption 表格caption渲染
 * renderTitle [(nodeData)] 节点标题渲染函数
 * renderContent [(nodeData)] 节点内容渲染函数
 * titleStyle [(nodeData)] 节点标题样式
 * contentStyle [(nodeData)] 节点内容样式
 * data [Object] 数据
 *  data属性（data中属性优先级高于插件参数）：
 *      * title 节点标题
 *      * content 节点内容
 *      * children 子节点数组
 *      * showContent 是否展示节点内容
 * 方法：
 * exportImage() 导出图片
 * changeDirection(['l2r'|'t2b']) 改变方向
 * toggleDirection() 切换方向
 * getData() 获取当前数据
 */
function Orgtree(options) {
  var defaults = {
    childrenField: 'children',
    width: 1000,
    height: 500,
    direction: 't2b',
    scalable: true,
    maxScale: 2,
    minScale: 0.5,
    canMove: true,
    canAddNode: true,
    canDeleteNode: false,
    editNodeTpl: function (nodeData) {
      return $(
        '<input id="add-name" value="' + (nodeData ? nodeData.name : '') + '" style="width:150px" placeholder="请输入名称"/>' +
        '<input id="add-number" value="' + (nodeData ? nodeData.nameCount : '') + '" type="number" style="width:50px" placeholder="数量"/>'
      );
    },
    addNodeData: function () {
      return {
        name: $('#add-name').val(),
        nameCount: $('#add-number').val()
      }
    },
    editNodeData: function (nodeData) {
      nodeData.name = $('#add-name').val();
      nodeData.nameCount = $('#add-number').val();
    },
    editable: false,
    showContent: true,
    showContentEvent: 'click',
    renderCaption: null,
    renderTitle: null,
    renderContent: null,
    titleStyle: null,
    contentStyle: null,
    data: null
  };
  this.options = $.extend({}, defaults, options);
  $.extend(this, {
    $container: $(
      '<div class="orgtree-container">' +
      '<div class="orgtree"></div>' +
      '<div class="modal"><table><tr><td>' +
      '<div class="form">' +
      '<div class="form-header"><span class="form-title">修改</span><span class="close">×</span></div>' +
      '<div class="form-body"></div>' +
      '<div class="form-footer"><button class="sure">保存</button><button class="cancel">取消</button></div>' +
      '</div>' +
      '</td></tr></table></div>' +
      '</div>')
  });
  this.$el = this.$container.find('.orgtree');
  this.$modal = this.$container.find('.modal');
  this.init(true);
}
$.extend(Orgtree, {
  ieVersion: function () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if (fIEVersion == 7) {
        return 7;
      } else if (fIEVersion == 8) {
        return 8;
      } else if (fIEVersion == 9) {
        return 9;
      } else if (fIEVersion == 10) {
        return 10;
      } else {
        return 6;//IE版本<=7
      }
    } else if (isEdge) {
      return 'edge';//edge
    } else if (isIE11) {
      return 11; //IE11
    } else {
      return -1;//不是ie浏览器
    }
  }
});
Orgtree.prototype = {
  init: function (initEvents) {
    if (this.options.canMove) this.$container.css({ 'overflow': 'hidden' });
    this.$container.css({ width: this.options.width, height: this.options.height });
    this.$el.removeClass('l2r t2b').addClass(this.options.direction);
    this.renderTree(this.$el.empty(), this.options.data);
    this.initEvents();
  },
  initEvents: function () {
    var that = this;
    var scale = 1;
    if (this.options.canMove) {
      var moving = false;
      this.$el.on('mousedown', function (e) {
        var $this = $(this);
        if ($(e.target).closest('.node').length) {
          return;
        } else {
          $this.css('cursor', 'move');
          moving = true;
        }
        var startPositionLeft = $this[0].offsetLeft;
        var startPositionTop = $this[0].offsetTop;
        var startX = e.pageX;
        var startY = e.pageY;
        $(document).on('mousemove', function (ev) {
          var newX = ev.pageX;
          var newY = ev.pageY;
          $this.css({
            left: startPositionLeft + newX - startX,
            top: startPositionTop + newY - startY
          });
        });
      });
      $(document).on('mouseup', function () {
        if (moving) {
          that.$el.css('cursor', 'default');
          $(this).off('mousemove');
        }
      });
    }
    if (this.options.scalable) {
      this.$el.on('wheel', function (event) {
        // event.preventDefault();
        if ((event.originalEvent.deltaY < 0 && scale > that.options.maxScale) ||
          (event.originalEvent.deltaY > 0 && scale < that.options.minScale)) return;
        scale = (event.originalEvent.deltaY > 0 ? scale - 0.1 : scale + 0.1);
        that.$el.css('transform', 'scale(' + scale + ',' + scale + ')');
      });
    }
    this.$el.find('.toggle i').on('click', function () {
      var $this = $(this);
      var elements;
      if (that.options.direction == 't2b') {
        elements = $this.closest('tr').siblings('tr.lines')
          .add($this.closest('tr').siblings('tr.nodes'));
      } else if (that.options.direction == 'l2r') {
        elements = $this.closest('td').siblings('td.lines')
          .add($this.closest('td').siblings('td.nodes'))
          .add($this.closest('tr').siblings('tr'));
      }
      if ($this.text() == '-') {
        var opacity = 1;
        $this.text('+');
        var interval = setInterval(function () {
          elements.css({ 'opacity': opacity -= 0.2 });
          if (opacity < 0) {
            clearInterval(interval);
            elements.hide();
          }
        }, 100);
      } else {
        var opacity = 0;
        $this.text('-');
        elements.show();
        var interval = setInterval(function () {
          elements.css({ 'opacity': opacity += 0.2 });
          if (opacity > 1) {
            clearInterval(interval);
          }
        }, 100);
      }
    });
    this.$modal.find('.cancel').on('click', function () {
      that.closeModal();
    });
    this.$modal.find('.close').on('click', function () {
      that.closeModal();
    });
    $(document).on('click', function (e) {
      if ($(e.target).closest('.node').length) {
        return;
      } else {
        that.$el.find('.node').removeClass('active');
        return;
      }
    });
  },
  createNode: function (nodeData, parentData) {
    var that = this;
    var $node = $('<table class="node ' + (parentData ? '' : 'root') + '">');
    $node.data('nodeData', nodeData);
    $node.data('parentData', parentData);
    var childrenField = this.options.childrenField;
    var canAddNode = this.options.canAddNode;
    var canDeleteNode = this.options.canDeleteNode;
    var title = nodeData.title ? nodeData.title : [];
    if (this.options.renderTitle) {
      title = this.options.renderTitle(nodeData);
    }
    var titleStyle = '';
    if (this.options.titleStyle) {
      titleStyle = this.options.titleStyle(nodeData);
    }
    var content = nodeData.content ? nodeData.content : '';
    if (this.options.renderContent) {
      content = this.options.renderContent(nodeData);
    }
    var contentStyle = '';
    if (this.options.contentStyle) {
      contentStyle = this.options.contentStyle(nodeData);
    }
    var editable = nodeData.hasOwnProperty('editable') ? nodeData.editable : this.options.editable;
    var showContent = nodeData.hasOwnProperty('showContent') ? nodeData.showContent : this.options.showContent;
    $node.append(
      '<tr>' +
      (canAddNode ? '<td colspan="3" class="plus top-plus"><i>+</i></td>' : '') +
      '</tr>' +
      '<tr>' +
      (canAddNode ? '<td class="plus left-plus"><i>+</i></td>' : '') +
      '<td class="node-wrapper">' +
      '<div class="node-main"></div>' +
      (canDeleteNode ? '<i class="delete-node">×</i>' : '') +
      '</td>' +
      (canAddNode ? '<td class="plus right-plus"><i>+</i></td>' : '') +
      '</tr>' +
      '<tr>' +
      (canAddNode ? '<td colspan="3" class="plus bottom-plus"><i>+</i></td>' : '') +
      '</tr>');

    for (var i in title) {
      var nodeMainHtml = '<div class="title" style="' + titleStyle + '">' +
        '<div class="title-main">' + title[i] + '</div>' +
        (editable ? '<div class="title-tool"><i class="fa fa-pencil"></i></div>' : '') +
        '</div>';
      if (i < title.length-1) {
        nodeMainHtml += '<div class="title-line"></div>';
      }
      nodeMainHtml += '<div class="" style="' + contentStyle + '"><div class="content-main">' + content + '</div></div>';
      $node.find('.node-main').append(nodeMainHtml);
    }

    if (title == "") {
      $node.find('.node-main').append(
        '<div class="title" style="' + titleStyle + '">' +
        '<div class="title-main"></div>' +
        (editable ? '<div class="title-tool"><i class="fa fa-pencil"></i></div>' : '') +
        '</div>' +
        '<div class="content" style="' + contentStyle + '"><div class="content-main">' + content + '</div></div>');
    }

    if (!showContent) {
      $node.find('.content').hide();
    }
    $node.on('click', function () {
      that.$el.find('.node').removeClass('active');
      $(this).addClass('active');
    });
    if (this.options.showContentEvent == 'click') {
      $node.on('click', '.node-wrapper', function () {
        $(this).find('.content').toggle();
      });
    } else if (this.options.showContentEvent == 'hover') {
      $node.on('mouseover', '.node-wrapper', function () {
        $(this).find('.content').show();
      });
      $node.on('mouseout', '.node-wrapper', function () {
        if (!showContent)
          $(this).find('.content').hide();
      });
    }
    $node.on('click', '.plus', function (e) {
      e.stopPropagation();
      var $this = $(this);
      if (!$node.hasClass('active')) { return; }
      that.openModal();
      that.$modal.find('.sure').unbind('click').bind('click', function () {
        that.closeModal();
        var $parentNode;
        var index;
        var pend = 'after';
        var createNodeData = that.options.addNodeData();
        if (that.options.direction == 't2b') {
          if ($this.hasClass('bottom-plus')) {
            $parentNode = $node;
            index = nodeData[childrenField] ? nodeData[childrenField].length - 1 : 0;
          } else if ($this.hasClass('left-plus')) {
            $parentNode = $node.closest('.nodes').siblings('tr:eq(0)').find('.node:eq(0)');
            index = $.inArray(nodeData, parentData[childrenField]);
            pend = 'before';
          } else if ($this.hasClass('right-plus')) {
            $parentNode = $node.closest('.nodes').siblings('tr:eq(0)').find('.node:eq(0)');
            index = $.inArray(nodeData, parentData[childrenField]);
          }
          that.addChildNode($parentNode, index, createNodeData, pend);
        } else if (that.options.direction == 'l2r') {
          if ($this.hasClass('right-plus')) {
            $parentNode = $node;
            index = nodeData[childrenField] ? nodeData[childrenField].length - 1 : 0;
          } else if ($this.hasClass('top-plus')) {
            $parentNode = $node.closest('.nodes').closest('tbody').children('tr').eq(0).find('.node:eq(0)');
            index = $.inArray(nodeData, parentData[childrenField]);
            pend = 'before';
          } else if ($this.hasClass('bottom-plus')) {
            $parentNode = $node.closest('.nodes').closest('tbody').children('tr').eq(0).find('.node:eq(0)');
            index = $.inArray(nodeData, parentData[childrenField]);
          }
          that.addChildNode($parentNode, index, createNodeData, pend);
        }
      });
    });
    $node.on('click', '.fa-pencil', function () {
      that.openModal($node.data('nodeData'));
      that.$modal.find('.sure').unbind('click').bind('click', function () {
        that.options.editNodeData($node.data('nodeData'), function (data) {
          that.closeModal();
          that.resetNodeValue($node, data);
        });
      });
    });
    $node.on('click', '.delete-node', function () {
      if (!$node.data('parentData')[childrenField]) return;
      for (var i = 0; i < $node.data('parentData')[childrenField].length; i++) {
        if ($node.data('parentData')[childrenField][i] == $node.data('nodeData')) {
          $node.data('parentData')[childrenField].splice(i, 1);
          break;
        }
      }
      var cLength = $node.data('parentData')[childrenField].length;
      if (that.options.direction == 'l2r') {
        var $nodes = $node.closest('.nodes');
        var $tr = $nodes.closest('tr');
        var index = $tr.index();
        var $tbody = $nodes.closest('tbody');
        if (cLength == 0) {
          $tbody.children('tr').eq(0).children('td').eq(0).attr('rowspan', cLength * 2);
          $tbody.children('tr').eq(0).children('td').eq(1).remove();
          $tbody.children('tr').eq(0).children('td').eq(1).remove();
          $tbody.children('tr').eq(0).children('td').eq(1).remove();
          $tbody.children('tr').eq(0).children('td').eq(1).remove();
          $tbody.children('tr').eq(index + 1).remove();
          return;
        }
        $tbody.children('tr').eq(0).children('td').eq(0).attr('rowspan', cLength * 2);
        $tbody.children('tr').eq(0).children('td').eq(1).attr('rowspan', cLength * 2);
        $tbody.children('tr').eq(0).children('td').eq(2).attr('rowspan', cLength * 2);
        if (index == 0) {
          $tr.append($tbody.children('tr').eq(index + 2).children('.nodes'));
          $nodes.remove();
          $tbody.children('tr').eq(index + 1).remove();
          $tbody.children('tr').eq(index + 1).remove();
        } else {
          $tbody.children('tr').eq(index - 1).remove();
          $tr.remove();
        }
      } else if (that.options.direction == 't2b') {
        var $nodeTd = $node.closest('.node-td');
        var $nodes = $nodeTd.closest('.nodes');
        var $tbody = $nodes.closest('tbody');
        $tbody.children('tr').eq(0).children('td').attr('colspan', cLength * 2);
        $tbody.children('tr.toggle').children('td').attr('colspan', cLength * 2);
        $tbody.children('tr.lines').eq(0).children('td').attr('colspan', cLength * 2);
        if (cLength == 0) {
          $tbody.children('tr.toggle').remove();
          $tbody.children('tr.lines').remove();
          $tbody.children('tr.nodes').remove();
        } else {
          var linesRow = '<td class="right">&nbsp;</td>';
          for (var i = 1; i < cLength.length * 2; i++) {
            linesRow += '<td class="left top">&nbsp;</td><td class="top right">&nbsp;</td>';
          }
          linesRow += '<td class="left">&nbsp;</td>';
          $tbody.children('tr.lines').eq(1).html(linesRow);
          $nodeTd.remove();
        }
      }
    });
    return $node;
  },
  // 创建子树
  createNodeChildren: function ($tree, nodeData) {
    var that = this;
    var children = nodeData[this.options.childrenField];
    var cLength = children ? children.length : 0;
    if (this.options.direction == 't2b') {
      $tree.append('<tr class="toggle"><td colspan="' + cLength * 2 + '"><i>-</i></td></tr>');
      $tree.append('<tr class="lines"><td colspan="' + cLength * 2 + '"><table><tr><td class="right">&nbsp;</td><td class="left">&nbsp;</td></tr></table></td></tr>');
      var linesRow = '<tr class="lines"><td colspan="' + cLength * 2 + '"><table><tr><td class="right">&nbsp;</td><td class="left">&nbsp;</td></tr></table></td></tr>';
      if (cLength > 1) {
        var linesRow = '<tr class="lines"><td class="right">&nbsp;</td>';
        for (var i = 1; i < children.length; i++) {
          linesRow += '<td class="left top">&nbsp;</td><td class="top right">&nbsp;</td>';
        }
        linesRow += '<td class="left">&nbsp;</td></tr>';
      }
      $tree.append(linesRow);
      var $nodesRow = $('<tr class="nodes"></tr>').appendTo($tree);
      $.each(children, function () {
        that.renderTree($('<td colspan="2" class="node-td">').appendTo($nodesRow), this, nodeData);
      });
    } else if (this.options.direction == 'l2r') {
      for (var i = 0; i < cLength * 2; i++) {
        var $tr = $('<tr>');
        if (i == 0) {
          $tr = $tree.find('tr').eq(0);
          $tr.children('td').attr('rowspan', cLength * 2);
          $tr.append('<td class="toggle" rowspan="' + cLength * 2 + '"><i>-</i></td>');
          $tr.append('<td class="lines" rowspan="' + cLength * 2 + '"><table><tr><td class="bottom">&nbsp;</td></tr><tr><td class="top">&nbsp;</td></tr></table></td>');
        }
        if (i % 2 == 0) {
          $tr.append('<td class="lines ' + (i == 0 ? 'bottom' : 'left bottom') + '">&nbsp;</td>');
        } else {
          $tr.append('<td class="lines ' + (i == cLength * 2 - 1 ? 'top' : 'left top') + '">&nbsp;</td>');
        }
        if (i != 0) {
          $tree.append($tr);
        }
      }
      $.each(children, function (i) {
        that.renderTree($('<td class="nodes" rowspan="2"></td>').appendTo($tree.children('tbody').children('tr').eq(i * 2)), this, nodeData);
      });
    }
  },
  renderTree: function ($container, nodeData, parentData) {
    var that = this;
    var $tree = $('<table class="tree">').appendTo($container);
    var children = nodeData[this.options.childrenField];
    var cLength = children ? children.length : 0;
    var $node = this.createNode(nodeData, parentData);
    // 渲染caption
    if (nodeData.caption) {
      var caption = this.options.renderCaption(nodeData)
      $tree.append('<caption>' + caption + '</caption>');
    }
    if (this.options.direction == 't2b') {
      $tree.append($node.wrap('<tr><td colspan="' + cLength * 2 + '"></td></tr>').closest('tr'));
      if (cLength) {
        this.createNodeChildren($tree, nodeData);
      }
    } else if (this.options.direction == 'l2r') {
      $tree.append($node.wrap('<tr><td rowspan="' + cLength * 2 + '"></td></tr>').closest('tr'));
      if (cLength) {
        this.createNodeChildren($tree, nodeData);
      }
    }
  },
  addChildNode: function ($node, index, createNodeData, pend) {
    if (!$node.data('nodeData')[this.options.childrenField]) {
      $node.data('nodeData')[this.options.childrenField] = [createNodeData];
      this.createNodeChildren($node.closest('table.tree'), $node.data('nodeData'));
    } else {
      var children = $node.data('nodeData')[this.options.childrenField];
      children.splice(pend == 'before' ? index : index + 1, 0, createNodeData);
      if (this.options.direction == 't2b') {
        var $td = $('<td colspan="2" class="node-td"></td>');
        var $nodes = $node.closest('tr').siblings('.nodes');
        var $parent = $node.closest('tr').children('td');
        var $toggle = $nodes.siblings('tr.toggle').eq(0).children('td');
        var $lines1 = $nodes.siblings('tr.lines').eq(0).children('td');
        var $lines2 = $nodes.siblings('tr.lines').eq(1);
        this.renderTree($td, createNodeData, $node.data('nodeData'));
        $nodes.children('.node-td').eq(index)[pend]($td);
        $parent.attr('colspan', children.length * 2 + 2);
        $toggle.attr('colspan', children.length * 2 + 2);
        $lines1.attr('colspan', children.length * 2 + 2);
        var linesRow = '<td class="right">&nbsp;</td>';
        for (var i = 1; i < children.length; i++) {
          linesRow += '<td class="left top">&nbsp;</td><td class="top right">&nbsp;</td>';
        }
        linesRow += '<td class="left">&nbsp;</td>';
        $lines2.html(linesRow);
      } else if (this.options.direction == 'l2r') {
        var rows = $node.closest('tbody').children('tr');
        rows.eq(0).children('td').eq(0).attr('rowspan', children.length * 2);
        rows.eq(0).children('td.toggle').attr('rowspan', children.length * 2);
        rows.eq(0).children('td.lines').eq(0).attr('rowspan', children.length * 2);
        var $lines = $('<tr><td class="lines left top">&nbsp;</td></tr>');
        var $nodes = $('<tr><td class="lines left bottom">&nbsp;</td></tr>');
        if (pend == 'after') {
          rows.eq(index * 2).after($lines);
          $lines.after($nodes);
          this.renderTree($('<td class="nodes" rowspan="2"></td>').appendTo($nodes), createNodeData, $node.data('nodeData'));
        } else {
          var $changeNodes = rows.eq(index * 2).children('.nodes');
          rows.eq(index * 2).after($lines);
          $lines.after($nodes);
          $changeNodes.appendTo($nodes);
          this.renderTree($('<td class="nodes" rowspan="2"></td>').appendTo(rows.eq(index * 2)), createNodeData, $node.data('nodeData'));
        }
      }
    }
  },
  resetNodeValue: function ($node, nodeData) {
    var title = nodeData.title ? nodeData.title : '';
    if (this.options.renderTitle) {
      title = this.options.renderTitle(nodeData);
    }
    var content = nodeData.content ? nodeData.content : '';
    if (this.options.renderContent) {
      content = this.options.renderContent(nodeData);
    }
    $node.find('.title-main').html(title);
    $node.find('.content-main').html(content);
  },
  exportImage: function () {
    var $_container = this.$container.clone().css({ position: 'absolute', top: -100000 }).appendTo($('body'));
    $_container.find('.content').show();
    var _node = $_container.find('.orgtree').get(0);
    html2canvas(_node, {
      allowTaint: true,
      width: _node.clientWidth,
      height: _node.clientHeight + 100,
      'onclone': function (cloneDoc) {
        $(cloneDoc).find('.orgtree-container').css({ 'position': 'static', 'overflow': 'visible' })
          .find('.orgtree').css({ 'transform': '', 'top': 0, 'left': 0 })
          .find('.content').show();
      },
      onrendered: function (canvas) {
        $_container.remove();
        if (Orgtree.ieVersion() != -1) {
          var blob = canvas.msToBlob();
          navigator.msSaveBlob(blob, 'my-image-name.png');
        } else {
          var imgData = canvas.toDataURL('image/png', 1);
          var link = document.createElement('a');
          link.download = 'my-image-name.png';
          link.href = imgData;
          link.click();
        }
      }
    })
  },
  changeDirection: function (direction) {
    this.options.direction = direction;
    this.$el.css({ 'top': 0, 'left': 0 });
    this.init(false);
  },
  toggleDirection: function () {
    if (this.options.direction == 'l2r') {
      this.changeDirection('t2b');
    } else if (this.options.direction == 't2b') {
      this.changeDirection('l2r');
    }
  },
  openModal: function (nodeData) {
    this.$modal.find('.form-body').html(this.options.editNodeTpl(nodeData));
    this.$modal.css({ 'top': this.$container[0].scrollTop, 'left': this.$container[0].scrollLeft }).show();
    this.$container.css({ 'overflow': 'hidden' });
  },
  closeModal: function () {
    this.$modal.hide();
    if (!this.options.canMove) {
      this.$container.css({ 'overflow': 'auto' });
    }
  },
  getData: function () {
    return this.options.data;
  }
};
