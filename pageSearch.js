!(function () {

  function pageSearch(options){
    this.table = null;
    this.options = $.extend({
    container:'#my-page',//容器
    settingBtn:'#setting',//容器内的按钮
    table:'#page-table',//容器内的table
    customColumns:{
      pageId: '',//(必填)自定义列需要用到的id 必须唯一
      pageFieldList: [],//(必填)页面字段配置
      columns: null,//(必填)列配置项
      columnDefaults: null
    },
    DataTable:{}//保留dataTables参数
    },options);

    this.main();
  }

  $.extend(pageSearch.prototype,{
    main:function(){
      this.renderThead();
      this.setDefault();
      this.initTable();
      this.events();
    },
    // 对datatables设置默认参数
    setDefault:function(){
      $.extend($.fn.dataTable.defaults,{
        searching: false,// 禁用搜索
        ordering: false,// 禁用排序
        dom: "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5 page-info'li><'col-sm-7'p>>",
        scrollY: 400 // 表格里使用滚动
      });
    },
    //初始化dataTables
    initTable:function(){
      var opts = this.options;
      var formatColumns = this.handleDataTableOption();
      var dataTablesOption = $.extend({
        columns:formatColumns.columns,
        aoColumnDefs:formatColumns.aoColumnDefs
      },opts.DataTable);
      this.table = $(opts.table,opts.container).DataTable(dataTablesOption);
    },
    // 事件绑定
    events:function(){

    },
    // 把数据转成dataTables需要的格式
    handleDataTableOption:function(){
      var customColumns = this.options.customColumns;
      var colums = [];
      var columnDefs = [];
      $.each(customColumns.pageFieldList, function (i, fieldInfo) {
          var fieldName = fieldInfo.fieldName;
          var columnDefObj = customColumns.columnDefaults && customColumns.columnDefaults[fieldName];
          colums.push($.extend({
              data: fieldName,
              visible: fieldInfo.display
          }, customColumns.columns ? customColumns.columns[fieldName] : {}));
          if (columnDefObj) {
              columnDefs.push($.extend({
                  aTargets: [i]
              }, columnDefObj));
          }
      });

      return {
          columns: colums,
          aoColumnDefs: columnDefs
      }
    },
    // 渲染表头
    renderThead:function(){
      var that = this;
      var customColumns = this.options.customColumns;
      var thead = '<tr>';
      $.each(customColumns.pageFieldList, function (i, fieldInfo) {
          if (fieldInfo.display) {
              thead += '<th title="' + fieldInfo.displayName + '">' + fieldInfo.displayName + '</th>';
          } else {
              thead += '<th style="display:none;" title="' + fieldInfo.displayName + '">' + fieldInfo.displayName + '</th>';
          }
      });
      thead += '</tr>';
      $('thead', that.options.table).html(thead);
    }
  });

  $.pageSearch = pageSearch;
})();