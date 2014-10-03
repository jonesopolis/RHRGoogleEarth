using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;

namespace GoogleEarth
{
    public class HouseUtil
    {
        private static string baseUrl = @"http://www.rhr.com/property-gallery/type-Residential/pc-1/newlistings/dsort-n/";

        public IEnumerable<House> GetHouses()
        {
            var houses = new List<House>();

            Parallel.ForEach(Enumerable.Range(1, 19), (i) => houses.AddRange(GetHousesFromUrl(baseUrl + i)));
            return houses;
        } 

        private IEnumerable<House> GetHousesFromUrl(string url)
        {
            var web = new HtmlWeb();
            HtmlDocument doc = web.Load(url);

            return doc.GetElementbyId("galleryUI").Descendants()
                .Where(e => e.GetAttributeValue("class", "") == "large-6 columns")
                .Select(GetHouse)
                .Where(house => house != null);
        }

        private House GetHouse(HtmlNode houseNode)
        {
            try
            {
                var house = new House();

                house.Address = houseNode.Descendants()
                    .First(e => e.GetAttributeValue("class", "") == "Address1")
                    .InnerText
                    .Trim();

                house.Address += " " + houseNode.Descendants()
                    .First(e => e.GetAttributeValue("class", "") == "Address2")
                    .InnerText
                    .Trim();

                house.ImageUrl = houseNode.Descendants("img")
                    .First()
                    .Attributes.First(a => a.Name == "src")
                    .Value;

                house.Price = houseNode.Descendants()
                    .First(e => e.GetAttributeValue("class", "") == "price")
                    .InnerText
                    .Trim();

                house.Info = houseNode.Descendants()
                    .First(e => e.GetAttributeValue("class", "") == "title_items")
                    .InnerText
                    .Split(new[] {"&bull;"}, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => Regex.Match(s, @"\d[\d*\.*]*").Value);

                return house;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }

    public class House
    {
        public string Address { get; set; }
        public string Price { get; set; }
        public IEnumerable<string> Info { get; set; }
        public string ImageUrl { get; set; }
    }
}