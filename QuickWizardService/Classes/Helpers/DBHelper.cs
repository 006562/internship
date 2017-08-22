using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Web;

namespace QuickWizard
{
    internal sealed class DBHelper
    {
        /// <summary>
        /// 获取数据库引用类库类型
        /// </summary>
        private static string dbProviderName = ConfigurationManager.ConnectionStrings["QuickWizard"].ProviderName;
        // = "System.Data.SqlClient"; 

        /// <summary>
        /// 连接字符串
        /// </summary>
        public static string dbConnectionString = ConfigurationManager.ConnectionStrings["QuickWizard"].ConnectionString;
        // "Data Source=.\\mssql;Initial Catalog=SFM_DAL_ConsumerLoan;Integrated Security=True";

        /// <summary>
        /// Get Default DbConnection
        /// </summary>
        public static DbConnection OpenConnection()
        {
            DbConnection cn = null;
            DbProviderFactory factory //= DbProviderFactories.GetFactory(DBHelper.dbProviderName);
                = System.Data.SqlClient.SqlClientFactory.Instance;
            cn = factory.CreateConnection();
            cn.ConnectionString = DBHelper.dbConnectionString;
            cn.Open();
            return cn;
        }

        /// <summary>
        /// Get DbConnection with specific db connection string 
        /// </summary>
        public static DbConnection OpenConnection(string dbConnString)
        {
            DbConnection cn = null;
            DbProviderFactory factory = System.Data.SqlClient.SqlClientFactory.Instance;
            cn = factory.CreateConnection();
            cn.ConnectionString = dbConnString;
            cn.Open();
            return cn;
        }

        public static DbType GetDBType(string dbType)
        {
            DbType rtnType;
            switch (dbType)
            {
                case "string":
                    rtnType = DbType.String;
                    break;

                case "int":
                    rtnType = DbType.Int32;
                    break;

                case "binary":
                    rtnType = DbType.Binary;
                    break;

                case "bool":
                    rtnType = DbType.Boolean;
                    break;

                case "byte":
                    rtnType = DbType.Byte;
                    break;

                case "currency":
                    rtnType = DbType.Currency;
                    break;

                case "date":
                    rtnType = DbType.Date;
                    break;

                case "datetime":
                    rtnType = DbType.DateTime;
                    break;

                case "decimal":
                    rtnType = DbType.Decimal;
                    break;

                case "double":
                    rtnType = DbType.Double;
                    break;

                case "guid":
                    rtnType = DbType.Guid;
                    break;

                case "xml":
                    rtnType = DbType.Xml;
                    break;

                default:
                    rtnType = DbType.Object;
                    break;
            }

            return rtnType;
        }
    }

    /// <summary>
    /// 数据库操作对象扩展方法
    /// </summary>
    internal static partial class ExtensionMethods
    {
        #region Command
        static DbCommand CreateCommandByCommandType(this DbConnection cn, CommandType commandType, string commandText)
        {
            DbCommand cmd = cn.CreateCommand();
            cmd.CommandType = commandType;
            cmd.CommandText = commandText;
            cmd.Connection = cn;
            return cmd;
        }

        /// <summary>
        /// 获得一个存储过程DbCommand对象
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="storedProcedureName"></param>
        /// <returns></returns>
        public static DbCommand CreateCommandStoredProc(this DbTransaction trans, string storedProcedureName)
        {
            DbCommand cmd = trans.Connection.CreateCommandByCommandType(CommandType.StoredProcedure, storedProcedureName);
            cmd.Transaction = trans;
            return cmd;
        }

        /// <summary>
        /// 获得Sql字符DbCommand对象
        /// </summary>
        /// <param name="trans"></param>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static DbCommand CreateCommandSqlString(this DbTransaction trans, string sql)
        {
            DbCommand cmd = trans.Connection.CreateCommandByCommandType(CommandType.Text, sql);
            cmd.Transaction = trans;
            return cmd;
        }

        /// <summary>
        /// 获得一个存储过程DbCommand对象
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="storedProcedureName"></param>
        /// <returns></returns>
        public static DbCommand CreateCommandStoredProc(this DbConnection cn, string storedProcedureName)
        {
            return cn.CreateCommandByCommandType(CommandType.StoredProcedure, storedProcedureName);
        }

        /// <summary>
        /// 获得Sql字符DbCommand对象
        /// </summary>
        /// <param name="cn"></param>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static DbCommand CreateCommandSqlString(this DbConnection cn, string sql)
        {
            return cn.CreateCommandByCommandType(CommandType.Text, sql);
        }
        #endregion

