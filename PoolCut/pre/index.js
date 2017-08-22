/// <reference path="E:\TFS-Local\SFM\Products\PoolCut\PoolCut\Scripts/PoolCutCommon.js" />
var ECPreviewControl = {
    el: "#PoolECForm",
    data: {
        ecModel: [],
        checkedSet: [],
        CriteriaTypeCodeSet: [],
        ecData: [],
        ecDataTitle: []
    },
    computed: {
        allChecked: {
            get: function () {
                if (this.ecModel.length) {
                    return this.checkedCount == this.ecModel.length;
                } else {
                    return false;
                }
            },
            set: function (value) {
                if (value) {
                    this.checkedSet = this.ecModel.map(function (v, i) {
                        return v.CriteriaId;
                    })
                } else {
                    this.checkedSet = []
                }
            }
        },
        checkedCount: {
            get: function () {
                return this.checkedSet.length;
            }
        }
    },
    methods: {
        redirectSelect: function (index) {
            ecModel[index].activeView = 'Verification';
            var query = this.ecModel[index].ECQeury;
            var sql = query.toLowerCase().replace(/select/g, "select top(150)").trim();

            var strArray = this.queryString.toLowerCase().split("from");
            var strcount = "select count(1) as count from" + strArray[1];
        },
        //closePreview: function() {
        //    window.close();
        //},
        saveEnableEC : function(){
            // 2017.04.27
            var dimPoolId = parseInt(getUrlParam("poolId"));
            var ECs = dataProcess.ecListModelToEnabelDisableXml(this.ecModel);

            console.log(ECs)

            var executeParam = {
                SPName: 'usp_EnableDisableECs', SQLParams: [
                    { Name: 'DimPoolId', value: dimPoolId, DBType: 'int' },
                    { Name: 'ECs', value: ECs, DBType: 'xml' }
                ]
            };
            var executeParams = JSON.stringify(executeParam);
            var params = '';
            params += '<root appDomain="dbo" postType="" connString="' + TargetSqlConnection + '">';// appDomain="TrustManagement"
            params += executeParams;
            params += '</root>';

            var serviceUrl = GlobalVariable.DataProcessServiceUrl + "CommonPostExecute";

            $.ajax({
                type: "POST",
                url: serviceUrl,
                dataType: "json",
                contentType: "application/xml;charset=utf-8",
                data: params,
                processData: false,
                success: function (response) {
                    alert('保存成功!');
                },
                error: function (response) { alert("error is :" + response); }
            });
        },
        saveCriteria: function () {
            var criteriaCode = this.$route.params.code;
            var criteriaSetXml = dataProcess.ecListModelToCriteriaSetXml(this.ecModel);


            var executeParam = { SPName: 'config.usp_saveCriteriaSet', SQLParams: [] };
            executeParam.SQLParams.push({ Name: 'Operator', 'Update': 'string' });
            executeParam.SQLParams.push({ Name: 'CriteriaSetCode', Value: criteriaCode, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'OldCriteriaSetCode', Value: criteriaCode, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'CriteriaSetXML', Value: criteriaSetXml, DBType: 'xml' });

            var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var serviceUrl = GlobalVariable.PoolCutServiceURL
                + 'CommonGet?connName=DAL_SEC_PoolConfig&exeParams={0}'.format(executeParams);
            CallWCFSvc(serviceUrl, true, 'GET', function (response) {
                alert('保存成功!');
            });

        },
        saveECEntities: function (ecModel) {
            var poolId = getUrlParam("poolId");
            var criteriaId = ecModel.CriteriaId;
            var ecSetType = "";
            var dimOrganisationID = PoolHeader.DimOrganisationID;
            var ecType = ecModel.CriteriaTypeCode;
            var criteriaName = ecModel.CriteriaName;
            var criteriaDesc = ecModel.CriteriaDescription;
            var isEnabled = ecModel.IsEnable;
            var ecPassNo = ecModel.ECPassNo;
            var xmlSqlQueryEC = dataProcess.ecModelToXml(ecModel);
            var xmlSqlQueryDrillThrough = dataProcess.ecModelToXmlSqlQueryDrill(ecModel.XMLSqlQueryDrillThrough);
            var criteriaTableTypeCode = ecModel.CriteriaTableTypeCode;

            var ecUpdateBy = "";
            var executeParam = { SPName: 'dbo.usp_SaveECEntity', SQLParams: [] };
            executeParam.SQLParams.push({ Name: 'PoolId', Value: poolId, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'CriteriaId', Value: criteriaId, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'ECSetType', Value: ecSetType, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'DimOrganisationID', Value: dimOrganisationID, DBType: 'int' });
            executeParam.SQLParams.push({ Name: 'ECType', Value: ecType, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'CriteriaName', Value: criteriaName, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'CriteriaDesc', Value: criteriaDesc, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'IsEnabled', Value: isEnabled, DBType: 'bool' });
            executeParam.SQLParams.push({ Name: 'ECPassNo', Value: ecPassNo, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'XmlSqlQueryEC', Value: xmlSqlQueryEC, DBType: 'xml' });
            executeParam.SQLParams.push({ Name: 'XMLSqlQueryDrillThrough', Value: xmlSqlQueryDrillThrough, DBType: 'xml' });
            executeParam.SQLParams.push({ Name: 'CriteriaTableTypeCode', Value: criteriaTableTypeCode, DBType: 'string' });
            executeParam.SQLParams.push({ Name: 'ECUpdateBy', Value: ecUpdateBy, DBType: 'string' });

            var executeParams = encodeURIComponent(JSON.stringify(executeParam));
            var serviceUrl = GlobalVariable.PoolCutServiceURL
                + 'CommonGetWithConnStr?connStr={0}&exeParams={1}'.format(encodeURIComponent(TargetSqlConnection), executeParams);
            CallWCFSvc(serviceUrl, true, 'GET', function (response) {
                alert('保存成功!');
            });
        },
        refreshQuery: function (EC) {
            EC.activeView = 'Query';
            dataProcess.getQuery(EC);
        }
    },
    created: function () {
        var self = this

        var executeParam = { SPName: 'dbo.usp_GetECEntities', SQLParams: [] };
        executeParam.SQLParams.push({ Name: 'PoolId', Value: PoolId, DBType: 'int' });
        executeParam.SQLParams.push({ Name: 'PoolCutPurpose', Value: PoolCutPurpose, DBType: 'string' });

        var executeParams = encodeURIComponent(JSON.stringify(executeParam));
        var serviceUrl = GlobalVariable.PoolCutServiceURL
            + 'CommonGetWithConnStr?connStr={0}&exeParams={1}'.format(encodeURIComponent(TargetSqlConnection), executeParams);
        CallWCFSvc(serviceUrl, true, 'GET', function (response) {
            console.log(response);
            dataProcess.getCriteriaListModel(self.$root.appDomain, response, function (viewModel) {
                self.ecModel = dataProcess.getViewCriteriaListModel(viewModel);

            })
        });
    },
    watch: {
        ecModel: function (nv) {
            var self = this;
            var codeSet = [];

            nv.forEach(function (value, index) {
                if (value.IsEnable) {
                    self.checkedSet.push(value.CriteriaId);
                }
                if (codeSet.indexOf(value.CriteriaTypeCode) == -1) {
                    codeSet.push(value.CriteriaTypeCode);
                }
            })
            codeSet.forEach(function (v, i) {
                self.CriteriaTypeCodeSet.push({
                    code: v,
                    isShow: true
                })
            })
        },
        'checkedSet.length': function () {
            var self = this;
            self.ecModel.forEach(function (value, index) {
                value.IsEnable = false;
            })
            self.checkedSet.forEach(function (value, index) {
                self.ecModel.forEach(function (v, i) {
                    if (value == v.CriteriaId) {
                        v.IsEnable = true;
                    }
                })
            })

        }
    }
}
