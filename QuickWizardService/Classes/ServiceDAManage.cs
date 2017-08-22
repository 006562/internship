using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Web;

namespace QuickWizard
{
    public class ServiceDAManage
    {
        private string ConnectionString;
        public ServiceDAManage(string connString)
        {
            this.ConnectionString = connString;
        }
        public ServiceDAManage()
        {
            this.ConnectionString = DBHelper.dbConnectionString;
        }

        public DataTable ExecuteDataTable(ref ExecuteParams paras, out bool isHaveOutParams)
        {
            DataTable dtTable = null;
            using (DbConnection cn = DBHelper.OpenConnection(this.ConnectionString))
            {
                using (DbCommand cmd = cn.CreateCommandStoredProc(paras.SPName))
                {
                    var inputParams = paras.SQLParams.FindAll(p => !p.IsOutput);
                    foreach (SQLParam param in inputParams)
                    {
                        DbType dbType = DBHelper.GetDBType(param.DBType);
                        cmd.AddInParameter(param.Name, dbType, param.Value);
                    }

                    var outParams = paras.SQLParams.FindAll(p => p.IsOutput);
                    foreach (SQLParam param in outParams)
                    {
                        DbType dbType = DBHelper.GetDBType(param.DBType);
                        param.DBParam = cmd.AddOutParameter(param.Name, dbType, param.Size);
                    }

                    isHaveOutParams = outParams.Count > 0;
                    dtTable = cmd.ExcuteDataTable();
                }
            }

            return dtTable;
        }

        public Object ExecuteScalar(string sqlString) 
        {
            Object result = null;
            using (DbConnection cn = DBHelper.OpenConnection(this.ConnectionString))
            {
                using (DbCommand cmd = cn.CreateCommandSqlString(sqlString))
                {
                    result = cmd.ExecuteScalar();
                }
            }

            return result;
        }

    }
}