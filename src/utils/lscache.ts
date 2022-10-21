// Prefix for all lscache keys
const CACHE_PREFIX = "lscache-";

// Suffix for the key name on the expiration items in localStorage
const CACHE_SUFFIX = "-cacheexpiration";

// expiration date radix (set to Base-36 for most space savings)
const EXPIRY_RADIX = 10;

// time resolution in milliseconds
let expiryMilliseconds = 60 * 1000;
// ECMAScript max Date (epoch + 1e8 days)
let maxDate = calculateMaxDate(expiryMilliseconds);

let cachedStorage: boolean;
let cachedJSON: boolean;
let cacheBucket = "";
let warnings = false;

// Determines if localStorage is supported in the browser;
// result is cached for better performance instead of being run each time.
// Feature detection is based on how Modernizr does it;
// it's not straightforward due to FF4 issues.
// It's not run at parse-time as it takes 200ms in Android.
function supportsStorage() {
  var key = "__lscachetest__";
  var value = key;

  if (cachedStorage !== undefined) {
    return cachedStorage;
  }

  // some browsers will throw an error if you try to access local storage (e.g. brave browser)
  // hence check is inside a try/catch
  try {
    if (!localStorage) {
      return false;
    }
  } catch (ex) {
    return false;
  }

  try {
    setItem(key, value);
    removeItem(key);
    cachedStorage = true;
  } catch (e) {
    // If we hit the limit, and we don't have an empty localStorage then it means we have support
    const err = e as Error;
    if (isOutOfSpace(err) && localStorage.length) {
      cachedStorage = true; // just maxed it out and even the set test failed.
    } else {
      cachedStorage = false;
    }
  }
  return cachedStorage;
}

// Check to set if the error is us dealing with being out of space
function isOutOfSpace(e: Error) {
  return (
    e &&
    (e.name === "QUOTA_EXCEEDED_ERR" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      e.name === "QuotaExceededError")
  );
}

// Determines if native JSON (de-)serialization is supported in the browser.
function supportsJSON() {
  /*jshint eqnull:true */
  if (cachedJSON === undefined) {
    cachedJSON = window.JSON != null;
  }
  return cachedJSON;
}

/**
 * Returns a string where all RegExp special characters are escaped with a \.
 * @param {String} text
 * @return {string}
 */
function escapeRegExpSpecialCharacters(text: string) {
  return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
}

/**
 * Returns the full string for the localStorage expiration item.
 * @param {String} key
 * @return {string}
 */
function expirationKey(key: string) {
  return key + CACHE_SUFFIX;
}

/**
 * Returns the number of minutes since the epoch.
 * @return {number}
 */
function currentTime() {
  return Math.floor(new Date().getTime() / expiryMilliseconds);
}

/**
 * Wrapper functions for localStorage methods
 */

function getItem(key: string) {
  return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
}

function setItem(key: string, value: string) {
  // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
  localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
}

function removeItem(key: string) {
  localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
}

function eachKey(fn: any) {
  var prefixRegExp = new RegExp(
    "^" + CACHE_PREFIX + escapeRegExpSpecialCharacters(cacheBucket) + "(.*)"
  );
  // We first identify which keys to process
  var keysToProcess = [];
  var key, i;
  for (i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);
    key = key && key.match(prefixRegExp);
    key = key && key[1];
    if (key && key.indexOf(CACHE_SUFFIX) < 0) {
      keysToProcess.push(key);
    }
  }
  // Then we apply the processing function to each key
  for (i = 0; i < keysToProcess.length; i++) {
    fn(keysToProcess[i], expirationKey(keysToProcess[i]));
  }
}

function flushItem(key: string) {
  var exprKey = expirationKey(key);

  removeItem(key);
  removeItem(exprKey);
}

function flushExpiredItem(key: string) {
  var exprKey = expirationKey(key);
  var expr = getItem(exprKey);

  if (expr) {
    var expirationTime = parseInt(expr, EXPIRY_RADIX);

    // Check if we should actually kick item out of storage
    if (currentTime() >= expirationTime) {
      removeItem(key);
      removeItem(exprKey);
      return true;
    }
  }
}

function warn(message: string, err: Error | null) {
  if (!warnings) return;
  if (!("console" in window) || typeof window.console.warn !== "function")
    return;
  window.console.warn("lscache - " + message);
  if (err) window.console.warn("lscache - The error was: " + err.message);
}

function calculateMaxDate(expiryMilliseconds: number) {
  return Math.floor(8.64e15 / expiryMilliseconds);
}

