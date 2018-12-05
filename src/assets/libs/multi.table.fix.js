/**
 * Created by Administrator on 2017/8/2.
 */
/*主要思想：
1>将原有的TABLE中的THEAD元素复制一份放在一个新的DIV(fixedheadwrap)中
2>设置这个fixedheadwrap为绝对位于原来的TABLE的THEAD位置
*/
(function ($) {
  $.fn.extend({
    FixedHead: function (options) {
      var op = $.extend({ tableLayout: "auto" }, options);
      return this.each(function () {
        var $this = $(this); //指向当前的table
        var $thisParentDiv = $(this).parent(); //指向当前table的父级DIV，这个DIV要自己手动加上去

        var x = $thisParentDiv.offset();

        if ($this.siblings("#fixedheadwrap").length > 0) {
          $this.siblings("#fixedheadwrap").remove();
        }

        var fixedDiv = $("<div class='fixedheadwrap' id='fixedheadwrap' style='clear:both;overflow:hidden;z-index:2;position:fixed;' ></div>")
          .prependTo($thisParentDiv)//在当前table的父级DIV的前面加一个DIV，此DIV用来包装tabelr的表头
          .css({ "width": $thisParentDiv[0].clientWidth, "left": x.left + 1, "top": x.top + 1 });
        var $thisClone = $("<table></table>")
          .append($this.find("thead").clone(true))
          .addClass($this[0].className);
        $thisClone.appendTo(fixedDiv); //将表头添加到fixedDiv中

        $this.css({ "marginTop": 0, "table-layout": op.tableLayout });
        //当前TABLE的父级DIV有水平滚动条，并水平滚动时，同时滚动包装thead的DIV
        $thisParentDiv.scroll(function () {
          fixedDiv[0].scrollLeft = $(this)[0].scrollLeft;
        });

        //因为固定后的表头与原来的表格分离开了，难免会有一些宽度问题
        //下面的代码是将原来表格中每一个TD的宽度赋给新的固定表头
        var $fixHeadTrs = $thisClone.find("thead tr");
        var $orginalHeadTrs = $this.find("thead");
        $fixHeadTrs.each(function (indexTr) {
          var $curFixTds = $(this).find("td");
          var $curOrgTr = $orginalHeadTrs.find("tr:eq(" + indexTr + ")");
          $curFixTds.each(function (indexTd) {
            $(this).css("width", $curOrgTr.find("td:eq(" + indexTd + ")").width());
          });
        });

      });
    },
    FixTable: function (options) {
      var defaults = {
        table: null,
        fixColNum: 0,
        fixRow:false,
        width: '1000px',
        height: '500px',
        fixClass: 'cell-fix'
      }
      var op = $.extend({}, defaults, options),
        TableID = op.tableId,
        FixColumnNumber = op.fixColNum,
        width = op.width,
        height = op.height,
        fixType = [0, 0],
        $tableFixClone, $tableHeadClone, $tableColumnClone,
        $table = op.table,
      $tableLayout = $('<div class="tableLayout"></div>'),
        $tableFix = $('<div class="tableFix"></div>'),
        $tableHead = $('<div class="tableHead"></div>'),
        $tableColumn = $('<div class="tableColumn"></div>'),
        $tableData = $('<div class="tableData"></div>'),
        oldtableWidth, HeadHeight, ColumnsWidth;

      //判断之前是否有合并单元格外层div存在
      if ($table.closest(".tableLayout").length != 0) {
        $table.closest(".tableLayout").before($table);
        $table.closest(".tableLayout").remove();
      }
      $tableLayout.css({
        "overflow": "hidden",
        "height": height,
        "width": width
      });
      $table.after($tableLayout);

      console.log($table.width(),$table.height(),op.width,op.height);
      // 判断是否需要固定行列
      if ($table.height() <= op.height) {
        if ($table.width() <= op.width) {
          $tableLayout.remove();
          return;
        } else {
          if(op.fixColNum){
            // 固定列
            $tableLayout.append($tableColumn);
            $tableLayout.append($tableData);

            $tableColumnClone = $table.clone(true);
            $tableColumnClone.addClass("tableColumnClone");
            $tableColumn.append($tableColumnClone);

            fixType[0] = 1;//横向滚动条，高度减去滚动条高度
          }
        }
      } else {
        if ($table.width() <= op.width) {
          if(op.fixRow){
            // 固定行（表头）
            $tableLayout.append($tableHead);
            $tableLayout.append($tableData);

            $tableHeadClone = $table.clone(true);
            $tableHeadClone.addClass("tableHeadClone");
            $tableHead.append($tableHeadClone);

            fixType[1] = 1;//竖向滚动条，宽度减去滚动条宽度
          }
        } else {
          if(op.fixRow){
            $tableLayout.append($tableHead);
            $tableHeadClone = $table.clone(true);
            $tableHeadClone.addClass("tableHeadClone");
            $tableHead.append($tableHeadClone);
            fixType[1] = 1;
          }
          if(op.fixColNum){
            $tableLayout.append($tableColumn);
            $tableColumnClone = $table.clone(true);
            $tableColumnClone.addClass("tableColumnClone");
            $tableColumn.append($tableColumnClone);
            fixType[0] = 1;
          }
          if(op.fixRow && op.fixColNum){
            $tableLayout.append($tableFix);
            $tableFixClone = $table.clone(true);
            $tableFixClone.addClass("tableFixClone");
            $tableFix.append($tableFixClone);
          }
          // 固定行列
          $tableLayout.append($tableData);
        }
      }
      $tableData.append($table);

      oldtableWidth = $tableData.width();
      if (fixType[1] === 1) {
        oldtableWidth = $tableData.width();
      }
      $tableLayout.find("table").each(function () {
        $(this).css({
          "margin": "0",
          // "width":oldtableWidth,
          "min-width": oldtableWidth
        });
      });


      HeadHeight = $tableHead.find("thead").height();
      HeadHeight += 1;
      $tableHead.css("height", HeadHeight);
      $tableFix.css("height", HeadHeight);


      ColumnsWidth = 0;
      $tableColumn.find("table tr:first th." + op.fixClass).each(function () {
        ColumnsWidth += $(this).outerWidth(true);
      });
      ColumnsWidth += 1;


      $tableColumn.css("width", ColumnsWidth);
      $tableFix.css("width", ColumnsWidth);

      $tableData.scroll(function () {
        $tableHead.scrollLeft($tableData.scrollLeft());
        $tableColumn.scrollTop($tableData.scrollTop());
      });

      $tableFix.css({
        "overflow": "hidden",
        "position": "relative",
        "z-index": "50",
        "background-color": "Silver"
      });
      $tableHead.css({
        "overflow": "hidden",
        "width": width,
        "position": "relative",
        "z-index": "45",
        "background-color": "Silver"
      });
      $tableColumn.css({
        "overflow": "hidden",
        "height": height,
        "position": "relative",
        "z-index": "40",
      });
      if (fixType[0] === 1) {
        $tableColumn.css({
          "height": height,
        });
      }
      if (fixType[1] === 1) {
        $tableHead.css({
          "width": width
        });
      }
      $tableData.css({
        "overflow": "auto",
        "width": width,
        "height": height + 1,
        "position": "relative",
        "z-index": "35"
      });

      $tableFix.offset($tableLayout.offset());
      $tableHead.offset($tableLayout.offset());
      $tableColumn.offset($tableLayout.offset());
      $tableData.offset($tableLayout.offset());
    }
  });
})(jQuery);
