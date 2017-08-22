/// <reference path="../Scripts/knockout-3.4.0.js" />
/// <reference path="../Scripts/knockout.mapping-latest.js" />
/// <reference path="../Scripts/jquery-1.7.2.min.js" />
/// <reference path="viewTrustWizard.js" />

var TrustSPRoleModule = (function () {
    var dealStructureModel;
    var data = {};
    //暂停{7F3374F7-CE21-4033-99B9-D47FAAC89869}
    //var defaultSPTypeId = "";
    var accountItemCodeArray = [
        "TrusteeBank",
        "ScrutinyBank",
        "TrusteeRegistrationPaymentAgent",
        "ScrutinyAccount",
        "TrusteeAccount",
        "ManagementFeeAccount",
        "AssetProviderServiceFeeAccount",
        "TrusteeFeeAccount",
        "ScrutinyFeeAccount"
    ];
    //var TrustInfoTest = [{ "Category": "RatingAgency", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "联合信用评级有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "5", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "RatingAgency", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "上海新世纪资信评估投资服务有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "17", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "会计师事务所", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "AccoutingFirm", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "其他增信机构", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "CreditEnhancementProvider", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "法律事务所", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "LawFirm", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "流动性支持机构", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "LiquidityProvider", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "保险机构", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "LMIProvider", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "原始权益人", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "Originator", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "差额支付承诺人", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "RoleUnderwriterDealer", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "计划管理人", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "Servicer", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderRoleType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "保证机构", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "", "SPRItemCode": "Sponsor", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "北京京东世纪贸易有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "京东", "SPId": "1", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "华泰证券（上海）资产管理有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "华泰资管", "SPId": "2", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "兴业银行股份有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "兴业银行", "SPId": "3", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "中国证券登记结算有限公司深圳分公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "中债登", "SPId": "4", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "联合信用评级有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "联合评级", "SPId": "5", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "北京市奋迅律师事务所", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "北京奋讯", "SPId": "6", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "普华永道中天会计师事务所", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "普华永道", "SPId": "7", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "深圳证券交易所", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "深交所", "SPId": "8", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "浙商银行股份有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "浙商行", "SPId": "9", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "华鑫证券有限责任公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "华鑫证券", "SPId": "10", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "摩根士丹力华鑫证券有限责任公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "摩根士丹力华鑫", "SPId": "11", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "远东国际租赁有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "远东租赁", "SPId": "12", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "远东宏信（天津）融资租赁有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "远东宏信（天津）", "SPId": "13", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "招商证券资产管理有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "招商资管", "SPId": "14", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "招商银行股份有限公司上海分行", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "招商银行（上海）", "SPId": "15", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "中国证劵登记结算有限责任公司上海分公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "中证登上海公司", "SPId": "16", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "上海新世纪资信评估投资服务有限公司", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "上海新世纪资信", "SPId": "17", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "ServiceProviderType", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "上海证券交易所固定收益证券综合电子平台", "ItemCode": "", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "上海证券交易所", "SPId": "18", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "利率形式", "ItemCode": "CouponPaymentReference", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行币种", "ItemCode": "CurrencyOfIssuance", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "票面金额", "ItemCode": "Denomination", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "计息天数", "ItemCode": "InterestDays", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "法定到期日", "ItemCode": "LegalMaturityDate", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "原始评级", "ItemCode": "OriginalCreditRating", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "还款方式", "ItemCode": "PaymentConvention", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "分期单位", "ItemCode": "PaymentFrequence", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "还本计划", "ItemCode": "PrincipalSchedule", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "证券代码", "ItemCode": "SecurityExchangeCode", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "PR后简称", "ItemCode": "ShortName", "ItemId": "", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "债券级别", "ItemCode": "ClassName", "ItemId": "0", "ItemValue": "优先01", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "基准利率", "ItemCode": "CouponBasis", "ItemId": "0", "ItemValue": "0.004", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行日期", "ItemCode": "IssueDate", "ItemId": "0", "ItemValue": "2015-11-02", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行金额", "ItemCode": "OfferAmount", "ItemId": "0", "ItemValue": "40000000.00", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "债券级别", "ItemCode": "ClassName", "ItemId": "1", "ItemValue": "优先02", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "基准利率", "ItemCode": "CouponBasis", "ItemId": "1", "ItemValue": "0.005", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行日期", "ItemCode": "IssueDate", "ItemId": "1", "ItemValue": "2015-11-02", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行金额", "ItemCode": "OfferAmount", "ItemId": "1", "ItemValue": "30000000.00", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "债券级别", "ItemCode": "ClassName", "ItemId": "2", "ItemValue": "次级", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "基准利率", "ItemCode": "CouponBasis", "ItemId": "2", "ItemValue": "0.006", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行日期", "ItemCode": "IssueDate", "ItemId": "2", "ItemValue": "2015-11-02", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "发行金额", "ItemCode": "OfferAmount", "ItemId": "2", "ItemValue": "20000000.00", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondRating", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "", "ItemCode": "", "ItemId": "0", "ItemValue": "AAA", "Precision": null, "SPCode": "", "SPId": "5", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondRating", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "", "ItemCode": "", "ItemId": "1", "ItemValue": "AA", "Precision": null, "SPCode": "", "SPId": "5", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustBondRating", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "", "ItemCode": "", "ItemId": "2", "ItemValue": "BBB", "Precision": null, "SPCode": "", "SPId": "5", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "资产服务机构解任事件", "ItemCode": "AssetAgencyOutgoing", "ItemId": "0", "ItemValue": "NA|NA|SpeedupRepayment|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "违约事件", "ItemCode": "BreachEvent", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "累计违约率事件", "ItemCode": "CumulativeBrenchRate", "ItemId": "0", "ItemValue": "ge|0.05|SpeedupRepayment|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "丧失清偿能力事件", "ItemCode": "LoseRepaymentAbilityEvent", "ItemId": "0", "ItemValue": "NA|NA|SpeedupRepayment|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "计划管理人解任事件", "ItemCode": "PlanerOutgoing", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "权利完善通知事件", "ItemCode": "RightImproveAlert", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "权利完善事件", "ItemCode": "RightImproveEvent", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "重大不利影响事件", "ItemCode": "SignificantAdverseAffect", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "重大不利变化事件", "ItemCode": "SignificantAdverseChanges", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "加速清偿事件", "ItemCode": "SpeedupRepayment", "ItemId": "0", "ItemValue": "NA|NA|NA|CumulativeBrenchRate,LoseRepaymentAbilityEvent", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustEventItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "True", "ItemAliasValue": "托管银行解任事件", "ItemCode": "TrustBankOutgoing", "ItemId": "0", "ItemValue": "NA|NA|NA|NA", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "年度资产管理报告日", "ItemCode": "AnnualAssetManagementReportDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "年度资产管理报告日比较对象", "ItemCode": "AnnualAssetManagementReportDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "年度资产管理报告日计算天数", "ItemCode": "AnnualAssetManagementReportDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "资产服务机构报告日", "ItemCode": "AssetProviderReportDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "资产服务机构报告日比较对象", "ItemCode": "AssetProviderReportDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "资产服务机构报告日计算天数", "ItemCode": "AssetProviderReportDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "年度审计报告日", "ItemCode": "AunualAuditReportDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "年度审计报告日比较对象", "ItemCode": "AunualAuditReportDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "年度审计报告日计算天数", "ItemCode": "AunualAuditReportDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "收益分配公告日", "ItemCode": "BondPaymentReportingDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "收益分配公告日比较对象", "ItemCode": "BondPaymentReportingDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "收益分配公告日计算天数", "ItemCode": "BondPaymentReportingDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "资金回收计算日 R", "ItemCode": "CollectionDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "日期调整规则", "ItemCode": "DateAdjustmentRule", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "资金确定日", "ItemCode": "FundReadyDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "回收款转付日", "ItemCode": "FundTransferDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "分配指令划款日", "ItemCode": "InstructedPaymentDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "分配指令划款日比较对象", "ItemCode": "InstructedPaymentDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "分配指令划款日计算天数", "ItemCode": "InstructedPaymentDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "交易所资料提交日", "ItemCode": "ListingMaterialsSubmissionDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "交易所资料提交日比较对象", "ItemCode": "ListingMaterialsSubmissionDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "交易所资料提交日计算天数", "ItemCode": "ListingMaterialsSubmissionDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "权益登记日", "ItemCode": "NotesHolderRegistrationDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "计划管理人分配日", "ItemCode": "OrganisorAllocateDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "计划管理人分配日比较对象", "ItemCode": "OrganisorAllocateDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "计划管理人分配日计算天数", "ItemCode": "OrganisorAllocateDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "计划管理人报告日", "ItemCode": "OrganisorReportDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "计划管理人报告日比较对象", "ItemCode": "OrganisorReportDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "计划管理人报告日计算天数", "ItemCode": "OrganisorReportDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "兑付日 T", "ItemCode": "PaymentDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "资产池封包日", "ItemCode": "PoolCloseDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "跟踪评级报告日", "ItemCode": "RatingTrackReportingDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "跟踪评级报告日比较对象", "ItemCode": "RatingTrackReportingDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "跟踪评级报告日计算天数", "ItemCode": "RatingTrackReportingDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "循环购买期数", "ItemCode": "RevolvingPeriod", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "托管银行划款日", "ItemCode": "TrusteeBankPaymentDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "托管银行划款日比较对象", "ItemCode": "TrusteeBankPaymentDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "托管银行划款日计算天数", "ItemCode": "TrusteeBankPaymentDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "托管银行报告日", "ItemCode": "TrusteeBankReportDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "托管银行报告日比较对象", "ItemCode": "TrusteeBankReportDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "托管银行报告日计算天数", "ItemCode": "TrusteeBankReportDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "专项计划设立日", "ItemCode": "TrustStartDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Date", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "True", "ItemAliasValue": "中登资料提交日", "ItemCode": "ZhongDengMaterialsSubmissionDate", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "String", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "中登资料提交日比较对象", "ItemCode": "ZhongDengMaterialsSubmissionDate_CT", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustExtensionItem", "DataType": "Int", "EndDate": null, "IsCalculated": "True", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "中登资料提交日计算天数", "ItemCode": "ZhongDengMaterialsSubmissionDate_DC", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "含已销售资产", "ItemCode": "IsSoldLoanAvailable", "ItemId": "0", "ItemValue": "1", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "支持循环结构", "ItemCode": "IsTopUpAvailable", "ItemId": "0", "ItemValue": "1", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "所属企业", "ItemCode": "OrganisationName", "ItemId": "0", "ItemValue": "UNK", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "信托代码", "ItemCode": "TrustCode", "ItemId": "0", "ItemValue": "JD201502", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "费率", "ItemCode": "Fee", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "AccoutingFirm", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "费率", "ItemCode": "Fee", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "LawFirm", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "账户名称", "ItemCode": "NameofAccount", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "LawFirm", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItemDefault", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "账户名称", "ItemCode": "NameofAccount", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItemDefault", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "费率", "ItemCode": "Fee", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItemDefault", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "第一联系人", "ItemCode": "FirstAccount", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItemDefault", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "False", "IsPrimary": "False", "ItemAliasValue": "第二联系人", "ItemCode": "SecondAccount", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "费率", "ItemCode": "Fee", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "Originator", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustServiceProviderItem", "DataType": "", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "账户名称", "ItemCode": "NameofAccount", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "Originator", "StartDate": null, "UnitOfMeasure": null }, { "Category": "TrustWaterFall", "DataType": "Date", "EndDate": null, "IsCalculated": "False", "IsCompulsory": "True", "IsPrimary": "False", "ItemAliasValue": "信托现金流", "ItemCode": "TrustWaterFall", "ItemId": "0", "ItemValue": "", "Precision": null, "SPCode": "", "SPId": "0", "SPRItemCode": "", "StartDate": null, "UnitOfMeasure": null }];

    var InitSPRoleJson = function (sourceData) {
        //暂停{7F3374F7-CE21-4033-99B9-D47FAAC89869}
        /*
        //var serviceProviders = TrustInfo["ServiceProviderType"] || [];
        ////    $.grep(TrustInfo, function (trustItem) {
        ////    return trustItem.Category == "ServiceProviderType";
        ////});
        ////serviceProviders = arrarySort(serviceProviders);

        //var spsArray = new Array();
        //$.each(serviceProviders, function (m, sp) {
        //    var spObj = new Object();
        //    spObj.SPTitle = sp.ItemAliasValue;
        //    spObj.SPCode = sp.SPCode;
        //    spObj.SPId = sp.SPId;
        //    spsArray.push(spObj);
        //});
        //if (spsArray.length > 0) {
        //    defaultSPTypeId = spsArray[0].SPId;
        //}
        */
        //Get all service provider roles
        var sproles = TrustInfo["ServiceProviderRoleType"] || [];
        //$.grep(TrustInfo, function (item) {
        //    return item.Category == "ServiceProviderRoleType";
        //});
        //sproles = arrarySort(sproles);

        var sproleitems = TrustInfo["TrustServiceProviderItem"] || [];
        //$.grep(TrustInfo, function (item) {
        //    return item.Category == "TrustServiceProviderItem";
        //});

        //get defalt roleitems
        var optionalsproleitems = TrustInfo["TrustServiceProviderItemDefault"] || [];
        //    $.grep(TrustInfo, function (item) {
        //    return item.Category == "TrustServiceProviderItemDefault";
        //});
        //optionalsproleitems = arrarySort(optionalsproleitems);
        //generate sproles json

        var optionalsproleitemsEx1 = [
           "FirstContact",
           "Phone",
           "Fax",
           "Email"
        ];
        var optionalsproleitemsEx2 = [
           "NameofAccount",
           "BankName",
           "AccountNo",
           "BigVolumeAccountNo",
           "Fee"
        ];

        var sprolesArray = new Array();
        var optionalsprolesArray = new Array();

        $.each(sproles, function (n, sprole) {
            var role = new Object();
            role.Title = sprole.ItemAliasValue;
            role.SPRItemCode = sprole.SPRItemCode;
            role.SPCode = sprole.SPCode;
            //暂停{7F3374F7-CE21-4033-99B9-D47FAAC89869}
            //role.SPId = defaultSPTypeId;
            role.SPId = '';

            var optionalFields = [];
            var displayFields = [];
            var curLibiaryItemCodes = [];
            if ($.inArray(role.SPRItemCode, accountItemCodeArray) >= 0)
                curLibiaryItemCodes = optionalsproleitemsEx2;
            else
                curLibiaryItemCodes = optionalsproleitemsEx1;

            $.each(optionalsproleitems, function (a, roleItem) {
                if ($.inArray(roleItem.ItemCode, curLibiaryItemCodes) >= 0) {
                    var hasroleItems = $.grep(sproleitems, function (item) {
                        return item.SPRItemCode == sprole.SPRItemCode && item.ItemCode == roleItem.ItemCode;
                    });
                    if (hasroleItems.length > 0) {
                        var sproleitem = new Object();

                        sproleitem.FieldTitle = hasroleItems[0].ItemAliasValue;
                        sproleitem.ItemValue = hasroleItems[0].ItemValue;
                        sproleitem.ItemCode = hasroleItems[0].ItemCode;
                        sproleitem.ItemId = hasroleItems[0].ItemId;

                        sproleitem.IsCompulsory = hasroleItems[0].IsCompulsory;
                        sproleitem.DataType = hasroleItems[0].DataType;
                        sproleitem.UnitOfMeasure = hasroleItems[0].UnitOfMeasure;
                        sproleitem.Precise = hasroleItems[0].Precise;

                        if (hasroleItems[0].ItemValue != null && hasroleItems[0].ItemValue != "") {
                            role.SPCode = hasroleItems[0].SPCode;
                            displayFields.push(sproleitem);
                        }
                        else if (hasroleItems[0].IsCompulsory == "True") {
                            displayFields.push(sproleitem);
                        }
                        else {
                            optionalFields.push(sproleitem);
                        }
                    }
                    else {
                        var defaultoption = new Object();
                        defaultoption.FieldTitle = roleItem.ItemAliasValue;
                        defaultoption.ItemValue = roleItem.ItemValue;
                        defaultoption.IsCompulsory = roleItem.IsCompulsory;
                        defaultoption.DataType = roleItem.DataType;
                        defaultoption.ItemCode = roleItem.ItemCode;
                        defaultoption.ItemId = roleItem.ItemId;
                        defaultoption.UnitOfMeasure = roleItem.UnitOfMeasure;
                        defaultoption.Precise = roleItem.Precise;
                        optionalFields.push(defaultoption);
                    }
                }
            });
            role.OptionalFields = optionalFields;
            role.DisplayFields = displayFields;

            var trustServiceProviderItems = TrustInfo['TrustServiceProviderItem'] || [];
            var sprolehasitems = $.grep(trustServiceProviderItems, function (item) {
                return item.SPRItemCode == sprole.SPRItemCode && item.ItemValue != "";
            });
            if (sprole.IsCompulsory == "True") {
                role.IsCompulsory = true;
                sprolesArray.push(role);
            }
            else if (sprolehasitems.length > 0) {
                role.IsCompulsory = false;
                sprolesArray.push(role);
            }
            else {
                role.IsCompulsory = false;
                optionalsprolesArray.push(role);
            }
        });
        //暂停{7F3374F7-CE21-4033-99B9-D47FAAC89869}
        //data.ServiceProviders = spsArray;
        data.ServiceProviderRoles = sprolesArray;
        data.ServiceProviderRolesEx = [];
        data.OptionalServiceProviderRoles = optionalsprolesArray;
        data.OptionalServiceProviderRolesEx = [];

        //console.log("lllll");
        //console.log(data.OptionalServiceProviderRoles);
        //console.log(data.ServiceProviderRoles);

        data.OptionalServiceProviderRoles = filterTmp(data.OptionalServiceProviderRoles, data.OptionalServiceProviderRolesEx);
        //console.log(data.OptionalServiceProviderRoles);
        //console.log(data.OptionalServiceProviderRolesEx);

        data.ServiceProviderRoles = filterTmp(data.ServiceProviderRoles, data.ServiceProviderRolesEx);
        //console.log(data.ServiceProviderRoles);
        //console.log(data.ServiceProviderRolesEx);

        function filterTmp(sourceArray, array1) {
            var tmpArray = [];
            $.each(sourceArray, function (i, n) {
                if ($.inArray(n.SPRItemCode, accountItemCodeArray) >= 0)
                    array1.push(n);
                else
                    tmpArray.push(n);
            });
            return tmpArray;
        }
    }

    var dataBinding = function (node) {
        dealStructureModel = ko.mapping.fromJS(data);
        ko.applyBindings(dealStructureModel, node);
    };

    var addNew = function (obj) {
        var pre = $(obj).parent().prev().find("#selOptionalFields").val();
        var sproleindex = obj.attributes['sproleindex'].value;
        if (dealStructureModel.ServiceProviderRoles()[sproleindex].OptionalFields().length > 0) {
            var oNew = dealStructureModel.ServiceProviderRoles()[sproleindex].OptionalFields()[pre];
            dealStructureModel.ServiceProviderRoles()[sproleindex].OptionalFields.remove(oNew);
            dealStructureModel.ServiceProviderRoles()[sproleindex].DisplayFields.push(oNew);
        }
        else {
            return false;
        }
    }

    var addNewEx = function (obj) {
        var pre = $(obj).parent().prev().find("#selOptionalFields").val();
        var sproleindex = obj.attributes['sproleindex'].value;
        if (dealStructureModel.ServiceProviderRolesEx()[sproleindex].OptionalFields().length > 0) {
            var oNew = dealStructureModel.ServiceProviderRolesEx()[sproleindex].OptionalFields()[pre];
            dealStructureModel.ServiceProviderRolesEx()[sproleindex].OptionalFields.remove(oNew);
            dealStructureModel.ServiceProviderRolesEx()[sproleindex].DisplayFields.push(oNew);
        }
        else {
            return false;
        }
    }

    var addNewRole = function () {
        var roleindex = $("#selSPRole").val();
        if (dealStructureModel.OptionalServiceProviderRoles().length > 0) {
            var optionRole = dealStructureModel.OptionalServiceProviderRoles()[roleindex];
            dealStructureModel.ServiceProviderRoles.push(optionRole);
            dealStructureModel.OptionalServiceProviderRoles.remove(optionRole);
        }
        else { return false; }
    }

    var addNewRoleEx = function () {
        var roleindex = $("#selSPRoleEx").val();
        if (dealStructureModel.OptionalServiceProviderRolesEx().length > 0) {
            var optionRole = dealStructureModel.OptionalServiceProviderRolesEx()[roleindex];
            dealStructureModel.ServiceProviderRolesEx.push(optionRole);
            dealStructureModel.OptionalServiceProviderRolesEx.remove(optionRole);
        }
        else { return false; }
    }

    var deleteField = function (fObj) {
        var fieldIndex = $(fObj).parent().parent().attr("fieldIndex");
        var roleind = $(fObj).parent().parent().parent().attr("roleIndex");
        var deletefield = dealStructureModel.ServiceProviderRoles()[roleind].DisplayFields()[fieldIndex];
        dealStructureModel.ServiceProviderRoles()[roleind].OptionalFields.push(deletefield);
        dealStructureModel.ServiceProviderRoles()[roleind].DisplayFields.remove(deletefield);
    }

    var deleteFieldEx = function (fObj) {
        var fieldIndex = $(fObj).parent().parent().attr("fieldIndex");
        var roleind = $(fObj).parent().parent().parent().attr("roleIndex");
        var deletefield = dealStructureModel.ServiceProviderRolesEx()[roleind].DisplayFields()[fieldIndex];
        dealStructureModel.ServiceProviderRolesEx()[roleind].OptionalFields.push(deletefield);
        dealStructureModel.ServiceProviderRolesEx()[roleind].DisplayFields.remove(deletefield);
    }

    var deleteSPRole = function (roleObj) {
        var delteRoleIndex = roleObj.attributes["roleIndex"].value;
        var deleteRoleItem = dealStructureModel.ServiceProviderRoles()[delteRoleIndex];
        dealStructureModel.OptionalServiceProviderRoles.push(deleteRoleItem);
        dealStructureModel.ServiceProviderRoles.remove(deleteRoleItem);

    };

    var deleteSPRoleEx = function (roleObj) {
        var delteRoleIndex = roleObj.attributes["roleIndex"].value;
        var deleteRoleItem = dealStructureModel.ServiceProviderRolesEx()[delteRoleIndex];
        dealStructureModel.OptionalServiceProviderRolesEx.push(deleteRoleItem);
        dealStructureModel.ServiceProviderRolesEx.remove(deleteRoleItem);

    };

    var update = function () {
        var returnArray = new Array();
        if (dealStructureModel.ServiceProviderRoles().length > 0) {

            var returnsproles = dealStructureModel.ServiceProviderRoles();
            getresult(returnsproles, returnArray);
        }
        if (dealStructureModel.ServiceProviderRolesEx().length > 0) {

            var returnsprolesEx = dealStructureModel.ServiceProviderRolesEx();
            getresult(returnsprolesEx, returnArray);
        }

        function getresult(returnsproles, returnArray) {
            $.each(returnsproles, function (m, singleRole) {
                if (singleRole.DisplayFields().length > 0) {
                    $.each(singleRole.DisplayFields(), function (n, singleRoleItem) {
                        if (singleRoleItem.ItemValue() != "") {
                            var roleItem = { Category: '', SPId: '', SPCode: '', SPRItemCode: "", TBId: "", ItemId: "", ItemCode: "", ItemValue: "", DataType: "", UnitOfMeasure: "", Precise: "" };
                            roleItem.Category = "TrustServiceProviderItem";
                            roleItem.SPId = singleRole.SPId();
                            roleItem.SPCode = $.trim(singleRole.SPCode());
                            roleItem.SPRItemCode = singleRole.SPRItemCode();
                            roleItem.TBId = ""
                            roleItem.ItemId = singleRoleItem.ItemId();
                            roleItem.ItemCode = singleRoleItem.ItemCode();
                            roleItem.ItemValue = singleRoleItem.ItemValue();
                            roleItem.DataType = singleRoleItem.DataType();
                            roleItem.UnitOfMeasure = singleRoleItem.UnitOfMeasure();
                            roleItem.Precise = singleRoleItem.Precise();
                            returnArray.push(roleItem);
                        }
                    });
                }
            });
        }

        //var json = ko.mapping.toJSON(returnArray);
        //json = json.replace("[", "").replace("]", "") + ",";
        //if (json == ",") {
        //    return "";
        //}
        //else {
        //    return json;
        //}
        return returnArray;//ko.mapping.toJS(returnArray);
    };


    var showReturn = function () {

        $('#divTrustSPRoleShow').html(preview());
    };

    var configSequence = function () {
        var url = "https://poolcutwcf/TaskProcessServices/UITaskStudio/TrustWizard/UITaskStudio/FeeSequence.html?tid=" + trustId;
        var rolesArrary = new Array();

        GetFee(dealStructureModel.ServiceProviderRoles(), rolesArrary);
        GetFee(dealStructureModel.ServiceProviderRolesEx(), rolesArrary);

        function GetFee(sourceArray, rolesArrary) {
            $.each(sourceArray, function (a, item) {
                if (item.DisplayFields().length > 0) {
                    $.each(item.DisplayFields(), function (b, itemB) {
                        if (itemB.ItemCode() == "Fee" && itemB.ItemValue() != "") {
                            var roleObj = new Object();
                            roleObj.SPRItemCode = item.SPRItemCode();
                            roleObj.Title = item.Title();
                            roleObj.SequenceNo = "";
                            rolesArrary.push(roleObj);
                        }
                    });
                }
            });
        }

        window.showModalDialog(url, rolesArrary, "dialogWidth=800px;dialogHeight=500px;scroll=no");

    };

    var preview = function () {
        var html = "";

        var print_tpl = '<div class="ItemBox"><h3 class="h3">{0}</h3><div class="ItemInner">{1}</div></div>';

        var strBegin = '<div class="ItemContent"><div class="ItemTitle">{0}：{1}</div>';

        var stringItem = '<div class="Item"><label>{0}</label><span>{1}</span></div>';

        var stringTail = '</div>';

        function getitemhtml(objArray) {
            var result = "";
            $.each(objArray, function (a, item) {
                var needAdd = false;
                var serviceprovider = "";
                var itemTitle = "";
                var itemString = "";
                if (item.DisplayFields().length > 0) {

                    $.each(item.DisplayFields(), function (b, itemB) {
                        if (itemB.ItemValue() != "") {

                            itemString += stringItem.format(itemB.FieldTitle(), itemB.ItemValue());
                            needAdd = true;
                        }
                    });
                }
                if (needAdd) {
                    //serviceprovider = getSPTypeById(item.SPId());
                    //itemTitle = strBegin.format(item.Title(), serviceprovider);
                    itemTitle = strBegin.format(item.Title(), item.SPCode());
                    result += itemTitle + itemString + stringTail;
                }
            });
            return result;
        }

        html += getitemhtml(dealStructureModel.ServiceProviderRoles())
        html += getitemhtml(dealStructureModel.ServiceProviderRolesEx())


        html = print_tpl.format('相关参与方', html);
        return html;
    };
    var isMenuclick = false;
    var isMenuClick = function (b) {
        if (b == true || b == false)
            isMenuclick = b;
        return isMenuclick;
    }
    var titleOnClick = function (titleObj) {
        var _index = $(titleObj).attr("labelIndex");
        _obj = $('.form-box-index').eq(_index);
        $(".catalog-title").removeClass('active');
        $(titleObj).addClass('active');
        isMenuclick = true;
        $("html,body").animate({
            scrollTop: _obj.offset().top - 30
        }, 0);
    }
    //暂停{7F3374F7-CE21-4033-99B9-D47FAAC89869}
    //var getSPTypeById = function (spId) {
    //    var spTypes = $.grep(dealStructureModel.ServiceProviders(), function (item) {
    //        return item.SPId() == spId;
    //    });
    //    if (spTypes.length > 0) {
    //        return spTypes[0].SPTitle();
    //    }
    //};

    var arrarySort = function (arr) {
        return arr.sort(function (a, b) {
            return parseInt(a.SequenceNo) - parseInt(b.SequenceNo);
        });
    };
    return {
        addNew: addNew,
        addNewRole: addNewRole,
        deleteField: deleteField,
        InitSPRoleJson: InitSPRoleJson,
        dataBinding: dataBinding,
        update: update,
        showReturn: showReturn,
        deleteSPRole: deleteSPRole,
        configSequence: configSequence,
        preview: preview,
        titleOnClick: titleOnClick,
        addNewEx: addNewEx,
        addNewRoleEx: addNewRoleEx,
        deleteFieldEx: deleteFieldEx,
        deleteSPRoleEx: deleteSPRoleEx,
        isMenuClick: isMenuClick
    };

})();

