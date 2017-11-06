using System;
using System.Collections.Generic;

namespace HMPPS.Utilities.Interfaces
{
    public interface ICacheService
    {

        /// <summary>
        /// Stores the given value in Cache
        /// Uses default time before expire
        /// </summary>
        /// <param name="key">cache key</param>
        /// <param name="value">value to be cached</param>
        void Store(string key, object value);

        /// <summary>
        /// Stores the given value in Cache
        /// Will clear on publish
        /// </summary>
        /// <param name="key">cache key</param>
        /// <param name="value">value to be cached</param>
        /// <param name="expiration">Time till expiration</param>
        void Store(string key, object value, DateTime expiration);

        /// <summary>
        /// Get the value from the cache
        /// </summary>
        /// <typeparam name="T">Type of value</typeparam>
        /// <param name="key">cache key</param>
        /// <returns>value from the cache converted to the given type</returns>
        T Get<T>(string key);

        /// <summary>
        /// Removes a value from cache
        /// </summary>
        /// <param name="key">cache key</param>
        void Destroy(string key);

        /// <summary>
        /// Removes all entries from cache
        /// </summary>
        void Clear();

        /// <summary>
        /// Determines if the cache contains the given <paramref name="key"/>
        /// </summary>
        /// <param name="key">cache key</param>
        /// <returns>true is cache contains <paramref name="key"/>, else false</returns>
        bool Contains(string key);

        IEnumerable<string> GetKeys();
    }
}
