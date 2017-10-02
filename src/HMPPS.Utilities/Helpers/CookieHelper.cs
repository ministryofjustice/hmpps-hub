using System.Web;
using System.Collections;
using System.Collections.Specialized;

namespace HMPPS.Utilities.Helpers
{
    public class CookieHelper
    {
        private HttpContext _ctx = null;
        private string _cookieName = null;
        private HybridDictionary _data;
        public HybridDictionary CookieData
        {
            get
            {
                if (CookieData == null)
                {
                    this.GetCookie();
                }
                return _data;
            }
            set
            {
                _data = value;
            }
        }
        public void SetValue(string Key, string Value)
        {
            if (_data == null)
                _data = new HybridDictionary();
            _data.Add(Key, Value);
        }
        public string GetValue(string Key)
        {
            string retValue = string.Empty;
            if (_data != null)
            {
                retValue = _data[Key].ToString();
            }
            return retValue;
        }

        private CookieHelper()
        {
        }
        public CookieHelper(string cookieName)
        {
            _ctx = HttpContext.Current;
            _cookieName = cookieName;
        }

        public CookieHelper(string cookieName, HttpContext ctx)
        {
            _ctx = ctx;
            _cookieName = cookieName;
        }

        public void Save()
        {
            // Setting a cookie's value and/or subvalue using the HttpCookie class
            HttpCookie cookie;
            if (_ctx.Request.Cookies[_cookieName] != null)
                _ctx.Request.Cookies.Remove(_cookieName);
            cookie = new HttpCookie(_cookieName);
            if (_data.Count > 0)
            {
                IEnumerator cookieData = _data.GetEnumerator();
                DictionaryEntry item;
                while (cookieData.MoveNext())
                {
                    item = (DictionaryEntry)cookieData.Current;
                    cookie.Values.Add(item.Key.ToString(), item.Value.ToString());
                }
            }
            _ctx.Response.AppendCookie(cookie);
        }
        public HttpCookie GetCookie()
        {
            // Retrieving a cookie's value(s)
            if (_ctx.Request.Cookies[_cookieName] != null)
            {
                NameValueCollection values = _ctx.Request.Cookies[_cookieName].Values;
                if (values.Count > 0)
                {
                    _data = new HybridDictionary(values.Count);
                    foreach (string key in values.Keys)
                    {
                        _data.Add(key, values[key]);
                    }
                }
                return _ctx.Request.Cookies[_cookieName];
            }
            return null;
        }
        public void Delete()
        {
            // Set the value of the cookie to null and
            // set its expiration to some time in the past
            if (_ctx.Response.Cookies[_cookieName] != null)
            {
                _ctx.Response.Cookies[_cookieName].Value = null;
                _ctx.Response.Cookies[_cookieName].Expires =
                 System.DateTime.Now.AddMonths(-1); // last month
            }
        }
    }
}
