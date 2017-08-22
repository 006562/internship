using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Xml.Linq;

namespace TaskProcessService
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "ICRCSystemInterface" in both code and config file together.
    [ServiceContract]
    public interface ICRCSystemInterface
    {
        [OperationContract]
        [WebGet( BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Xml, ResponseFormat = WebMessageFormat.Xml, UriTemplate = "DoWork")]
        bool DoWork();

        [OperationContract]
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.WrappedRequest, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Xml, UriTemplate = "GetFee")]
        XElement GetFee(string fundcode, string startdate, string enddate);
    }
}
