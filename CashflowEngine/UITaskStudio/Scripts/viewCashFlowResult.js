;(function() {
  var VueI18n = {
    install: function(Vue, options) {
      Vue.directive('i18n', function(args) {
        if (args.value != undefined && options[args.language] != undefined) {
          window.localStorage.language = args.language
          var val = eval('options.' + args.language + '.' + args.value)
          if (args.replace != undefined && args.replace.length > 0) {
            args.replace.forEach(function(v, k) {
              val = val.replace(new RegExp("\\{" + k + "\\}", "g"), v)
            })
          }
          if (val != undefined) {
            if (this.modifiers.placeholder) {
              this.el.setAttribute('placeholder', val)
            }else if (this.modifiers.title) {
              this.el.setAttribute('title', val)
            } else {
              this.el.innerHTML = val
            }
          } else {
            this.el.innerHTML = ""
          }
        } else {
          this.el.innerHTML = ""
        }
      })
    }
  }
  if (window.Vue) window.VueI18n = VueI18n;
})();

(function($){
  var alertMsg = function(text,status,time){
    var time = time || 1500;
    if (!$('#alertTip')[0]) {
        var $alert = $('<div id="alertTip"/>');
        $alert.css({
          'position':'fixed',
          'top':'0',
          'left':'50%',
          'right':'50%',
          'margin':'0 -100px',
          'width':'200px',
          'height':'40px',
          'line-height':'40px',
          'text-align':'center',
          'border-radius':'0 0 5px 5px',
          'z-index':'9999'
        });
        (status) ? 
          $alert.css({
            'background-color':'#dff0d8',
            'color':'#3c763d'
          }) :
          $alert.css({
            'background-color':'#f2dede',
            'color':'#a94442'
          });
        $('<span>'+text+'</span>').appendTo($alert);
        $alert.appendTo(document.body);
        setTimeout(function () {
            $('#alertTip').animate({
              top:'-40px'
            },300,function () {
                $(this).remove();
            });
        }, time);
    }
  }
  window.alertMsg = alertMsg;
})(jQuery);