        #region 参数操作
        /// <summary>
        /// 添加输入参数
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameterName"></param>
        /// <param name="dbType"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DbParameter AddInParameter(this DbCommand cmd, string parameterName, DbType dbType, object value)
        {
            DbParameter parameter = cmd.CreateParameter();
            parameter.ParameterName = parameterName;
            parameter.DbType = dbType;
            parameter.Value = value;
            cmd.Parameters.Add(parameter);
            return parameter;
        }

        /// <summary>
        /// 添加输出参数
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameterName"></param>
        /// <param name="dbType"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        public static DbParameter AddOutParameter(this DbCommand cmd, string parameterName, DbType dbType, int size)
        {
            DbParameter parameter = cmd.CreateParameter();
            parameter.ParameterName = parameterName;
            parameter.DbType = dbType;
            parameter.Size = size;
            parameter.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(parameter);
            return parameter;
        }

        /// <summary>
        /// 添加返回参数
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameterName"></param>
        /// <param name="dbType"></param>
        /// <returns></returns>
        public static DbParameter AddReturnParameter(this DbCommand cmd, string parameterName, DbType dbType)
        {
            DbParameter parameter = cmd.CreateParameter();
            parameter.ParameterName = parameterName;
            parameter.DbType = dbType;
            parameter.Direction = ParameterDirection.ReturnValue;
            cmd.Parameters.Add(parameter);
            return parameter;
        }

        /// <summary>
        /// 获取参数值
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameterName"></param>
        /// <returns></returns>
        public static object GetParameterValue(this DbCommand cmd, string parameterName)
        {
            return cmd.Parameters[parameterName].Value;
        }

        /// <summary>
        /// 设置参数值
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameterName"></param>
        /// <param name="value"></param>
        public static void SetParameterValue(this DbCommand cmd, string parameterName, object value)
        {
            cmd.Parameters[parameterName].Value = value;
        }
        #endregion

        /// <summary>
        /// 获取适配器
        /// </summary>
        /// <param name="cmd"></param>
        /// <returns></returns>
        static DbDataAdapter GetDataAdapter(this DbCommand cmd)
        {
            if (cmd is System.Data.SqlClient.SqlCommand)
            {
                return new System.Data.SqlClient.SqlDataAdapter();
            }
            return null;
        }

        #region 查询数据集
        /// <summary>
        /// 查询数据集
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <returns></returns>
        public static DataSet ExcuteDataSet(this DbCommand cmd)
        {
            DataSet ds = new DataSet();
            DoFillDataSet(cmd, ds, null);
            return ds;
        }

        /// <summary>
        /// 查询数据集
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <param name="sqlParams">参数集合</param>
        /// <returns></returns>
        public static DataSet ExcuteDataSet(this DbCommand cmd, IList<DbParamEntity> sqlParams)
        {
            DataSet ds = new DataSet();
            DoFillDataSet(cmd, ds, sqlParams);
            return ds;
        }

        /// <summary>
        /// 查询数据集
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <param name="tableNames">DataSet数据表名集合</param>
        /// <returns></returns>
        public static DataSet ExcuteDataSet(this DbCommand cmd, string[] tableNames)
        {
            DataSet ds = new DataSet();
            DoFillDataSet(cmd, ds, null, tableNames);
            return ds;
        }

        /// <summary>
        /// 查询数据集
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <param name="sqlParams">参数集合</param>
        /// <param name="tableNames">DataSet数据表名集合</param>
        /// <returns></returns>
        public static DataSet ExcuteDataSet(this DbCommand cmd, IList<DbParamEntity> sqlParams, string[] tableNames)
        {
            DataSet ds = new DataSet();
            DoFillDataSet(cmd, ds, sqlParams, tableNames);
            return ds;
        }
        #endregion

        #region 查询数据表
        /// <summary>
        /// 查询数据表
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <returns></returns>
        public static DataTable ExcuteDataTable(this DbCommand cmd)
        {
            return ExcuteDataTable(cmd, null);
        }

        /// <summary>
        /// 查询数据表
        /// </summary>
        /// <param name="cmd">DbCommand命令对象</param>
        /// <param name="sqlParams">参数集合</param>
        /// <returns></returns>
        public static DataTable ExcuteDataTable(this DbCommand cmd, IList<DbParamEntity> sqlParams)
        {
            DataTable dt = new DataTable();
            FillDataTable(cmd, dt, sqlParams);
            return dt;
        }
        #endregion

        #region 填充数据表
        /// <summary>
        /// 填充数据表
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataTable"></param>
        public static void FillDataTable(this DbCommand cmd, DataTable dataTable)
        {
            FillDataTable(cmd, dataTable, null);
        }

