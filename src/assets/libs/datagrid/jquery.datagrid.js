/**
 * @date 2018/04/19
 * @author 廖敏鹤
 */

;(function($) {
	
	var RESIZABLE = {
		DEFAULTS:	{
			$el: $('<div></div>'),						//[$]
			direction: null,									//[String] 'h'|'v'
			edge: 5,													//[Number]
			minWidth: 10,											//[Number]
			minHeight: 10,										//[Number]
			maxWidth: 10000,									//[Number]
			maxHeight: 10000,									//[Number]
			onStartResize: function(e){},			//[Function]
			onResize: function(e){},					//[Function]
			onStopResize: function(e){},			//[Function]
		}
	};
	
	var resizable = function(setting) {
		this.setting = $.extend({}, RESIZABLE.DEFAULTS, setting);
		this.status = {
			startWidth: null,
			startHeight: null,
			startX: null,
			startY: null,
			currentX: null,
			currentY: null,
			isResizing: false,
			dir: null
		};
		var $el = this.setting.$el.addClass('wa-resizable');
		$.extend(this, {
			$el: $el
		});
		this._init();
	}
	$.extend(resizable.prototype, {
		getPosition: function(e, $el) {
			$el || ($el = $(e.currentTarget));
			var offset = $el.offset();
			var width = $el.outerWidth();
			var height = $el.outerHeight();
			var eX = e.pageX;
			var eY = e.pageY;
			return {
				top: eY - offset.top,
				bottom: offset.top + height - eY,
				left: eX - offset.left,
				right: offset.left + width - eX
			};
		}
	});
	$.extend(resizable.prototype, {
		_getDir: function(e) {
			var position = this.getPosition(e);
			var dir = '';
			if(position.right<=this.setting.edge&&position.bottom>this.setting.edge&&this.setting.direction!='v') {
				dir = 'e';
			}else if(position.right>this.setting.edge&&position.bottom<=this.setting.edge&&this.setting.direction!='h') {
				dir = 's';
			}else if(position.right<=this.setting.edge&&position.bottom<=this.setting.edge&&this.setting.direction!='h'&&this.setting.direction!='v') {
				dir = 'se';
			}
			return dir;
		},
		_resize: function() {
			var width = this.status.startWidth+this.status.currentX-this.status.startX;
			var height = this.status.startHeight+this.status.currentY-this.status.startY;
			var minWidth = this.setting.minWidth;
			var minHeight = this.setting.minHeight;
			var maxWidth = this.setting.maxWidth;
			var maxHeight = this.setting.maxHeight;
			if(this.status.dir=='se') {
				(width>minWidth&&width<maxWidth)&&this.setting.$el.outerWidth(width);
				(height>minHeight&&height<maxHeight)&&this.setting.$el.outerHeight(height);
			}else if(this.status.dir=='s') {
				(height>minHeight&&height<maxHeight)&&this.setting.$el.outerHeight(height);
			}else if(this.status.dir=='e') {
				(width>minWidth&&width<maxWidth)&&this.setting.$el.outerWidth(width);
			}
		},
		_mouseDown: function(e) {
			this.setting.onStartResize.call(this, e);
		},
		_mouseMove: function(e) {
			if(this.status.isResizing==false) {return false;}
			$('body').css('cursor', this.status.dir+'-resize');
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			$.extend(this.status, {
				currentX: e.pageX,
				currentY: e.pageY
			});
			if(this.setting.onResize.call(this, e)!=false) {
				this._resize();
			}
		},
		_mouseUp: function(e) {
			$.extend(this.status, {
				isResizing: false
			});
			this._resize();
			this.setting.onStopResize.call(this, e);
			$(document).unbind('.resizable');
			$('body').css('cursor', '');
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		},
		_init: function() {
			var that = this;
			this.$el
				.bind('mousemove.resizable', function(e) {
					var dir = that._getDir(e);
					$(e.currentTarget).css('cursor', dir?dir+'-resize':'');
				})
				.bind('mousedown.resizable', function(e) {
					var dir = that._getDir(e);
					if(!dir) {return;}
					$.extend(that.status, {
						startWidth: that.setting.$el.outerWidth(),
						startHeight: that.setting.$el.outerHeight(),
						startX: e.pageX,
						startY: e.pageY,
						isResizing: true,
						dir: dir
					});
					$(document).bind('mousedown.resizable', function(e) {that._mouseDown(e);});
					$(document).bind('mousemove.resizable', function(e) {that._mouseMove(e);});
					$(document).bind('mouseup.resizable', function(e) {that._mouseUp(e);});
				});
		}
	});
	
	
	// 不随对象而改变的静态变量
	var DATAGRID = {
		DEFAULTS: {
			$el: null,
			width: 1000,
			height: 300,
			className: 'wa-datagrid-default',
			topContent: '',
			breakWord: false,
			columns: [[]],
			frozenColumns: [[]],
			data: {},
			checkable: true,
			checkWidth: 30,
			rowNumber: true,
			numberWidth: 30,
			numberText: '#',
			toggleRow: true,
			toggleWidth: 20,
			toggleText: '',
			striped: true,
			resizable: true,
			cellHeight: 40,
			pageable: true,
			pagerPosition: 'top',
			currentPage: 1,
			pageSize: 30,
			pageList: [30,50,100],
			sortable: true,
			url: null,
			singleSelect: true,
			//非用户设置
			_local: true
		},
		COLUMN_DEFAULTS: {
			field: null,
			cols: 1,
			rows: 1,
			text: null,
			width: 80,
			sortable: true,
			resizable: true,
			formatter: null
		}
	};
	var datagrid = function(setting) {
		this.cid = datagrid.cid++;
		this.setting = $.extend({}, DATAGRID.DEFAULTS, setting || {});
		this.setting.cellHeight<20 && (this.setting.cellHeight = 20);
		this.setting.url && (this.setting._local = false);
		this._init();
	};
	$.extend(datagrid, {
		cid: 1,
		browser: function() {
			var OsObject = "";
			if(navigator.userAgent.indexOf("MSIE")>0) 
				return "MSIE";
			if(isFirefox=navigator.userAgent.indexOf("Firefox")>0)
				return "Firefox";
			if(isSafari=navigator.userAgent.indexOf("Safari")>0)
        return "Safari";  
			if(isCamino=navigator.userAgent.indexOf("Camino")>0)  
        return "Camino";  
			if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0)
				return "Gecko";  
		}()
	});
	$.extend(datagrid.prototype, {
		getRule: function($style, ruleName) {
			var sheet = $style[0].styleSheet ? $style[0].styleSheet : $style[0].sheet;
			var rules = sheet.cssRules || sheet.rules;
			var rule;
			$.each(rules, function(i, r) {
				if(r.selectorText==ruleName) {rule=r;return;}
			});
			return rule;
		},
		setRules: function($style, rules) {
			for(var ruleName in rules) {
				var rule = this.getRule($style, ruleName);
				for(var styleName in rules[ruleName]) {
					rules[ruleName][styleName]&& (rule.style[styleName] = rules[ruleName][styleName]);
				}
			}
		},
		find: function(obj, fn) {
			if(obj.constructor == Array) {
				if(Array.prototype.find) {
					return obj.find(fn);
				}else {
					for(var i=0; i<obj.length; i++) {
						if(fn(obj[i], i)) return obj[i];
					}
				}
			}
		}
	});
	$.extend(datagrid.prototype, {
		_init: function() {
			this._initColumns();
			this._initContainer();
			this._initWidth();
			this._initHeader();
			this._initData();
			this._initEvent();
		},
		_initContainer: function() {
			var that = this;
			this.$container = $(
				'<div class="wa-datagrid">'+
					'<style></style>'+
					'<div class="wa-datagrid-boxshadow-h"></div>'+
					'<div class="wa-datagrid-loading"></div>'+
					'<div class="wa-datagrid-proxy"></div>'+
					'<div class="wa-datagrid-top"></div>'+
					'<div class="wa-datagrid-t1">'+
						'<div class="wa-datagrid-header">'+
							'<table></table>'+
						'</div>'+
						'<div class="wa-datagrid-body">'+
							'<table></table>'+
							'<table></table>'+
						'</div>'+
						'<div class="wa-datagrid-footer">'+
							'<table></table>'+
						'</div>'+
					'</div>'+
					'<div class="wa-datagrid-t2">'+
						'<div class="wa-datagrid-header">'+
							'<table></table>'+
						'</div>'+
						'<div class="wa-datagrid-body">'+
							'<table></table>'+
							'<table></table>'+
						'</div>'+
						'<div class="wa-datagrid-footer">'+
							'<table></table>'+
						'</div>'+
					'</div>'+
					'<div class="wa-datagrid-t3">'+
						'<div class="wa-datagrid-header">'+
							'<table></table>'+
						'</div>'+
						'<div class="wa-datagrid-body">'+
							'<table></table>'+
							'<table></table>'+
							'<div class="wa-datagrid-scroll-y"><i></i></div>'+
						'</div>'+
						'<div class="wa-datagrid-footer">'+
							'<table></table>'+
						'</div>'+
					'</div>'+
					'<div class="wa-datagrid-bottom"></div>'+
				'</div>'
			).insertAfter(this.setting.$el)
			.css({width:this.setting.width,height:this.setting.height})
			.addClass('wa-datagrid-cid'+this.cid)
			.addClass(this.setting.className);
			
			this.$boxshadowH = this.$container.find('.wa-datagrid-boxshadow-h');
			
			this.$loading = this.$container.find('.wa-datagrid-loading');
			this.$proxy = this.$container.find('.wa-datagrid-proxy');
			
			this.$top = this.$container.find('.wa-datagrid-top');
			this.setting.topContent && this.$top.append(this.setting.topContent);
			
			var t = function(index) {
				this['$t'+index] = this.$container.find('.wa-datagrid-t'+index);
				this['$htable'+index] = this['$t'+index].find('.wa-datagrid-header table');
				this['$btableFz'+index] = this['$t'+index].find('.wa-datagrid-body table:eq(0)');
				this['$btable'+index] = this['$t'+index].find('.wa-datagrid-body table:eq(1)');
				this['$ftable'+index] = this['$t'+index].find('.wa-datagrid-footer table');
			}
			
			t.call(this, 1);
			t.call(this, 2);
			t.call(this, 3);
			
			this.$bottom = this.$container.find('.wa-datagrid-bottom');
			this.$style = this.$container.find('style').appendTo($('head'));
			
			if(this.setting.pageable) {
				this.$pager = $(
					'<div class="wa-datagrid-pager">'+
						'<span class="wa-datagrid-pagesize"><select></select> 条/页</span>'+
						'<ul>'+
							'<li class="wa-datagrid-prev">&lt;</li>'+
							'<li class="wa-datagrid-input"><input type="text"></li>'+
							'<li class="wa-datagrid-next">&gt;</li>'+
						'</ul>'+
						'<span class="wa-datagrid-text"></span>'+
					'</div>'
				);
				this.setting.pagerPosition == 'top' && this.$pager.appendTo(this.$top);
				this.setting.pagerPosition == 'bottom' && this.$pager.appendTo(this.$bottom);
				$.each(this.setting.pageList, function(i, v) {
					that.$pager.find('select').append('<option value="'+v+'" '+(v==that.setting.pageSize?'selected':'')+'>'+v+'</option>');
				});
			}
			
			if(this.setting.breakWord) {
				this.$style.append('.wa-datagrid-cid'+this.cid+' table td{'+
					'height:'+this.setting.cellHeight+'px;'+
				'}');
				this.$style.append('.wa-datagrid-cid'+this.cid+' table td .wa-datagrid-cell {'+
					'word-break: '+(datagrid.browser=='MSIE'||datagrid.browser=='Firefox'?'break-all':'break-word')+';'+
					'height:auto;line-height:normal;'+
				'}');
			}else {
				this.$style.append('.wa-datagrid-cid'+this.cid+' table td{'+
					'height:'+this.setting.cellHeight+'px;'+
				'}');
				this.$style.append('.wa-datagrid-cid'+this.cid+' table td .wa-datagrid-cell {'+
					'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'+
				'}');
			}
		},
		_initColumns: function() {
			var that = this;
			var rs = Math.max(this.setting.columns.length, this.setting.frozenColumns.length);
			this['_fixedColumns'] = [[]];
			this['_fixedFields'] = [];
			this['_fixedWidth'] = 0;
			var fixedFn = function(columns, field, width) {
				that['_fixedColumns'][0].push(columns);
				that['_fixedFields'].push(field);
				that['_fixedWidth'] += width;
			}
			if(this.setting.checkable) {
				var f = $.extend({}, DATAGRID.COLUMN_DEFAULTS, {
					rows: rs, 
					fieldSerialize: '_f0', 
					width: this.setting.checkWidth, 
					text: this.setting.singleSelect ? '' : '<input type="checkbox">&nbsp;', 
					resizable: false,
					sortable: false
				});
				fixedFn(f,f,this.setting.checkWidth);
			}
			if(this.setting.rowNumber) {
				var f = $.extend({}, DATAGRID.COLUMN_DEFAULTS, {
					rows: rs, 
					fieldSerialize: '_f1', 
					width: this.setting.numberWidth, 
					text: this.setting.numberText, 
					resizable: false,
					sortable: false
				});
				fixedFn(f,f,this.setting.numberWidth);
			}
			if(this.setting.toggleRow) {
				var f = $.extend({}, DATAGRID.COLUMN_DEFAULTS, {
					rows: rs, 
					fieldSerialize: '_f2', 
					width: this.setting.toggleWidth, 
					text: this.setting.toggleText, 
					resizable: false,
					sortable: false
				});
				fixedFn(f,f,this.setting.toggleWidth);
			}
			var fn = function(a, b, c, columns) {
				that[a] = [];
				that[b] = [];
				that[c] = 0;
				$.each(columns, function(i, row) {
					var _row = [];
					var index = 0;
					$.each(row, function(j, col) {
						var _col = $.extend({}, DATAGRID.COLUMN_DEFAULTS, col);
						if(rs == i+_col.rows) {
							var _index = index;
							while(that[b][_index]) {
								_index++;
							}
							_col.fieldSerialize = b+_index;
							that[b][_index] = _col;
							that[c] += _col.width;
						}
						_row.push(_col);
						index += _col.cols;
					});
					that[a].push(_row);
				});
			}
			fn('_columns', '_fields', '_width', this.setting.columns);
			fn('_frozenColumns', '_frozenFields', '_frozenWidth', this.setting.frozenColumns);
		},
		_initWidth: function() {
			this.__fixedWidth = this._fixedWidth
			this.__frozenWidth = this._frozenWidth <= this.setting.width/2 - this.__fixedWidth ? this._frozenWidth : this.setting.width/2 - this.__fixedWidth;
			this.__width = this.setting.width - this.__fixedWidth - this.__frozenWidth;
		},
		_initHeader: function() {
			var that = this;
			var rs = Math.max(this._columns.length, this._frozenColumns.length);
			var _render = function($table, columns) {
				for(var i = 0; i < rs; i++) {
					var row = [];
					var $tr = $('<tr>').appendTo($table);
					columns[i] && $.each(columns[i], function(j,col) {
						var cellClass = col.fieldSerialize ? 'wa-datagrid-'+col.fieldSerialize : '';
						var resizable = (that.setting.resizable && col.resizable && col.fieldSerialize) ? 'wa-datagrid-resizable' : '';
						var sortable = that.setting.sortable && col.sortable && col.fieldSerialize;
						var width = col.width;
						// 自适应。误差值±1
						if(columns==that._frozenColumns) {
							width = that.__frozenWidth==that._frozenWidth ? width : width/that._frozenWidth*(that.__frozenWidth-1);
						}
						if(columns==that._columns) width = that._width <= that.__width ? width/that._width*(that.__width-1) : width;
						that.$style.append('.wa-datagrid-cid'+that.cid+' .'+cellClass+'{width:'+width+'px}');
						$('<td>')
							.attr({
								'colspan': col.cols,
								'rowspan': col.rows
							})
							.append('<div class="wa-datagrid-cell '+cellClass+' '+resizable+'">'+col.text+'</div>')
							.append(sortable?'<div class="wa-datagrid-sorter"><i class="wa-datagrid-top-arrow"></i><i class="wa-datagrid-bottom-arrow"></i></div>':'')
							.appendTo($tr);
					});
				}
			}
			_render(this.$htable1, this._fixedColumns);
			_render(this.$htable2, this._frozenColumns);
			_render(this.$htable3, this._columns);
			var border = Number(this.$container.css('border-left-width').split('px')[0])
				+Number(this.$container.css('border-right-width').split('px')[0])
				+Number(this.$t1.css('border-left-width').split('px')[0])
				+Number(this.$t1.css('border-right-width').split('px')[0])
				+Number(this.$t2.css('border-left-width').split('px')[0])
				+Number(this.$t2.css('border-right-width').split('px')[0])
				+Number(this.$t3.css('border-left-width').split('px')[0])
				+Number(this.$t2.css('border-right-width').split('px')[0]);
			this.$t3.width(this.$container.width()-this.$t1.width()-this.$t2.width()-border);
			this._adjustHeadHeight();
		},
		_initData: function() {
			var that = this;
			this._initHeight();
			this.$loading.show();
			if(this.setting._local) {
				this.setting.data.total = this.setting.data.rows.length;
				this._initFooter(this.setting.data.footer||[]);
				this._initBodyHeight();
				this._initBody(this.setting.pageable 
					? this.setting.data.rows.slice((this.setting.currentPage-1)*this.setting.pageSize, this.setting.currentPage*this.setting.pageSize)
					: this.setting.data.rows);
				that._magicEvent();
				this.$loading.hide();
			}else {
				$.ajax({
					url: this.setting.url,
					data: {
						page: this.setting.currentPage,
						pageSize: this.setting.pageSize
					},
					type: 'get',
					dataType: 'json',
					success: function(resp) {
						that.setting.data = resp;
						that._initFooter(that.setting.data.footer||[]);
						that._initBodyHeight();
						that._initBody(that.setting.data.rows);
						that._magicEvent();
						that.$loading.hide();
					}
				});
			}
		},
		_initFooter: function(footer) {
			var that = this;
			that.$ftable1.add(that.$ftable2).add(that.$ftable3).empty();
			$.each(footer, function(i, row) {
				var $tr1 = $('<tr>').appendTo(that.$ftable1);
				$.each(that._fixedFields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					v.fieldSerialize=='_f0' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'"><!--<input type="checkbox">&nbsp;--><div></td>');
					v.fieldSerialize=='_f1' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'"><!--'+(i+1)+'--></div></td>');
					v.fieldSerialize=='_f2' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'"><!--+--></div></td>');
				});
				var $tr2 = $('<tr>').appendTo(that.$ftable2);
				$.each(that._frozenFields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					$tr2.append('<td><div class="wa-datagrid-cell '+cellClass+'">'+(row[v.field]||'')+'</div></td>');
				});
				var $tr3 = $('<tr>').appendTo(that.$ftable3);
				$.each(that._fields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					$tr3.append('<td><div class="wa-datagrid-cell '+cellClass+'">'+(row[v.field]||'')+'</div></td>');
				});
			});
			this._adjustFooterHeight();
		},
		_initHeight: function() {
			var __topHeight = this.$top.outerHeight();
			var __bottomHeight = this.$bottom.outerHeight();
			this.$t1.add(this.$t2).add(this.$t3).height(this.setting.height - __topHeight - __bottomHeight);
		},
		_initBodyHeight: function() {
			var __hHeight = Math.max(this.$htable1.outerHeight(),this.$htable2.outerHeight(),this.$htable3.outerHeight());
			var __fHeight = Math.max(this.$ftable1.outerHeight(),this.$ftable2.outerHeight(),this.$ftable3.outerHeight());
			var __topHeight = this.$top.outerHeight();
			var __bottomHeight = this.$bottom.outerHeight();
			this.$container.find('.wa-datagrid-body').height(
				this.__bHeight = this.setting.height - __hHeight - __fHeight - __topHeight - __bottomHeight
			);
		},
		_initBody: function(rows) {
			var that = this;
			that.$btable1.add(that.$btable2).add(that.$btable3).add(that.$btableFz1).add(that.$btableFz2).add(that.$btableFz3).empty();
			that.$t3.find('.wa-datagrid-header').add(that.$t3.find('.wa-datagrid-body')).add(that.$t3.find('.wa-datagrid-footer')).scrollLeft(0);
			that.$htable1.find('.wa-datagrid-_f0 input[type="checkbox"]').prop('checked', false);
			$.each(rows, function(i, row) {
				var $tr1 = $('<tr>').appendTo(that.$btable1).data('waRow', row);
				$.each(that._fixedFields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					v.fieldSerialize=='_f0' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'"><input type="checkbox">&nbsp;<div></td>');
					v.fieldSerialize=='_f1' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'">'+(i+1)+'</div></td>');
					v.fieldSerialize=='_f2' && $tr1.append('<td><div class="wa-datagrid-cell '+cellClass+'">+</div></td>');
				});
				var $tr2 = $('<tr>').appendTo(that.$btable2).data('waRow', row);
				$.each(that._frozenFields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					var cellText = v.formatter
						? v.formatter.call(that, row, row[v.field])
						: row[v.field]||'';
					$('<td><div class="wa-datagrid-cell '+cellClass+'"></div></td>').appendTo($tr2)
						.find('div').append(cellText);
				});
				var $tr3 = $('<tr>').appendTo(that.$btable3).data('waRow', row);
				$.each(that._fields, function(j,v) {
					var cellClass = v.fieldSerialize ? 'wa-datagrid-'+v.fieldSerialize : '';
					var cellText = v.formatter
						? v.formatter.call(that, row, row[v.field])
						: row[v.field]||'';
					$('<td><div class="wa-datagrid-cell '+cellClass+'"></div></td>').appendTo($tr3)
						.find('div').append(cellText);
				});
			});
			this._initPager();
			this._adjustBodyHeight();
			this._adjustBodyWidth();
			this.striped(this.setting.striped);
			this._magicEvent();
		},
		_initPager: function() {
			if(this.setting.pageable) {
				var start = (this.setting.currentPage-1)*this.setting.pageSize+1;
				var end = this.setting.currentPage*this.setting.pageSize>this.setting.data.total ? this.setting.data.total : this.setting.currentPage*this.setting.pageSize;
				this.$pager.find('span.wa-datagrid-text').html('共有'+this.setting.data.total+'条记录，当前显示'+start+'-'+end+'条记录');
				this.$pager.find('input').val(this.setting.currentPage);
			}
		},
		_f1: function() {
			var index = 0;
			this.$btableFz1.find('tr').each(function(i, tr) {
				$(this).find('.wa-datagrid-_f1').html(++index);
			});
			this.$btable1.find('tr').each(function(i, tr) {
				$(this).find('.wa-datagrid-_f1').html(++index);
			});
		},
		_initEvent: function() {
			var that = this;
			// 鼠标滚轮
			this.$t1.add(this.$t2).add(this.$t3).find('.wa-datagrid-body').bind('mousewheel DOMMouseScroll', function (e) {
				that.isScrollY = false;
				that.isScrollX = false;
        var e1 = e.originalEvent || window.event;
        var deltaY = e1.wheelDelta || e1.detail * ( - 1);
        var deltaX = e1.wheelDelta || e1.detail * ( - 1);
        if ('deltaY' in e1)
          deltaY = e1.deltaY * - 1;
				if ('deltaX' in e1)
          deltaX = e1.deltaX * - 1;
				if( ($(this).scrollTop() - deltaY > 0) && ($(this).scrollTop() - deltaY < $(this)[0].scrollHeight-$(this).height())) {
					e.preventDefault();
				}
        if(deltaY) {
					that.$t1.find('.wa-datagrid-body').scrollTop(that.$t1.find('.wa-datagrid-body').scrollTop() - deltaY);
					that.$t2.find('.wa-datagrid-body').scrollTop(that.$t2.find('.wa-datagrid-body').scrollTop() - deltaY);
					that.$t3.find('.wa-datagrid-body').scrollTop(that.$t3.find('.wa-datagrid-body').scrollTop() - deltaY);
				}
				if(!(datagrid.browser=='MSIE'||datagrid.browser=='Firefox')&&deltaX) {
					$(this).scrollLeft($(this).scrollLeft() - deltaX);						
					$(this).parent().find('.wa-datagrid-header').scrollLeft($(this).parent().find('.wa-datagrid-header').scrollLeft() - deltaX);						
					$(this).parent().find('.wa-datagrid-footer').scrollLeft($(this).parent().find('.wa-datagrid-footer').scrollLeft() - deltaX);
				}
      });
			// 滚动
			this.$t3.find('.wa-datagrid-body').bind('scroll', function(e) {
				that.$detail && that.$detail.css({top: Number(that.detailTop)-$(this).scrollTop(), display: 'block'});
				
				if(!that.isScrollY) {
					$(this).find('.wa-datagrid-scroll-y').css({top: $(this).scrollTop(), right:-$(this).scrollLeft()});
					$(this).find('.wa-datagrid-scroll-y i').css({
						top: $(this).find('.wa-datagrid-scroll-y').height()*$(this).scrollTop()/$(this)[0].scrollHeight
					});
				}else {
					$(this).find('.wa-datagrid-scroll-x').css({bottom:-$(this).scrollTop()});
				}
				
				if(!that.isScrollX) {
					$(this).find('.wa-datagrid-scroll-x').css({left: $(this).scrollLeft(), bottom:-$(this).scrollTop()});
					$(this).find('.wa-datagrid-scroll-x i').css({
						left: $(this).find('.wa-datagrid-scroll-x').width()*$(this).scrollLeft()/$(this)[0].scrollWidth
					});
				}else {
					$(this).find('.wa-datagrid-scroll-y').css({right:-$(this).scrollLeft()});
				}
				
				that.$btableFz1.css({top: that.$t1.find('.wa-datagrid-body').scrollTop()});
				that.$btableFz2.css({top: that.$t2.find('.wa-datagrid-body').scrollTop()});
				that.$btableFz3.css({top: that.$t3.find('.wa-datagrid-body').scrollTop()});
				
				if($(this).scrollTop() != 0) {
					if(that.$btableFz1.width()||that.$btableFz2.width()||that.$btableFz3.width()) {
						that.$btableFz1.add(that.$btableFz2).add(that.$btableFz3).css({'box-shadow': '0px 2px 10px 0px #eee'});
					}else {
						that.$t1.add(that.$t2).add(that.$t3).find('.wa-datagrid-header').css({'box-shadow': '0px 5px 10px -2px #eee'});
					}
				}else {
					that.$btableFz1.add(that.$btableFz2).add(that.$btableFz3).css({'box-shadow': ''});
					that.$t1.add(that.$t2).add(that.$t3).find('.wa-datagrid-header').css({'box-shadow': ''});
				}
				
				if($(this).scrollLeft() != 0) {
					that.$boxshadowH.css({display:'block', left: that.$t3.offset().left-that.$container.offset().left});
				}else {
					that.$boxshadowH.hide();
				}
			});
			// 缩放列
			this.$htable3.find('.wa-datagrid-cell.wa-datagrid-resizable').each(function (i, v) {
				var r = new resizable({
					$el: $(v),
					direction: 'h',
					minWidth: 30,
					onResize: function(e){
						that.$proxy.css({'left':e.pageX-that.$container.offset().left}).show();
						return false;
					},
					onStopResize: function(e){
						var ruleName = that.find($(v).attr('class').split(' '), function(v, i) {
							if(v.indexOf('wa-datagrid-_') != -1) {
								return true;
							}
						});
						ruleName = '.wa-datagrid-cid'+that.cid+' .' + ruleName;
						var rule = {};
						rule[ruleName] = {width: this.$el.outerWidth()+'px'};
						that.setRules(that.$style, rule);
						that.$proxy.hide();
						this.$el[0].style.width = '';
						that.setting.breakWord && that._formatterHeight();
						that._formatterWidth();
					}
				});
			});
			// 滚动条显示
			this.$btable1.add(this.$btable2).add(this.$btable3).parent().hover(function() {
				that.$btable3.parent().find('.wa-datagrid-scroll-y').show();
				that.$btable3.parent().find('.wa-datagrid-scroll-x').show();
			}, function() {
				!that.$btable3.parent().find('.wa-datagrid-scroll-y').hasClass('active') && that.$btable3.parent().find('.wa-datagrid-scroll-y').hide();
				!that.$btable3.parent().find('.wa-datagrid-scroll-x').hasClass('active') && that.$btable3.parent().find('.wa-datagrid-scroll-x').hide();
			});
			// 翻页
			this.$pager&&this.$pager.find('.wa-datagrid-prev').bind('click', function() {
				that.prevPage();
			});
			this.$pager&&this.$pager.find('.wa-datagrid-next').bind('click', function() {
				that.nextPage();
			});
			this.$pager&&this.$pager.find('input').bind('keyup', function(e) {
				if(e.keyCode==13) {
					if((Number($(this).val())-1)*that.setting.pageSize < that.setting.data.total && $(this).val()>=1) 
						that.goPage($(this).val());
					else
						$(this).val(that.setting.currentPage);
				}
			}).bind('blur', function(e) {
				if((Number($(this).val())-1)*that.setting.pageSize < that.setting.data.total && $(this).val()>=1) 
					that.goPage($(this).val());
				else
					$(this).val(that.setting.currentPage);
			});
			this.$pager&&that.$pager.find('select').bind('change', function(e) {
				that.setting.currentPage = 1;
				that.setting.pageSize = Number($(this).val());
				that.goPage(that.setting.currentPage);
			});
			// 鼠标悬浮列
			this.$container.find('.wa-datagrid-header td').hover(function(e) {
				var ruleName = that.find($(this).find('.wa-datagrid-cell').attr('class').split(' '), function(v, i) {
					if(v.indexOf('wa-datagrid-_') != -1) {
						return true;
					}
				});
				that.$container.find('.'+ruleName).closest('td').addClass('wa-datagrid-hover-cell');
			}, function(e) {
				var ruleName = that.find($(this).find('.wa-datagrid-cell').attr('class').split(' '), function(v, i) {
					if(v.indexOf('wa-datagrid-_') != -1) {
						return true;
					}
				});
				that.$container.find('.'+ruleName).closest('td').removeClass('wa-datagrid-hover-cell');
			});
			// 排序
			this.$container.find('.wa-datagrid-sorter').bind('click', function() {
				var asc = $(this).hasClass('asc');
				var _field = that.find($(this).siblings('div.wa-datagrid-cell').attr('class').split(' '), function(v, i) {
					if(v.indexOf('wa-datagrid-_') != -1) {
						return true;
					}
				}).split('-')[2];
				var field;
				if(_field.indexOf('_frozenFields')!=-1) {
					field = that._frozenFields[_field.split('_frozenFields')[1]].field;
				}
				if(_field.indexOf('_fields')!=-1) {
					field = that._fields[_field.split('_fields')[1]].field;
				}
				that.sort(field, asc?'desc':'asc');
				that.$container.find('.wa-datagrid-sorter').removeClass('asc').removeClass('desc');
				asc ? $(this).addClass('desc') : $(this).addClass('asc');
			});
			// 需要重新绑定的事件
			this._magicEvent();
		},
		_magicEvent: function() {
			var that = this;
			// 选择框
			this.$htable1.find('.wa-datagrid-_f0 input[type="checkbox"]').unbind('.check').bind('click.check', function(e) {
				that.$t1.find('.wa-datagrid-body .wa-datagrid-_f0 input[type="checkbox"]').prop('checked', $(this).prop('checked'));
				that.$btable1.add(that.$btable2).add(that.$btable3).add(that.$btableFz1).add(that.$btableFz2).add(that.$btableFz3).find('tr')
					[$(this).prop('checked')?'addClass':'removeClass']('wa-datagrid-selected');
			});
			that.$t1.find('.wa-datagrid-body .wa-datagrid-_f0 input[type="checkbox"]').unbind('.check').bind('click.check', function(e) {
				var checked = $(this).prop('checked');
				var index = $(this).closest('tr').index();
				var tableIndex = $(this).closest('table').index();
				if(that.setting.singleSelect) {
					that.$container.find('tr.wa-datagrid-selected').removeClass('wa-datagrid-selected');
					that.$t1.find('.wa-datagrid-body .wa-datagrid-_f0 input[type="checkbox"]').prop('checked', false);
					$(this).prop('checked', checked);
				}else {
					that.$t1.find('.wa-datagrid-body .wa-datagrid-_f0 input[type="checkbox"]').each(function() {
						checked && (checked = $(this).prop('checked'));
					});
					that.$htable1.find('.wa-datagrid-_f0 input[type="checkbox"]').prop('checked', checked);
				}
				that.$t1.find('.wa-datagrid-body table').eq(tableIndex).find('tr').eq(index)[$(this).prop('checked')?'addClass':'removeClass']('wa-datagrid-selected');
				that.$t2.find('.wa-datagrid-body table').eq(tableIndex).find('tr').eq(index)[$(this).prop('checked')?'addClass':'removeClass']('wa-datagrid-selected');
				that.$t3.find('.wa-datagrid-body table').eq(tableIndex).find('tr').eq(index)[$(this).prop('checked')?'addClass':'removeClass']('wa-datagrid-selected');
			});
			// 鼠标悬浮行
			var hoverRow = function(txt) {
				for(var i=1; i<=3; i++) {
					that[txt+i].find('tr').unbind('.mouseoverRow').bind('mouseover.mouseoverRow', function() {
						that[txt+1].find('tr').eq($(this).index()).addClass('wa-datagrid-hover-row');
						that[txt+2].find('tr').eq($(this).index()).addClass('wa-datagrid-hover-row');
						that[txt+3].find('tr').eq($(this).index()).addClass('wa-datagrid-hover-row');
					});
					that[txt+i].find('tr').unbind('.mouseleaveRow').bind('mouseleave.mouseleaveRow', function() {
						that[txt+1].find('tr').eq($(this).index()).removeClass('wa-datagrid-hover-row');
						that[txt+2].find('tr').eq($(this).index()).removeClass('wa-datagrid-hover-row');
						that[txt+3].find('tr').eq($(this).index()).removeClass('wa-datagrid-hover-row');
					});
				}
			}
			hoverRow('$btable');
			hoverRow('$btableFz');
			// 细节展示
			this.$btableFz1.find('.wa-datagrid-_f2').unbind('.toggle').bind('click.toggle', function(e) {
				
			});
			this.$btable1.find('.wa-datagrid-_f2').unbind('.toggle').bind('click.toggle', function(e) {
				var $tr = $(this).closest('tr').addClass('wa-datagrid-detail-row');
				var detailRow = that.$detailRow&&that.$detailRow[0];
				that._clearDetail();
				if($tr[0]!=detailRow)	{
					$(this).html('-');
					that.$detailRow = $tr;
					var index = $tr.index();
					var row = $tr.data().waRow;
					that.detailTop = $tr.offset().top+$tr.height()+that.$t3.find('.wa-datagrid-body').scrollTop()-that.$container.offset().top;
					that.$detail = $('<div class="wa-datagrid-detail" style="top:'+($tr.offset().top+$tr.height()-that.$container.offset().top)+'px">');
					for(var key in row)
						that.$detail.append('<p>'+row[key]+'</p>');
					that.$detail.appendTo(that.$container);
					var height = that.$detail.outerHeight();
					var $placeholder = $('<tr class="wa-datagrid-placeholder-row" style="height:'+height+'px">');
					that.$placeholderList = [$placeholder.clone(true),$placeholder.clone(true),$placeholder.clone(true)];
					that.$btable1.find('tr').eq(index).after(that.$placeholderList[0]);
					that.$btable2.find('tr').eq(index).after(that.$placeholderList[1]);
					that.$btable3.find('tr').eq(index).after(that.$placeholderList[2]);
					that._formatterHeight();
					that.$detail.hover(function() {
						that.$btable3.parent().find('.wa-datagrid-scroll-y').show();
						that.$btable3.parent().find('.wa-datagrid-scroll-x').show();
					}, function() {
						!that.$btable3.parent().find('.wa-datagrid-scroll-y').hasClass('active') && that.$btable3.parent().find('.wa-datagrid-scroll-y').hide();
						!that.$btable3.parent().find('.wa-datagrid-scroll-x').hasClass('active') && that.$btable3.parent().find('.wa-datagrid-scroll-x').hide();
					});
					that.$detail.bind('mousewheel DOMMouseScroll', function (e) {
						that.isScrollY = false;
						that.isScrollX = false;
						e.preventDefault();
						var e1 = e.originalEvent || window.event;
						var deltaY = e1.wheelDelta || e1.detail * ( - 1);
						if ('deltaY' in e1)
							deltaY = e1.deltaY * - 1;
						if(deltaY) {
							that.$t1.find('.wa-datagrid-body').scrollTop(that.$t1.find('.wa-datagrid-body').scrollTop() - deltaY);
							that.$t2.find('.wa-datagrid-body').scrollTop(that.$t2.find('.wa-datagrid-body').scrollTop() - deltaY);
							that.$t3.find('.wa-datagrid-body').scrollTop(that.$t3.find('.wa-datagrid-body').scrollTop() - deltaY);
						}
					});
				}
			});
		},
		_clearDetail: function() {
			this.$btable1.find('.wa-datagrid-_f2').html('+');
			this.$detail&&this.$detail.remove();
			this.$placeholderList&&$.each(this.$placeholderList, function(i, v){$(v).remove();});
			this.$detailRow&&this.$detailRow.removeClass('wa-datagrid-detail-row');
			this.$detail = this.$placeholderList = this.$detailRow = this.detailTop = null;
		},
		_adjustBodyWidth: function() {
			var that = this;
			var adjustScroll = function($wrapper) {
				if($wrapper.width()<$wrapper[0].scrollWidth) {
					var prevClientX;
					var $scrollx = $wrapper.find('.wa-datagrid-scroll-x').length 
						? $wrapper.find('.wa-datagrid-scroll-x')
						: $('<div class="wa-datagrid-scroll-x"><i></i></div>').appendTo($wrapper);
					$wrapper.width($wrapper.width());//去小数点
					$scrollx.css({width: $wrapper.width(), left: $wrapper.scrollLeft()})
						.find('i').css({
							width: $wrapper.width()*$wrapper.width()/$wrapper[0].scrollWidth,
							left: $wrapper.width()*$wrapper.scrollLeft()/$wrapper[0].scrollWidth
						});
					$scrollx.find('i').unbind('.scrollx').bind('mousedown.scrollx', function(e) {
						$('body').css('cursor', 'default');
						$(this).parent().addClass('active');
						var el = this;
						prevClientX = e.clientX;
						$(document).bind('mousedown.scrollx', function(e) {});
						$(document).bind('mousemove.scrollx', function(e) {
							if(e.clientX<$wrapper[0].getBoundingClientRect().left || e.clientX>$wrapper[0].getBoundingClientRect().left+$wrapper.width()) {return;}
							var left = $(el)[0].offsetLeft+(e.clientX - prevClientX);
							var sLeft = left/$wrapper.width()*$wrapper[0].scrollWidth;
							if(left<0) {left = 0;}
							if(left>$wrapper.width()-$(el).width()) {left = $wrapper.width()-$(el).width();}
							if(sLeft<0) {sLeft = 0;}
							if(sLeft>$wrapper[0].scrollWidth-$wrapper.width()) {sLeft = $wrapper[0].scrollWidth-$wrapper.width();}
							$(el).css({left: left});
							$(el).parent().css({left: sLeft});
							prevClientX = e.clientX;
							that.isScrollX = true;
							$wrapper.scrollLeft(sLeft);
							that.$t3.find('.wa-datagrid-header').scrollLeft(sLeft);						
							that.$t3.find('.wa-datagrid-footer').scrollLeft(sLeft);
							window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						});
						$(document).bind('mouseup.scrollx', function(e) {
							$('body').css('cursor', '');
							$(el).parent().removeClass('active');
							$(document).unbind('.scrollx');
							window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						});
					});
				}else {
					$wrapper.find('.wa-datagrid-scroll-x').remove();
				}
			}
			adjustScroll(this.$btable3.parent());
		},
		_adjustTableHeight: function(txt) {
			var that = this;
			var $table1 = this['$'+txt+'table1'];
			var $table2 = this['$'+txt+'table2'];
			var $table3 = this['$'+txt+'table3'];
			var rs = Math.max($table1.find('tr').length, $table2.find('tr').length, $table3.find('tr').length);
			for(var i=0; i<rs; i++) {
				var maxRowSpan = 1;
				var $cells = $table1.find('tr').eq(i).add($table2.find('tr').eq(i)).add($table3.find('tr').eq(i)).find('td');
				$cells.each(function(j, cell) {
					var outerHeight = $(cell).find('.wa-datagrid-cell').outerHeight()>that.setting.cellHeight ? $(cell).find('.wa-datagrid-cell').outerHeight() : that.setting.cellHeight;
					$(cell).outerHeight(outerHeight);
					$(cell).attr('rowspan') > maxRowSpan && (maxRowSpan = $(cell).attr('rowspan'));
				});
				for(var j=1; j<=maxRowSpan; j++) {
					var $cs;
					if(j==1) {
						$cs = $cells.filter(function(i,el) {
							return $(el).attr('rowspan')==undefined || $(el).attr('rowspan')==1;
						});
					}else
						$cs = $cells.filter('[rowspan="'+j+'"]');
					var maxHeight = 0;
					$cs.each(function(k, c) {
						var outerHeight = $(c).outerHeight();
						outerHeight > maxHeight && (maxHeight = outerHeight);
					});
					$cs.outerHeight(maxHeight);
				}
			}
		},
		_adjustHeadHeight: function() {
			this._adjustTableHeight('h');
		},
		_adjustFooterHeight: function() {
			this._adjustTableHeight('f');
		},
		_adjustBodyHeight: function() {
			var that = this;
			
			this._adjustTableHeight('b');
			this.$btable1.add(this.$btable2).add(this.$btable3).css({top: Math.max(this.$btableFz1.height(),this.$btableFz2.height(),this.$btableFz3.height())});
			
			var adjustScroll = function($wrapper) {
				if($wrapper.height()<$wrapper[0].scrollHeight) {
					var prevClientY;
					var $scrolly = $wrapper.find('.wa-datagrid-scroll-y').length 
						? $wrapper.find('.wa-datagrid-scroll-y')
						: $('<div class="wa-datagrid-scroll-y"><i></i></div>').appendTo($wrapper);
					$wrapper.height($wrapper.height());//去小数点
					$scrolly.css({height: $wrapper.height(), top: $wrapper.scrollTop()})
						.find('i').css({
							height: $wrapper.height()*$wrapper.height()/$wrapper[0].scrollHeight,
							top: $wrapper.height()*$wrapper.scrollTop()/$wrapper[0].scrollHeight
						});
					
					$scrolly.find('i').unbind('.scrolly').bind('mousedown.scrolly', function(e) {
						$('body').css('cursor', 'default');
						$(this).parent().addClass('active');
						var el = this;
						prevClientY = e.clientY;
						$(document).bind('mousedown.scrolly', function(e) {});
						$(document).bind('mousemove.scrolly', function(e) {
							if(e.clientY<$wrapper[0].getBoundingClientRect().top || e.clientY>$wrapper[0].getBoundingClientRect().top+$wrapper.height()) {return;}
							var top = $(el)[0].offsetTop+(e.clientY - prevClientY);
							var sTop = top/$wrapper.height()*$wrapper[0].scrollHeight;
							if(top<0) {top = 0;}
							if(top>$wrapper.height()-$(el).height()) {top = $wrapper.height()-$(el).height();}
							if(sTop<0) {sTop = 0;}
							if(sTop>$wrapper[0].scrollHeight-$wrapper.height()) {sTop = $wrapper[0].scrollHeight-$wrapper.height();}
							$(el).css({top: top});
							$(el).parent().css({top: sTop});
							prevClientY = e.clientY;
							that.isScrollY = true;
							$wrapper.scrollTop(sTop);
							that.$t1.find('.wa-datagrid-body').scrollTop(sTop);
							that.$t2.find('.wa-datagrid-body').scrollTop(sTop);
							window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						});
						$(document).bind('mouseup.scrolly', function(e) {
							$('body').css('cursor', '');
							$(el).parent().removeClass('active');
							$(document).unbind('.scrolly');
							window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
						});
					});
				}else {
					$wrapper.find('.wa-datagrid-scroll-y').remove();
				}
			}
			adjustScroll(this.$btable3.parent());
		},
		_formatterHeight: function() {
			this._initHeight();
			this._adjustHeadHeight();
			this._initBodyHeight();
			this._adjustBodyHeight();
			this.$detail&&this.$detail.css({top: this.$detailRow.offset().top+this.$detailRow[0].clientHeight});
			this.$detail&&(this.detailTop = this.$detailRow.offset().top-this.$container.offset().top+this.$detailRow.height()+this.$t3.find('.wa-datagrid-body').scrollTop());
		},
		_formatterWidth: function() {
			this._initWidth();
			this._adjustBodyWidth();
		}
	});
	
	$.extend(datagrid.prototype, {
		frozeRow: function(index) {
			var that = this;
			var fzCount = Math.max(that.$btableFz1.find('tr').length,that.$btableFz2.find('tr').length,that.$btableFz3.find('tr').length);
			var bCount = Math.max(that.$btable1.find('tr').length,that.$btable2.find('tr').length,that.$btable3.find('tr').length);
			if(index>=fzCount) {//冻结
				if(that.$btableFz3.height()+that.$btable3.find('tr').eq(index).height()>that.$t3.find('.wa-datagrid-body').height()-100) {
					return false;
				}
				that.$btable1.find('tr').eq(index-fzCount).appendTo(that.$btableFz1);
				that.$btable2.find('tr').eq(index-fzCount).appendTo(that.$btableFz2);
				that.$btable3.find('tr').eq(index-fzCount).appendTo(that.$btableFz3);
			}else {//解冻
				that.$btableFz1.find('tr').eq(index).prependTo(that.$btable1);
				that.$btableFz2.find('tr').eq(index).prependTo(that.$btable2);
				that.$btableFz3.find('tr').eq(index).prependTo(that.$btable3);
			}
			this._clearDetail();
			this._f1();
			this.striped(this.setting.striped);
			this._adjustBodyHeight();
			this._magicEvent();
		},
		striped: function(f) {
			var that = this;
			if(f) {
				var index = 0;
				var rsFz = Math.max(this.$btableFz1.find('tr').length, this.$btableFz2.find('tr').length, this.$btableFz3.find('tr').length);
				for(var i=0; i<rsFz; i++) {
					var $els = that.$btableFz1.find('tr').eq(i).add(that.$btableFz2.find('tr').eq(i)).add(that.$btableFz3.find('tr').eq(i));
					index%2==0
						? $els.addClass('wa-datagrid-striped-row')
						: $els.removeClass('wa-datagrid-striped-row')
					index++;
				}
				var rs = Math.max(this.$btable1.find('tr').length, this.$btable2.find('tr').length, this.$btable3.find('tr').length);
				for(var i=0; i<rs; i++) {
					var $els = that.$btable1.find('tr').eq(i).add(that.$btable2.find('tr').eq(i)).add(that.$btable3.find('tr').eq(i));
					index%2==0
						? $els.addClass('wa-datagrid-striped-row')
						: $els.removeClass('wa-datagrid-striped-row')
					index++;
				}
			}else {
				this.$container.find('tr').removeClass('wa-datagrid-striped-row');
			}
		},
		goPage: function(page) {
			this.setting.currentPage = Number(page);
			this._initData();
		},
		nextPage: function() {
			if(this.setting.currentPage*this.setting.pageSize >= this.setting.data.total) return;
			this.goPage(this.setting.currentPage+1);
		},
		prevPage: function() {
			if(this.setting.currentPage==1) return;
			this.goPage(this.setting.currentPage-1);
		},
		changeCellHeight: function(cellHeight) {
			this.setting.cellHeight = cellHeight;
			this.$container.find('tr:not(.wa-datagrid-placeholder-row) td').height(cellHeight);
			this.$container.find('.wa-datagrid-body').scrollTop(0);
			this._formatterHeight();
		},
		sort: function(field, order) {
			var that = this;
			var sortFunc = {
				asc: function(a, b) {
					if(a[field]==b[field]) return 0;
					if(a[field]>b[field]) return 1;
					if(a[field]<b[field]) return -1;
				},
				desc: function(a, b) {
					if(a[field]==b[field]) return 0;
					if(a[field]<b[field]) return 1;
					if(a[field]>b[field]) return -1;
				}
			};
			this.setting.data.rows.sort(sortFunc[order]);
			this._initBody(this.setting.data.rows);
		}
	});
	
	$.fn.datagrid = function(setting) {
		if(typeof setting == 'object') {
			$(this).data() && $(this).data().datagrid && $(this).data().datagrid.$container.remove();
			setting.$el = $(this);
			var d = new datagrid(setting);
			$(this).data('datagrid', d);
		}
		if(typeof setting == 'string') {
			$(this).data() && $(this).data().datagrid 
				&& $(this).data().datagrid[setting].apply($(this).data().datagrid,Array.prototype.slice.call(arguments, 1));
		}
	};

}(jQuery));