(function(){

  // 创建图表对象
  var chartObj = {
    chart:{},
    title: {
        text: '&nbsp;',
        useHTML: true
    },
    xAxis: {
        categories: [],
        crosshair: true
    },
    yAxis: {
        title: {
            text: '数量'
        }
    },
    plotOptions: {
        spline: {
          lineWidth: 1,
          marker: {
            radius: 3
          }
        },
        column:{
          borderWidth:0
        },
        area:{
          lineWidth:1
        },
        bar: {
          borderWidth:0,
          stacking: 0
        }
    },
    credits: {
        enabled: false
    },
    series:[]
  };

  var chartColor = ["#ee7ea8","#4ad987","#0168b7","#f6b37f","#84ccc9", "#4f91e4","#fe8ccc", "#fcf366", "#9ba6e6", "#f16d92", "#7cd465", "#3cb51b",
    "#6f7edd", "#955fde", "#997bc2", "#a4c01f","#f6f78d","#29b343","#08c92c","#08c9be"];

  // 初始化程序
  function init(){

    var appDomain = getUrlParam('appDomain');
    var sessionId = getUrlParam('sessionId');
    var taskCode = getUrlParam('taskCode');
    var trustId = getUrlParam('trustId');
    var isShowGrid = getUrlParam('isShowGrid');
    initChartTheme(chartColor);

    var data = {
      language:'en',
      resultModel : [],
      isActive : 0,
      resultChartData : [],
      resultCardData : [],
      mixSplineIds : [],
      mixColumnIds : [],
      mixAreaIds : [],
      step :1,
      cardRows : 1,
      chartUse : 'spline',
      mixChartUse : 'spline',
      pageSize : 4,
      pageCount : 0,
      pageCurrent : 0,
      viewCardData : [], // 需要显示的卡片数据
      viewChartData : [], // 需要显示的图表数据
      viewMixChartData : '',
      chartTitle :'',
      searchChartData : '',
      cardAnimate : 'slideInRight',
      openCard:true,
      openMixChart:true,
      showEdit: false,
      showModal: false,
      showCardModal : false,
      showGrid: (isShowGrid == 1 || isShowGrid == null || isShowGrid == '')? true : false,
      chartIds:[]
    };

    // 中英文翻译
    Vue.use(VueI18n,{
        cn: {
          title:'现金流结果展示',
          nav:{
            b1:'添加图表',
            b2:'刷新',
            b3:'计算结果',
            b4:'偏好设置',
            b5:'保存'
          },
          c1:'曲线图',
          c2:'柱状图',
          c3:'区域图',
          c4:'散列图',
          c5:'堆叠图',
          dropdown:{
            chart:{
              step1:{
                h3:'选择一个图表',
                button:'下一步'
              },
              step2:{
                h3:'图表配置',
                title:'创建一个图表标题',
                titletip:'图表标题',
                prev:'上一步',
                button:'创建图表'
              }
            },
            language:'语言',
            card:{
              titletip:'设置卡片行数',
              row:'单行',
              tworows:'两行',
              threerows:'三行'
            }
          },
          searchtext:'请输入关键字',
          selectdatatip:'选择需要展示的数据',
          cardboxtitle:'卡片流',
          nocardcontent:'您可以点击右上角 <i class="icon-plus-circled"></i>按钮 添加卡片数据',
          mixcharttitle:'混合图表',
          nochartcontent:'您可以点击右上角 <i class="icon-cog"></i>按钮 添加图表数据',
          card:{
            add:{
              title:'添加卡片',
              button:'创建卡片'
            },
            edit:{
              title:'编辑卡片',
              button:'保存编辑'
            }
          },
          chart:{
            status:'编辑',
            title:'编辑图表标题',
            titletip:'图表标题',
            button:'保存编辑'
          },
          mixchart:{
            status:'混合图表配置',
            button:'保存配置'
          },
          main:'主页'
        },
        en: {
          title:'CashFlow Displayer',
          nav:{
            b1:'New Chart',
            b2:'Refresh',
            b3:'Calculation Results',
            b4:'Preferences',
            b5:'Save'
          },
          c1:'Line',
          c2:'Column',
          c3:'Area',
          c4:'Scatter',
          c5:'Bar',
          dropdown:{
            chart:{
              step1:{
                h3:'Select a chart',
                button:'Next Step'
              },
              step2:{
                h3:'Chart configuration',
                title:'Create a chart title',
                titletip:'Chart title',
                prev:'Prev Step',
                button:'Create'
              }
            },
            language:'Language',
            card:{
              titletip:'Card rows',
              row:'One',
              tworows:'Two',
              threerows:'Three'
            }
          },
          searchtext:'Search',
          selectdatatip:'Select the data that needs to be displayed',
          cardboxtitle: 'Cards Wall',
          nocardcontent: 'TO add a card, click <i class="icon-plus-circled"></i>',
          mixcharttitle: 'Combo Charts',
          nochartcontent: 'To add data series, click <i class="icon-cog"></i>',
          card:{
            add:{
              title:'New card',
              button:'Create'
            },
            edit:{
              title:'Editing card',
              button:'Save'
            }
          },
          chart:{
            status:'Editing',
            title:'Edit chart title',
            titletip:'Chart title',
            button:'Save'
          },
          mixchart:{
              status: 'Combo charts configuration',
            button:'Save'
          },
          main: 'homepage'
        }
    });

    Vue.directive('chart', function (options) {
        $(this.el).highcharts(options);
    });

    Vue.directive('scroll',function(){
        $(this.el).perfectScrollbar({
          suppressScrollX:true
        });
    });

    // 数字四舍五入，保留两位小数
    Vue.filter('tofixed', function (value,limit) {
      limit = limit > 0 && limit <= 20 ? limit : 2;
      value = parseFloat((value).replace(/[^\d\.-]/g, "")).toFixed(limit) + "";
      var integer = value.split(".")[0].split("").reverse(), decimal = value.split(".")[1];
      var newValue = "";
      for (i = 0; i < integer.length; i++) {
        newValue += integer[i] + ((i + 1) % 3 == 0 && (i + 1) != integer.length ? "," : "");
      }  
      return newValue.split("").reverse().join("") + "." + decimal;
      // return value.substring(0,value.indexOf(".") + 3);
    });

    Vue.transition('zoom', {
        enterClass: 'zoomIn',
        leaveClass: 'zoomOutDown',
        stagger: function (index) {
            return Math.min(300, index * 50)
        }
    });

    // 获取数据
    var preparePage = function (that) {
        if (appDomain && sessionId) {
            webProxy.getCashFlowRunCaculateResult(appDomain, sessionId, function (response) {
                if(response)that.resultCardData = response;
            });
            webProxy.getCaskFlowRunResultBySessionId(appDomain, sessionId, function (response) {
                that.resultChartData = response;
                dataGrid.bindArraysToGrid(response);
                webProxy.getTaskChartByTaskCode(appDomain, taskCode, 'Chart', function (response) {
                    if (response != '') {
                        var xml = $.parseXML(response);
                        var cards = $(xml).find('cards');
                        var charts = $(xml).find('charts');
                        var mix = $(xml).find('mixChart');
                        that.language = $(xml).find('result').attr('language');
                        if (cards[0]) {
                            that.cardRows = cards.attr('rows');
                            that.openCard = (cards.attr('status')=='true')?true:false;
                            cards.find('card').each(function (i) {
                              that.fetchCardData($(this).text().split(','));
                            });
                        }
                        if (charts[0]) {
                            charts.find('spline').each(function (i) {
                                var chartData = creatChart(that.resultChartData, $(this).text().split(','), 'spline', $(this).attr('title'),$(this).attr('colors').split(','));
                                that.viewChartData.push(chartData);
                            });
                            charts.find('column').each(function (i) {
                                var chartData = creatChart(that.resultChartData, $(this).text().split(','), 'column', $(this).attr('title'),$(this).attr('colors').split(','));
                                that.viewChartData.push(chartData);
                            });
                            charts.find('area').each(function (i) {
                                var chartData = creatChart(that.resultChartData, $(this).text().split(','), 'area', $(this).attr('title'),$(this).attr('colors').split(','));
                                that.viewChartData.push(chartData);
                            });
                            charts.find('scatter').each(function (i) {
                                var chartData = creatChart(that.resultChartData, $(this).text().split(','), 'scatter', $(this).attr('title'),$(this).attr('colors').split(','));
                                that.viewChartData.push(chartData);
                            });
                            charts.find('bar').each(function (i) {
                                var chartData = creatChart(that.resultChartData, $(this).text().split(','), 'bar', $(this).attr('title'),$(this).attr('colors').split(','));
                                that.viewChartData.push(chartData);
                            });
                        }
                        if (mix[0]) {
                            that.openMixChart = (mix.attr('status')=='true') ? true : false; 
                            that.mixSplineIds = (mix.find('spline').text() != "") ? mix.find('spline').text().split(',') : [];
                            that.mixColumnIds = (mix.find('column').text() != "") ? mix.find('column').text().split(',') : [];
                            that.mixAreaIds = (mix.find('area').text()) ? mix.find('area').text().split(',') : [];
                            var createChart = creatMixChart(that.resultChartData, that.mixSplineIds, that.mixColumnIds, that.mixAreaIds);
                            if(that.mixSplineIds!=''||that.mixColumnIds!=''||that.mixAreaIds!='') that.viewMixChartData = createChart;
                        }
                    }
                });
            });
        } else {
            alertMsg((that.language=='cn')?'缺少参数!':'lost some parameters');
        }
    };

    // 注册所有Vue组件
    var components = {
      register:function(){
        this.modal();
        this.grid();
        this.editChart();
        this.editCard();
      },
      modal:function(){
        Vue.component('dialog-modal', {
          template : '#modal-template',
          props : ['show']
        });
      },
      grid:function(){
          Vue.component('grid-view', {
              template : '#grid-template',
              props: ['show'],
              methods:{
                  JSONToExcel: function () {
                      var sourceData = data.resultChartData;
                      var jsonData = [];
                      sourceData.forEach(function (row, i) {
                          var rows = { rowlName: row.ItemName};
                          row.ItemValue.forEach(function (value, j) {
                              var column ='{"col_' + j + '":"' + value + '"}'
                              column = JSON.parse(column);
                              $.extend(rows, column);
                            })
                         jsonData.push(rows);
                      });
                      var strJson = JSON.stringify(jsonData);
                      webProxy.DataToExcel(strJson, function (filePath) {
                         var url = webProxy.siteAppUrl + '/Files/' + filePath;
                         window.open(url);
                      });
              }
          },
          ready: function () {
            var ResultTable = document.getElementById('divResultTable');
            ResultTable.style.width = window.innerWidth + 'px';
            ResultTable.style.height = (window.innerHeight - 30)  + 'px';
            dataGrid.vspread = new GcSpread.Sheets.Spread(ResultTable);
            dataGrid.vspread.tabStripVisible(false);
            dataGrid.bindcontextmenu();
            dataGrid.asheet = dataGrid.vspread.getSheet(0);
            dataGrid.asheet.setFrozenColumnCount(1); //固定列
            dataGrid.asheet.defaults.rowHeight = 25;
            dataGrid.asheet.defaults.colWidth = 150;
            dataGrid.asheet.frozenlineColor("#e7e7e7");
          }
        });
      },
      editChart:function(){
        Vue.component('edit-chart', {
            template: '#edit-chart-template',
            props: ['show', 'language'],
            data:function(){
                return {
                resultChartData :[],
                editData :[],
                searchChartData :'',
                chartIds : [],
                chartUse : '',
                index:0,
              }
            },
            methods:{
              saveEdit:function(){
                var createChart = JSON.parse(JSON.stringify(this.editData));
                if(this.editData.title==''){
                  $('#editChartTitle').focus();
                  alertMsg((this.language=='cn')?'图表标题不能为空!':'Chart title is empty!');
                  return false;
                }
                if(this.chartIds==''){
                  alertMsg((this.language=='cn')?'图表数据不能为空!':'Chart data is empty!');
                  return false;
                }
                var chartData = selectChartData(this.resultChartData,this.chartIds);
                createChart.chart.chart.type = this.chartUse;
                createChart.chart.xAxis.categories = chartData.cashFlowPeriodList;
                createChart.chart.series = chartData.cashFlowDataList;
                $('.box-body').eq(this.index).highcharts().destroy();
                this.$root.viewChartData.splice(this.index,1);
                this.$root.viewChartData.splice(this.index,0,createChart);
                this.searchChartData = '';
                this.show = false;
                alertMsg((this.language == 'cn') ? '编辑成功!' : 'Successfully edited!', true);
              }
            },
            watch:{
              editData:function(nv){
                  var _this = this;
                  if (nv != undefined && nv != '') {
                        this.chartIds = [];
                        this.chartUse = nv.chart.chart.type;
                        nv.chart.series.forEach(function(item){
                          _this.chartIds.push(item.name);
                        })
                  }

              }
            }
        });
      },
      editCard:function(){
        Vue.component('edit-card',{
          props:['show','language'],
          template : '#edit-card-template',
          data:function(){
            return {
              type:'add',
              index:0,
              resultCardData:[],
              cardIds:[],
              searchCardData:''
            }
          },
          methods:{
            createCard:function(){
              if(this.cardIds!=''){
                this.$root.fetchCardData(this.cardIds);
                this.show = false;
                if (this.$root.viewCardData.length % 4 == 0) {
                    this.$root.pageCurrent = parseInt(this.$root.viewCardData.length / 4) - 1;
                } else {
                    this.$root.pageCurrent = parseInt(this.$root.viewCardData.length / 4);
                }
                alertMsg((this.language=='cn')?'卡片添加成功!':'Successfully created!',true);
              }
            },
            saveEdit:function(){
              var _this = this , card = [];
              if(this.cardIds==''){
                alertMsg((this.language=='cn')?'卡片数据不能为空!':'Card data is empty');
              }else{
                this.cardIds.forEach(function(id){
                   _this.resultCardData.forEach(function(row){
                    if(row.ItemName== id){
                      card.push(row);
                    }
                   })
                });
                this.$root.viewCardData.splice(this.index,1);
                this.$root.viewCardData.splice(this.index,0,card);
                this.show = false;
                alertMsg((this.language=='cn')?'卡片编辑成功!':'Successfully edited!',true);
              }
            }
          }
        });
      }
    };

    components.register();

    //创建一个实例化，注册所有组件、指令、方法
    new Vue({
        el:'#app',
        data:data,
        created: function () {
            var that = this;
            if (appDomain && trustId) {
                webProxy.getTaskCodeAndSessionIdFromTrustId(appDomain, trustId, function (response) {
                    taskCode = response.TaskCode;
                    sessionId = response.SessionId;
                    preparePage(that);
                })
            } else {
                preparePage(that);
            }
        },
        methods: {
            redirect: function () {
                window.location.href = location.protocol + "//" + location.host + '/CashflowEngine/UITaskStudio/index.html?appDomain=' + appDomain + '&taskCode=' +taskCode + '';
            },
            dropdown:function(index){
                this.searchChartData = '';
                this.isActive = (this.isActive == index)?0:index;
            },
            selectChart:function(chart){
                this.chartUse = chart;
                this.step = 2;
            },
            // 创建图表
            createChart:function(){
                var _this = this;

                if(_this.chartTitle==''){
                    $('#chartTitle').focus();
                    alertMsg((this.language=='cn')?'图表标题不能为空!':'Chart title is empty');
                    return false;
                }
                if(_this.chartIds==''){
                    alertMsg((this.language=='cn')?'图表数据不能为空!':'Chart data is empty');
                    return false;
                }
                this.viewChartData.push(
                  creatChart(this.resultChartData,this.chartIds,this.chartUse,this.chartTitle)
                );
                this.closePopBox();

                alertMsg((this.language == 'cn') ? '创建成功!' : 'Successfully created!', true);
            },
            refresh:function(){
                this.viewCardData = [];
                this.viewChartData = [];
                this.viewMixChartData = '';
                this.chartIds = [];
                this.mixSplineIds = [];
                this.mixColumnIds = [];
                this.mixAreaIds = [];
                alertMsg((this.language == 'cn') ? '刷新成功!' : 'Successfully refreshed!', true);
            },
            // 关闭导航弹出层
            closePopBox:function(){
                this.step = 1;
                this.isActive =0;
                this.chartIds = [];
                this.chartTitle = '';
                this.chartUse = 'spline';
            },
            addCard:function(){
                this.showCardModal = true;
                this.$refs.editcard.type = 'add';
                this.$refs.editcard.resultCardData = this.resultCardData;
                this.$refs.editcard.cardIds = [];
                this.$refs.editcard.searchCardData = '';
            },
            fetchCardData:function(ids){
                var _this = this , card = [];
                // 更新卡片列表
                ids.forEach(function(id){
                    _this.resultCardData.forEach(function(row){
                        if(row.ItemName== id){
                            card.push(row);
                        }
                    })
                });
                this.viewCardData.push(card);
            },
            editCard:function(card,index){
                var cardIds = [];
                card.forEach(function(item){
                    cardIds.push(item.ItemName);
                });
                this.showCardModal = true;
                this.$refs.editcard.type = 'edit';
                this.$refs.editcard.index = index;
                this.$refs.editcard.resultCardData = this.resultCardData;
                this.$refs.editcard.cardIds = cardIds;
                this.$refs.editcard.searchCardData = '';
            },
            deleteCard:function(index){
                this.viewCardData.splice(index, 1);
                alertMsg((this.language == 'cn') ? '删除成功!' : 'Successfully deleted!', true);
            },
            editChart:function(chart,index){
                this.showEdit = true;
                this.$refs.editchart.index = index;
                this.$refs.editchart.resultChartData = this.resultChartData;
                this.$refs.editchart.editData = chart;
            },
            deleteChart:function(index){
                $('.box-body').eq(index).highcharts().destroy();
                this.viewChartData.splice(index,1);
                alertMsg((this.language == 'cn') ? '删除成功!' : 'Successfully deleted!', true);
            },
            saveMixSetting:function(){
                this.viewMixChartData = '';
                var createChart = creatMixChart(this.resultChartData,this.mixSplineIds,this.mixColumnIds,this.mixAreaIds);
                if(createChart!='') this.viewMixChartData = createChart;
                this.showModal = false;
                alertMsg((this.language == 'cn') ? '配置成功!' : 'Successfully configed!', true);
            },
            prev:function(){
                this.pageCurrent-=1;
                this.cardAnimate = 'slideInLeft';
            },
            next:function(){
                this.pageCurrent+=1;
                this.cardAnimate = 'slideInRight';
            },
        save:function(event){
          $(event.target).text((this.language=='cn')?'保存中...':'Saving...');
          var that = this;
          var cardXml = '<card>{0}</card>';
          var chartXml = '<{0} title="{1}" colors="{3}">{2}</{0}>';
          var charts = '';
          var card = '';
          var mixChart = '';
          var taskResultXml = '';
          if(this.viewCardData!=''){
            this.viewCardData.forEach(function(item){
              var itemName = [];
              item.forEach(function(row){
                itemName.push(row.ItemName);
              });
              card+=cardXml.format(itemName.join(','));
            });
          }
          card = '<cards rows="{0}" status="{1}">{2}</cards>'.format(this.cardRows,this.openCard,card);
          taskResultXml += card;
          if(this.viewChartData!=''){
            this.viewChartData.forEach(function(data){
              var itemName = [];
              data.chart.series.forEach(function(row){
                itemName.push(row.name);
              });
              charts+=chartXml.format(data.chart.chart.type,data.title,itemName.join(','),data.chart.colors.join(','));
            });
            charts = '<charts>{0}</charts>'.format(charts);
            taskResultXml += charts;
          }
          
          if(this.viewMixChartData!=''){
            this.mixSplineIds = [];
            this.mixColumnIds = [];
            this.mixAreaIds = [];
            this.viewMixChartData.series.forEach(function(row){
              switch(row.type){
                case 'spline':
                  that.mixSplineIds.push(row.name);
                break;
                case 'column':
                  that.mixColumnIds.push(row.name);
                break;
                case 'area':
                  that.mixAreaIds.push(row.name);
                break;
              }
            });
            mixChart += '<spline>{0}</spline>'.format(this.mixSplineIds.join(','));
            mixChart += '<column>{0}</column>'.format(this.mixColumnIds.join(','));
            mixChart += '<area>{0}</area>'.format(this.mixAreaIds.join(','));
          }
          mixChart = '<mixChart status="{1}">{0}</mixChart>'.format(mixChart,this.openMixChart);
          taskResultXml += mixChart;
          taskResultXml = '<result language="{1}">{0}</result>'.format(taskResultXml,this.language);
          if(taskCode==''){
            alertMsg((this.language=='cn')?'缺少参数,保存失败!':'Missing parameter!');
            return false;
          }
          webProxy.saveProcessTaskChart(appDomain,taskCode,'Chart',taskResultXml,function(response){
            if(response) alertMsg((that.language=='cn')?'保存成功!':'Successfully saved',true);
            $(event.target).text((that.language=='cn')?'保存':'Save');
          })
        }
      },
      computed : {
        // 计算卡片当前页个数
        pageSize : function(){
          return this.cardRows * 4;
        },
        // 计算已选中卡片总页数
        pageCount : function(){
          return this.viewCardData.length / this.pageSize;
        }
      },
      watch: {
        cardRows : function(){
          this.pageCurrent = 0;
        }
      }
    });
  }

  var creatMixChart = function(resultChartData,mixSplineIds,mixColumnIds,mixAreaIds){

      var createChart = JSON.parse(JSON.stringify(chartObj));
      var cashFlowDataList = []; // 图表数据
      var cashFlowPeriodList = []; // X轴分组
      var cashFlowData = function(ids,type){
          ids.forEach(function (id) {
              resultChartData.forEach(function (row) {
                  var name = row.ItemName, value = row.ItemValue;
                  if (name == id && name != "DateIndex") {
                      var data = [];
                      value.forEach(function (i) {
                          data.push((i == '') ? 0 : parseFloat(i.replace(/,/gm, "")));
                      });
                      cashFlowDataList.push({ name: name, data: data, type: type });
                  }
              });
          });
      }

      if(mixSplineIds!='') cashFlowData(mixSplineIds,'spline');
      if(mixColumnIds!='') cashFlowData(mixColumnIds,'column');
      if (mixAreaIds != '') cashFlowData(mixAreaIds, 'area');

      resultChartData.filter(function (item) {
          if (item.ItemName == "DateIndex") {
              cashFlowPeriodList = item.ItemValue;
          }
      });

      if (cashFlowPeriodList == '' && cashFlowDataList != '') {
          for (var j = 0; j < cashFlowDataList[0].data.length; j++) {
              cashFlowPeriodList.push(j + 1);
          }
      }
      createChart.chart.type = "";
      createChart.chart.width = (window.screen.width > 1440 ) ?  1350 : 1122;
      createChart.chart.height = 500;
      createChart.xAxis.categories = cashFlowPeriodList;
      createChart.series = cashFlowDataList;

      return createChart;
  }
  var creatChart = function(resultChartData,chartIds,chartUse,title,colors){
    var createChart = JSON.parse(JSON.stringify(chartObj));
    var chartData = selectChartData(resultChartData,chartIds);

    if(!colors){
      var randomsort = function() {
        return Math.random()>.5 ? -1 : 1;
      }
      colors = chartColor.sort(randomsort);
    }

    createChart.chart.type = chartUse;
    createChart.chart.width = (window.screen.width > 1440 ) ?  430 : 354;// 兼容视网膜屏幕下宽度适应
    createChart.chart.height = 400;
    createChart.colors = colors;
    createChart.xAxis.categories = chartData.cashFlowPeriodList;
    createChart.series = chartData.cashFlowDataList;

    return {
      title:title,
      chart:createChart
    }
  }
  var selectChartData = function(chartData,ids){

      var cashFlowDataList = []; // 图表数据
      var cashFlowPeriodList = []; // X轴分组
      ids.forEach(function(id){
        // 两次循环，筛选已选中数据
        chartData.forEach(function(row){
          var name = row.ItemName , value = row.ItemValue;
          if(name == id && name != "DateIndex" ){
              var data = [];
              value.forEach(function(i){
                data.push((i=='')?0:parseFloat(i.replace(/,/gm, "")));
              });
              cashFlowDataList.push({ name: name, data: data});
          }
        })
      });
      chartData.filter(function (item) {
          if (item.ItemName == "DateIndex") {
              cashFlowPeriodList = item.ItemValue;
          }
      });
      if (cashFlowPeriodList == '' && cashFlowDataList != '') {
          for (var j = 0; j < cashFlowDataList[0].data.length; j++) {
              cashFlowPeriodList.push(j + 1);
          }
      };
      return {
          cashFlowDataList : cashFlowDataList,
          cashFlowPeriodList : cashFlowPeriodList
      };
  }
  var initChartTheme = function(colors){
    Highcharts.theme = {
    colors: colors,
    chart: {
      backgroundColor: '#1e3548'
    },
    title: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase',
        fontSize: '20px'
      }
    },
    subtitle: {
      style: {
        color: '#E0E0E3',
        textTransform: 'uppercase'
      }
    },
    xAxis: {
      gridLineColor: '#2b4d69',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#2b4d69',
      minorGridLineColor: '#505053',
      tickColor: '#2b4d69',
      title: {
        style: {
          color: '#A0A0A3'

        }
      }
    },
    yAxis: {
      gridLineColor: '#162837',
      labels: {
        style: {
          color: '#E0E0E3'
        }
      },
      lineColor: '#162837',
      minorGridLineColor: '#505053',
      tickColor: '#2b4d69',
      tickWidth: 1,
      title: {
        style: {
          color: '#A0A0A3'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      style: {
        color: '#F0F0F0'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          color: '#B0B0B3'
        },
        marker: {
          lineColor: '#273a4a'
        }
      },
      boxplot: {
        fillColor: '#505053'
      },
      candlestick: {
        lineColor: 'white'
      },
      errorbar: {
        color: 'white'
      }
    },
    legend: {
      itemStyle: {
        color: '#E0E0E3'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#606063'
      }
    },
    credits: {
      style: {
        color: '#666'
      }
    },
    labels: {
      style: {
        color: '#707073'
      }
    }
    };
    Highcharts.setOptions(Highcharts.theme);
  }
  init();
})();