<style>
header{
  height: 50px;
}
.title-input-group{
    width: 70%;
    top: 7px;
}
.dropdown-toggle{
  position: absolute;
  top: 7px;
  right: 95px;
}
.dropdown-toggle:hover{
  background-color: #286090;
}
.icon-sort-down{
  position: relative;
  top: -2px;
}
.dropdown-area{
    position: fixed;
    z-index: 9;
    top: 53px;
    right: 10px;
    width: 500px;
    height: 350px;
}
.dropdown-area .dropdown-textarea{
    height: 100%;
    border: 1px solid #66afe9;
    padding-bottom: 22px;
}
.dropdown-area .dropdown-textarea:-ms-input-placeholder {
    color: #ccc;
}
.dropdown-area .dropdown-textarea:focus{
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
}
.clear-btn{
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 14px;
    color: #f00;
    border-color: transparent;
}
.clear-btn:hover{
  color: #f00;
  border-color: #b96060;
}
.clear-btn:focus{
  color: #f00;
}
.btn-submit{
  position: absolute;
  top: 7px;
  right: 10px;
}
.btn-submit:hover{
  background-color: #398439;
}
.main-body{
  position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
}
.amount-wraper{
  padding-top: 5px;
  padding-bottom: 2px;
  overflow: hidden;
}
</style>
<template>
  <div @click="showTextarea = false;">
  <header>
    <nav class="navbar navbar-default navbar-fixed-top br0 pl10 pr10">
      <div class="input-group title-input-group">
        <span class="input-group-addon">ConnectionStrings</span>
        <input type="text" class="form-control" placeholder="ConnectionStrings" v-model="connectionStrings">
      </div>
      <button type="button" class="btn btn-primary dropdown-toggle" @click.stop="toggleTextarea">
        select from table 
        <span class="icon-sort-down" v-show="!showTextarea"></span>
        <span class="icon-up-dir" v-else></span>
      </button>
      <button type="button" class="btn btn-default btn-success btn-submit" @click="submit">
        Submit
      </button>
    </nav>
    <div class="dropdown-area" v-show="showTextarea">
      <textarea class="form-control dropdown-textarea" placeholder="Query..." v-model="queryString" @click.stop></textarea>
      <button class="btn btn-xs btn-default clear-btn" @click.stop="clearSql">Clear</button>
    </div>
  </header>
  <main class="main-body">
  <div class="amount-wraper">
    <span class="pull-right">共{{count}}条</span>
  </div>
    <table class="table table-hover">
      <thead>
        <tr class="info">
          <th v-for="title in ecDataTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ec in ecData">
          <td v-for="data in ec">
            {{data}}
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</div>
</template>
<script>
var webProxy = require("../lib/common/js/webProxy.js");
var dataProcess = require("../lib/common/js/dataProcess.js");

export default {
  data() {
      return {
        connectionStrings:"Server=dal_sec;Database=DAL_SEC_PoolConfig;Trusted_Connection=True;",
        queryString:"",
        count:"",
        ecData:[],
        ecDataTitle:[],
        showTextarea: false
    }
  },
  computed:{
     ecDataTitle:function(){
        if(this.ecData.length){
          return Object.keys(this.ecData[0]);
        }
     }
  },
  methods: {
    closePreview: function() {
      window.close();
    },
    toggleTextarea: function () {
      this.showTextarea = !this.showTextarea;
      this.$nextTick(function () {
        $(".dropdown-textarea").focus();
      })
    },
    submit:function(){
        if(this.queryString){
         var strArray = this.queryString.toLowerCase().split("from");
         var strcount =  "select count(1) as count from" + strArray[1];
       //var strquery = this.queryString.toLowerCase().replace(/select/g,"select top 150");
       //var strcount = this.queryString.toLowerCase().replace(/(.+?)from/gm,"select count(1) from");
        
          webProxy.getECResult(this.connectionStrings,this.queryString,function(response){
              this.ecData = response;
          }.bind(this));
          
          webProxy.getECResult(this.connectionStrings,strcount,function(response){
              this.count = response[0].count;
          }.bind(this)); 
        }
    },
    clearSql: function () {
      this.queryString = "";
    }
  },
  ready:function(){
    var sql = decodeURIComponent(this.$route.query.sql);
    if(sql!=='undefined'){
       this.queryString = sql;
       this.submit();
    }
  }
}
</script>