var TrustSPElement = {

    init: function () {
        var dealNode = document.getElementById('TrustSPRoleDiv');
        TrustSPRoleModule.InitSPRoleJson();
        TrustSPRoleModule.dataBinding(dealNode);
        var $catalog = $('.catalog-scroll>.catalog-list>.catalog-title');
        var csector = '.catalog-scroll>.catalog-list>.catalog-title';
        $catalog.eq(0).addClass('active');

        $(window).scroll(function () {
            if (TrustSPRoleModule.isMenuClick() == true) {
                TrustSPRoleModule.isMenuClick(false);
                return;
            }

            var scrollHeight = $(document).height() - $(window).height();

            var _top = $(this).scrollTop();
            if (_top < scrollHeight) {
                $(".form-box").each(function () {
                    var _this = $(this);
                    var _index = _this.attr("boxIndex");
                    var _offsetTop = _this.offset().top;
                    var _oph = _offsetTop + _this.height();
                    if (_top >= _offsetTop && _top < _oph) {
                        $(csector).removeClass('active');
                        $(csector).eq(_index).addClass('active');
                    }
                });
            } else {
                $(csector).removeClass('active').last().addClass('active');
            }
        });

    },

    update: function () {
        return TrustSPRoleModule.update();
    },

    preview: function () {
        return TrustSPRoleModule.preview();
    },

    validation: function () {
        //var stepDiv = document.getElementById('TrustSPRoleDiv');
        return this.validControls('#TrustSPRoleDiv input[data-valid]');
    }
}
TRUST.registerMethods(TrustSPElement);