const lscacheModule = {
  /**
   * Stores the value in localStorage. Expires after specified number of minutes.
   * @param {string} key
   * @param {Object|string} value
   * @param {number} time
   * @return {boolean} whether the value was inserted successfully
   */
  set: function (key: string, value: any, time: number) {
    if (!supportsStorage()) return false;

    // If we don't get a string value, try to stringify
    // In future, localStorage may properly support storing non-strings
    // and this can be removed.

    if (!supportsJSON()) return false;
    try {
      value = JSON.stringify(value);
    } catch (e) {
      // Sometimes we can't stringify due to circular refs
      // in complex objects, so we won't bother storing then.
      return false;
    }

    try {
      setItem(key, value);
    } catch (e) {
      const err = e as Error;
      if (isOutOfSpace(err)) {
        // If we exceeded the quota, then we will sort
        // by the expire time, and then remove the N oldest
        let storedKeys: any[] = [];
        let storedKey;
        eachKey(function (key: any, exprKey: any) {
          let expiration: any = getItem(exprKey);
          if (expiration) {
            expiration = parseInt(expiration, EXPIRY_RADIX);
          } else {
            // Task: Store date added for non-expiring items for smarter removal
            expiration = maxDate;
          }
          storedKeys.push({
            key: key,
            size: (getItem(key) || "").length,
            expiration: expiration,
          });
        });
        // Sorts the keys with oldest expiration time last
        storedKeys.sort(function (a, b) {
          return b.expiration - a.expiration;
        });

        var targetSize = (value || "").length;
        while (storedKeys.length && targetSize > 0) {
          storedKey = storedKeys.pop();
          warn(
            "Cache is full, removing item with key '" + storedKey.key + "'",
            null
          );
          flushItem(storedKey.key);
          targetSize -= storedKey.size;
        }
        try {
          setItem(key, value);
        } catch (e) {
          const err = e as Error;
          // value may be larger than total quota
          warn(
            "Could not add item with key '" + key + "', perhaps it's too big?",
            err
          );
          return false;
        }
      } else {
        // If it was some other error, just give up.
        const err = e as Error;
        warn("Could not add item with key '" + key + "'", err);
        return false;
      }
    }

    // If a time is specified, store expiration info in localStorage
    if (time) {
      setItem(
        expirationKey(key),
        (currentTime() + time).toString(EXPIRY_RADIX)
      );
    } else {
      // In case they previously set a time, remove that info from localStorage.
      removeItem(expirationKey(key));
    }
    return true;
  },

  /**
   * Retrieves specified value from localStorage, if not expired.
   * @param {string} key
   * @return {string|Object}
   */
  get: function (key: string) {
    if (!supportsStorage()) return null;

    // Return the de-serialized item if not expired
    if (flushExpiredItem(key)) {
      return null;
    }

    // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
    var value = getItem(key);
    if (!value || !supportsJSON()) {
      return value;
    }

    try {
      // We can't tell if its JSON or a string, so we try to parse
      return JSON.parse(value);
    } catch (e) {
      // If we can't parse, it's probably because it isn't an object
      return value;
    }
  },

  /**
   * Removes a value from localStorage.
   * Equivalent to 'delete' in memcache, but that's a keyword in JS.
   * @param {string} key
   */
  remove: function (key: string) {
    if (!supportsStorage()) return;

    flushItem(key);
  },

  /**
   * Returns whether local storage is supported.
   * Currently exposed for testing purposes.
   * @return {boolean}
   */
  supported: function () {
    return supportsStorage();
  },

  /**
   * Flushes all lscache items and expiry markers without affecting rest of localStorage
   */
  flush: function () {
    if (!supportsStorage()) return;

    eachKey(function (key: string) {
      flushItem(key);
    });
  },

  /**
   * Flushes expired lscache items and expiry markers without affecting rest of localStorage
   */
  flushExpired: function () {
    if (!supportsStorage()) return;

    eachKey(function (key: string) {
      flushExpiredItem(key);
    });
  },

  /**
   * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
   * @param {string} bucket
   */
  setBucket: function (bucket: string) {
    cacheBucket = bucket;
  },

  /**
   * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
   */
  resetBucket: function () {
    cacheBucket = "";
  },

  /**
   * @returns {number} The currently set number of milliseconds each time unit represents in
   *   the set() function's "time" argument.
   */
  getExpiryMilliseconds: function () {
    return expiryMilliseconds;
  },

  /**
   * Sets the number of milliseconds each time unit represents in the set() function's
   *   "time" argument.
   * Sample values:
   *  1: each time unit = 1 millisecond
   *  1000: each time unit = 1 second
   *  60000: each time unit = 1 minute (Default value)
   *  360000: each time unit = 1 hour
   * @param {number} milliseconds
   */
  setExpiryMilliseconds: function (milliseconds: number) {
    expiryMilliseconds = milliseconds;
    maxDate = calculateMaxDate(expiryMilliseconds);
  },

  /**
   * Sets whether to display warnings when an item is removed from the cache or not.
   */
  enableWarnings: function (enabled: boolean) {
    warnings = enabled;
  },
};

export default lscacheModule;
