using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using HMPPS.Utilities.Interfaces;

namespace HMPPS.Utilities.Services
{
    public class CacheService : ICacheService
    {
        private readonly TimeSpan _defaultCacheTime;
        private static MemoryCache _memoryCache = new MemoryCache(_name);
        private const string _name = "Pmief.Business Memory Cache";

        public CacheService()
        {
            _defaultCacheTime = new TimeSpan(0, 0, Settings.DefaultDotNetCacheTime);
        }

        public void Store(string key, object value)
        {
            Store(key, value, GetDefaultExpirationTimeUtc());
        }

        public void Store(string key, object value, DateTime expiration)
        {
            if (value != null)
            {
                _memoryCache.Add(key, value, expiration);
            }
        }

        public T Get<T>(string key)
        {
            object o = _memoryCache.Get(key);
            if (o == null) return default(T);

            T value = (T)o;
            return value;
        }

        public void Destroy(string key)
        {
            _memoryCache.Remove(key);
        }

        public void Clear()
        {
            _memoryCache = new MemoryCache(_name);
        }

        public bool Contains(string key)
        {
            return _memoryCache.Contains(key);
        }

        public IEnumerable<string> GetKeys()
        {
            List<string> retval = _memoryCache.Select(kvp => kvp.Key).ToList();
            return retval;
        }

        public DateTime GetDefaultExpirationTimeUtc()
        {
            return DateTime.UtcNow.Add(_defaultCacheTime);
        }
    }
}
