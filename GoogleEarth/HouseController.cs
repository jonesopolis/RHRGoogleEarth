using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using HtmlAgilityPack;

namespace GoogleEarth
{
    public class HouseController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Index()
        {
            string viewPath = HttpContext.Current.Server.MapPath(@"~/angular/view/index.html");
            var template = File.ReadAllText(viewPath);

            var response = new HttpResponseMessage
            {
                Content = new StringContent(template, Encoding.UTF8, "text/html")
            };

            return response;
        }
        public IHttpActionResult GetHouses()
        {
            return Ok(new HouseUtil().GetHouses());
        }
    }
}