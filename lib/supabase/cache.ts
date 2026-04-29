// lib/supabase/cache.ts
class QueryCache {
  private cache = new Map();
  private pending = new Map();

  async fetch(key: string, fetcher: () => Promise<any>, ttl = 60000) {
    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Check pending requests
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Execute request
    const promise = fetcher().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() });
      this.pending.delete(key);
      return data;
    }).catch(err => {
      this.pending.delete(key);
      throw err;
    });

    this.pending.set(key, promise);
    return promise;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const queryCache = new QueryCache();