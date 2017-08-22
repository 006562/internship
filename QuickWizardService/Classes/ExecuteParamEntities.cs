using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;

namespace QuickWizard
{
   public class ExecuteParams
    {
        public string SPName { get; set; }
        public List<SQLParam> SQLParams = new List<SQLParam>();
    }

    public class SQLParam
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string DBType { get; set; }
        public bool IsOutput { get; set; }
        public int Size { get; set; }

        /// <summary>
        /// for output param
        /// </summary>
        public DbParameter DBParam { get; set; }
    }
}