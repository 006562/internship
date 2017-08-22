/**
 * 收益分配历史数据 Page: IncomeDistributionHistoryData.html
 */
(function ($, window) {
    var CATALOG_TITLE_ID_PREFIX = 'catalogTitle_';
    var CATALOG_CONTENT_ID_PREFIX = 'catalogContent_';
    var numberFormatUtils = new window.NumberFormatUtils();

    var config = {
        tmsDataProcessBase: GlobalVariable.DataProcessServiceUrl,
        titleTemplate: '第{0}期'
    };

    // Wcf services
    function WcfDataServices() {
        function getWcfCommon(param) {
            var serviceUrl = config.tmsDataProcessBase + "CommonExecuteGet?appDomain=TrustManagement&resultType=commom&executeParams=" + window.JSON.stringify(param);
            return $.ajax({
                type: "GET",
                url: serviceUrl,
                dataType: "jsonp",
                crossDomain: true,
                contentType: "application/json;charset=utf-8",
                beforeSend: function() {
                    //$('#loading').fadeOut();
                }
            });
        }

        function getWcfTrustPeriod(trustId) {
            var trustPeridParam = {
                "SPName": "usp_GetTrustPeriod",
                "SQLParams": [
                    {
                        "Name": "trustId",
                        "value": trustId,
                        "DBType": "string"
                    },
                    {
                        "Name": "TrustPeriodType",
                        "value": "PaymentDate_CF",
                        "DBType": "string"
                    }
                ]
            };

            return getWcfCommon(trustPeridParam);
        }

        function getWcfFactBondPaymentBalance(trustId, reportedDateId) {
            var bondBalanceParam = {
                "SPName": "usp_GetFactBondPaymentBalance",
                "SQLParams": [
                    {
                        "Name": "trustId",
                        "value": trustId,
                        "DBType": "int"
                    },
                    {
                        "Name": "ReportingDateId",
                        "value": reportedDateId,
                        "DBType": "string"
                    }
                ]
            };
            return getWcfCommon(bondBalanceParam);
        }

        function getWcfFactTrustTransactionFee(trustId, reportedDateId) {
            var transFeeParam = {
                "SPName": "usp_GetFactTrustTransactionFee",
                "SQLParams": [
                    {
                        "Name": "trustId",
                        "value": trustId,
                        "DBType": "int"
                    },
                    {
                        "Name": "ReportingDateId",
                        "value": reportedDateId,
                        "DBType": "string"
                    }
                ]
            };
            return getWcfCommon(transFeeParam);
        }

        function getWcfFactTrustTransactionCashInflow(trustId, reportedDateId) {
            var transCashInflowParam = {
                "SPName": "usp_GetFactTrustTransactionCashInflow",
                "SQLParams": [
                    {
                        "Name": "trustId",
                        "value": trustId,
                        "DBType": "int"
                    },
                    {
                        "Name": "ReportingDateId",
                        "value": reportedDateId,
                        "DBType": "string"
                    }
                ]
            };
            return getWcfCommon(transCashInflowParam);
        }

        return {
            getWcfTrustPeriod: getWcfTrustPeriod,
            getWcfFactBondPaymentBalance: getWcfFactBondPaymentBalance,
            getWcfFactTrustTransactionFee: getWcfFactTrustTransactionFee,
            getWcfFactTrustTransactionCashInflow: getWcfFactTrustTransactionCashInflow
        }
    }

    /**
    * Knockout view model, with simple json.
        [
            {
                name: "",
                startDate: "",
                endDate: "",
                totalInteretDays: '',
                cashDay: '',
                amounts: [
                    {
                        itemName: '',
                        interet: 0
                    }
                ]
            }
        ])    
    */
    function AppViewModel() {
        var self = this;
        self.historyIncomes = ko.observableArray([]);

        var render = {
            trustCashInflow: function (trustNo, cashData) {
                $.each(cashData, function (i, data) {
                    self.historyIncomes()[trustNo].periodCashInflows.push({
                        displayName: data.DisplayName,
                        amount: formatMoney(data.Amount)
                    });
                });
            },
            trustTransaction: function (trustNo, feeData) {
                $.each(feeData, function (i, data) {
                    self.historyIncomes()[trustNo].periodFees.push({
                        feeType: data.FeeType,
                        accountType: data.AccountType,
                        displayName: data.DisplayName,
                        feeDueAmount: formatMoney(data.FeeDue),
                        feePaidAmount: formatMoney(data.FeePaid)
                    });
                });
            },
            bondPayment: function (trustNo, balanceData) {
                $.each(balanceData, function (i, data) {
                    self.historyIncomes()[trustNo].periodBalances.push({
                        type: data.Type,
                        accountType: data.AccountType,
                        displayName: data.DisplayName,
                        currentRate: numberFormatUtils.formatMoney(data.CurrentRate, 4),
                        openingBalance: formatMoney(data.OpeningBalance),
                        closingBalance: formatMoney(data.ClosingBalance)
                    });
                });
            }
        }

        self.catalogTitleClick = function(index, source, event) {
            var $catalogtitle = $('#' + CATALOG_TITLE_ID_PREFIX + index);
            var $catalogContent = $('#' + CATALOG_CONTENT_ID_PREFIX + index);
            var isUiAvaiable = $catalogContent.data('avaiable') === '1';

            var defer = $.Deferred();
            var filter = function(defer) {
                if (!isUiAvaiable) {
                    var reportDateId = source.endDate().dateFormat('yyyyMMdd');
                    return $.when(wcfDataServices.getWcfFactTrustTransactionCashInflow(appTrustId, reportDateId),
                        wcfDataServices.getWcfFactTrustTransactionFee(appTrustId, reportDateId),
                        wcfDataServices.getWcfFactBondPaymentBalance(appTrustId, reportDateId));

                }

                defer.resolve();
                return defer.promise();
            };

            // render ui
            $.when(filter(defer))
                .then(function(cashInflowData, transFeeData, balanceData) {
                    if (!isUiAvaiable && cashInflowData && transFeeData && balanceData) {
                        var cashInflowDataJson = JSON.parse(cashInflowData[0]);
                        var feeDataJson = JSON.parse(transFeeData[0]);
                        var balanceDataJson = JSON.parse(balanceData[0]);

                        render.trustCashInflow(index, cashInflowDataJson);
                        render.trustTransaction(index, feeDataJson);
                        render.bondPayment(index, balanceDataJson);
                        $catalogContent.data('avaiable', '1');
                    }

                    $catalogtitle.toggleClass('active');
                    incrementCatalogHeight();
                    $catalogContent.slideToggle('normal', function() {
                        calcCatalogHeight();
                    });                   
                }, function(response) {
                    alert('error is: ' + response);
                });
        };
    }

    function getQueryParam(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var param = url.match(reg);
        if (param != null) return unescape(param[2]);
        return false;
    };

    function incrementCatalogHeight() {
        var $catalogContainer = $('.catalog');
        var catalogListHeight = $('.catalog-scroll .catalog-list').height();
        $catalogContainer.height(catalogListHeight + 600);
    }

    function calcCatalogHeight() {
        var $catalogContainer = $('.catalog');
        var catalogListHeight = $('.catalog-scroll .catalog-list').height(); 
        $catalogContainer.height(catalogListHeight + 80);
    }
    
    function formatMoney(p) {
        if (parseFloat(p) === 0) {
            return '-';
        };

        return numberFormatUtils.formatMoney(p, "auto");
    }

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    var wcfDataServices = new WcfDataServices();
    var appViewModel = new AppViewModel();
    var appTrustId = getQueryParam(window.location.search.substr(1), 'tid');

    function init() {
        wcfDataServices.getWcfTrustPeriod(appTrustId).then(function (response) {
            var trustPeriods = JSON.parse(response);
            $.each(trustPeriods, function (index, trustPeriod) {
                var startDate = getStringDate(trustPeriod.StartDate);
                var endDate = getStringDate(trustPeriod.EndDate);

                appViewModel.historyIncomes.push(ko.mapping.fromJS({
                    name: config.titleTemplate.StringFormat(index + 1),
                    startDate: startDate,
                    endDate: endDate,
                    totalInteretDays: moment(endDate).diff(moment(startDate), 'days') + 1,
                    cashDay: endDate.dateFormat('yyyy-MM-dd'),
                    periodCashInflows: [],
                    periodFees: [],
                    periodBalances: []
                }));
            });

            ko.applyBindings(appViewModel);
            calcCatalogHeight();
        });

        $(window).resize(throttle(calcCatalogHeight, 200));
    }

    init();
})($, window);