        /// <summary>
        /// 填充数据表
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataTable"></param>
        /// <param name="sqlParams">参数集合</param>
        public static void FillDataTable(this DbCommand cmd, DataTable dataTable, IList<DbParamEntity> sqlParams)
        {
            // 加入参数
            if (sqlParams != null && sqlParams.Count > 0)
            {
                foreach (DbParamEntity param in sqlParams)
                {
                    cmd.AddInParameter(param.ParamName, param.ParamType, param.Value);
                }
            }

            // 读取数据
            DbDataAdapter adapter = GetDataAdapter(cmd);
            adapter.SelectCommand = cmd;
            adapter.Fill(dataTable);

            // 清理
            adapter.Dispose();
        }
        #endregion

        #region 填充数据集
        /// <summary>
        /// 填充数据集
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="tableName"></param>
        public static void FillDataSet(this DbCommand cmd, DataSet dataSet, string tableName)
        {
            FillDataSet(cmd, dataSet, new string[] { tableName });
        }

        /// <summary>
        /// 填充数据集
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="tableName"></param>
        public static void FillDataSet(this DbCommand cmd, DataSet dataSet, IList<DbParamEntity> sqlParams, string tableName)
        {
            FillDataSet(cmd, dataSet, sqlParams, new string[] { tableName });
        }

        /// <summary>
        /// 填充数据集
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="tableNames"></param>
        public static void FillDataSet(this DbCommand cmd, DataSet dataSet, params string[] tableNames)
        {
            DoFillDataSet(cmd, dataSet, null, tableNames);
        }

        /// <summary>
        /// 填充数据集
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="tableNames"></param>
        public static void FillDataSet(this DbCommand cmd, DataSet dataSet, IList<DbParamEntity> sqlParams, params string[] tableNames)
        {
            DoFillDataSet(cmd, dataSet, sqlParams, tableNames);
        }

        /// <summary>
        /// 填充数据
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="sqlParams"></param>
        /// <param name="tableNames"></param>
        static void DoFillDataSet(DbCommand cmd, DataSet dataSet, IList<DbParamEntity> sqlParams, string[] tableNames)
        {
            // 方法参数检查
            if (tableNames == null)
            {
                throw new ArgumentNullException("tableNames");
            }
            if (tableNames.Length == 0)
            {
                throw new ArgumentException("集合参数tableNames不能没有内容。", "tableNames");
            }
            for (int i = 0; i < tableNames.Length; i++)
            {
                if (string.IsNullOrEmpty(tableNames[i]))
                {
                    throw new ArgumentException("tableNames集合的内容不能是空字符串", string.Concat("tableNames[", i, "]"));
                }
            }

            // DbCommand参数
            if (sqlParams != null && sqlParams.Count > 0)
            {
                foreach (DbParamEntity param in sqlParams)
                {
                    cmd.AddInParameter(param.ParamName, param.ParamType, param.Value);
                }
            }

            // 读取数据
            using (DbDataAdapter adapter = cmd.GetDataAdapter())
            {
                adapter.SelectCommand = cmd;

                try
                {
                    DateTime startTime = DateTime.Now;
                    string systemCreatedTableNameRoot = "Table";
                    for (int i = 0; i < tableNames.Length; i++)
                    {
                        string systemCreatedTableName = (i == 0)
                                                            ? systemCreatedTableNameRoot
                                                            : systemCreatedTableNameRoot + i;

                        adapter.TableMappings.Add(systemCreatedTableName, tableNames[i]);
                    }

                    adapter.Fill(dataSet);
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// 填充数据集
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="dataSet"></param>
        /// <param name="sqlParams"></param>
        static void DoFillDataSet(DbCommand cmd, DataSet dataSet, IList<DbParamEntity> sqlParams)
        {
            // DbCommand参数
            if (sqlParams != null && sqlParams.Count > 0)
            {
                foreach (DbParamEntity param in sqlParams)
                {
                    cmd.AddInParameter(param.ParamName, param.ParamType, param.Value);
                }
            }

            // 读取数据
            using (DbDataAdapter adapter = cmd.GetDataAdapter())
            {
                adapter.SelectCommand = cmd;

                try
                {
                    adapter.Fill(dataSet);
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        #endregion
    }
    /// <summary>
    /// SQL参数实体
    /// </summary>
    internal class DbParamEntity
    {
        /// <summary>
        /// 参数名称
        /// </summary>
        public string ParamName { get; set; }

        /// <summary>
        /// 参数数据类型
        /// </summary>
        public DbType ParamType { get; set; }

        /// <summary>
        /// 参数值
        /// </summary>
        public object Value { get; set; }

        private ParameterDirection _ParamDirection = ParameterDirection.Input;
        /// <summary>
        /// 参数类型
        /// </summary>
        public ParameterDirection ParamDirection
        {
            get
            {
                return _ParamDirection;
            }
            set
            {
                _ParamDirection = value;
            }
        }
    }
}
