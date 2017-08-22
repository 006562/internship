using DADP.DataProcessEntity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace TaskProcessService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "CRCSystemInterface" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select CRCSystemInterface.svc or CRCSystemInterface.svc.cs at the Solution Explorer and start debugging.
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class CRCSystemInterface : ICRCSystemInterface
    {
        public const string OriganizationCode = "CRC";
        private static readonly string connForDataProcess = ConfigurationManager.ConnectionStrings["TrustManagement"].ConnectionString;
        public bool DoWork()
        {
            return true;
        }

        public XElement GetFee(string fundcode, string startdate, string enddate)
        {
            FeeEntityList fs = new FeeEntityList();
            //fs.Add(new FeeEntity() { fundcode = fundcode, feetype = "2", startdate = "3", enddate = "4", payamt = "5" });


            DADP.DataProcessEntity.CommonGetPost.ExecuteParams ep = new CommonGetPost.ExecuteParams();
            ep.SPName = "usp_GetTrustFeeForCRC";
            ep.SQLParams = new List<DADP.DataProcessEntity.CommonGetPost.SQLParam>();
            ep.SQLParams.Add(new DADP.DataProcessEntity.CommonGetPost.SQLParam() { Name = "TrustCode", Value = fundcode, DBType = "string" });
            ep.SQLParams.Add(new DADP.DataProcessEntity.CommonGetPost.SQLParam() { Name = "StartDate", Value = startdate, DBType = "string" });
            ep.SQLParams.Add(new DADP.DataProcessEntity.CommonGetPost.SQLParam() { Name = "EndDate", Value = enddate, DBType = "string" });
            ep.SQLParams.Add(new DADP.DataProcessEntity.CommonGetPost.SQLParam() { Name = "OrganizationCode", Value = OriganizationCode, DBType = "string" });
            var tEntity = new CommonGetPost("TrustManagement", connForDataProcess);
            DataSet ds = tEntity.ExecuteGet(ep);
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DataRow row = ds.Tables[0].Rows[i];
                    fs.Add(new FeeEntity() { fundcode = Convert.ToString(row["TrustCode"]), feetype = Convert.ToString(row["FeeType"]), startdate = Convert.ToString(row["StartDate"]), enddate = Convert.ToString(row["EndDate"]), payamt = Convert.ToString(row["PayAmt"]) });
                }
            }

            string result = XmlSerializers.Serialize<FeeEntityList>(fs);
            
            //更新状态
            ep.SPName = "usp_UpdateTrustFeeStatusForCRC";
            tEntity.ExecuteGet(ep);

            return XElement.Parse(result);
        }
    }

    [XmlType("FeeEntitys")]
    public class FeeEntityList : List<FeeEntity>
    { }

    [Serializable]
    public class FeeEntity
    {
        public string fundcode;
        public string feetype;
        public string startdate;
        public string enddate;
        public string payamt;
    }

    public static class XmlSerializers
    {
        /// <summary>
        /// 序列化对象
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="t">对象</param>
        /// <returns></returns>
        public static string Serialize<T>(T t)
        {
            using (StringWriter sw = new StringWriter())
            {
                XmlSerializer xz = new XmlSerializer(t.GetType());
                xz.Serialize(sw, t);
                return sw.ToString();
            }
        }
    }
}
