// Cloudflare Worker for Capo Guitar Tab Scraper
// Replicates the Go backend functionality using Ultimate Guitar's mobile API

const UG_API_ENDPOINT = 'https://api.ultimate-guitar.com/api/v1';
const UG_USER_AGENT = 'UGT_ANDROID/4.11.1 (Pixel; 8.1.0)';

class UltimateGuitarScraper {
  constructor() {
    this.deviceId = this.generateDeviceId();
  }

  generateDeviceId() {
    // Generate a 16-character hex string
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async generateApiKey() {
    // Generate the X-UG-API-KEY based on device ID + current time + "createLog()"
    const now = new Date();
    const utcDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const utcHour = now.getUTCHours();
    const formattedDate = `${utcDate}:${utcHour}`;
    
    const payload = `${this.deviceId}${formattedDate}createLog()`;
    
    // Create MD5 hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  async makeRequest(path, params = {}) {
    const url = new URL(`${UG_API_ENDPOINT}${path}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => url.searchParams.append(key, value));
        } else {
          url.searchParams.append(key, params[key]);
        }
      }
    });

    const apiKey = await this.generateApiKey();
    
    const headers = {
      'Accept-Charset': 'utf-8',
      'Accept': 'application/json',
      'User-Agent': UG_USER_AGENT,
      'Connection': 'close',
      'X-UG-CLIENT-ID': this.deviceId,
      'X-UG-API-KEY': apiKey
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async search(query, page = 1) {
    const params = {
      title: query,
      type: 'Chords', // Only chord charts
      page: page
    };

    const result = await this.makeRequest('/tab/search', params);
    
    // Transform results to match our expected format
    const tabs = result.tabs || [];
    return tabs
      .filter(tab => tab.type === 'Chords') // Extra filter for chord charts only
      .map(tab => ({
        id: tab.id,
        title: tab.song_name,
        artist: tab.artist_name,
        type: 'Chords',
        url: `https://tabs.ultimate-guitar.com/tab/${tab.id}`,
        source: 'Ultimate Guitar',
        rating: tab.rating || 0,
        version: tab.version || 1,
        votes: tab.votes || 0
      }));
  }

  async getTabById(id) {
    const params = {
      tab_id: id,
      tab_access_type: 'private'
    };
    
    const result = await this.makeRequest('/tab/info', params);
    
    // Check various possible response structures
    const tab = result.tab || result;
    
    if (!tab || !tab.content) {
      throw new Error('Tab not found or no content');
    }
    
    return {
      id: tab.id,
      title: tab.song_name,
      artist: tab.artist_name,
      type: tab.type,
      source: 'Ultimate Guitar',
      content: this.cleanChordContent(tab.content)
    };
  }

  async getPopular(page = 1) {
    const params = {
      type: 'Chords',
      order: 'today_most_popular',
      page: page
    };

    const result = await this.makeRequest('/tab/explore', params);
    
    const tabs = result.tabs || [];
    return tabs
      .filter(tab => tab.type === 'Chords')
      .map(tab => ({
        id: tab.id,
        title: tab.song_name,
        artist: tab.artist_name,
        type: 'Chords',
        url: `https://tabs.ultimate-guitar.com/tab/${tab.id}`,
        source: 'Ultimate Guitar',
        rating: tab.rating || 0,
        version: tab.version || 1,
        votes: tab.votes || 0
      }));
  }

  cleanChordContent(content) {
    if (!content) return '';
    
    // Remove Ultimate Guitar markup tags
    content = content.replace(/\[tab\]/g, '');
    content = content.replace(/\[\/tab\]/g, '');
    content = content.replace(/\[ch\]/g, '');
    content = content.replace(/\[\/ch\]/g, '');
    
    // Clean up other common markup
    content = content.replace(/\[verse\]/g, '[Verse]');
    content = content.replace(/\[\/verse\]/g, '');
    content = content.replace(/\[chorus\]/g, '[Chorus]');
    content = content.replace(/\[\/chorus\]/g, '');
    content = content.replace(/\[bridge\]/g, '[Bridge]');
    content = content.replace(/\[\/bridge\]/g, '');
    
    // Clean up excessive whitespace
    content = content.replace(/\r\n/g, '\n');
    content = content.replace(/\r/g, '\n');
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace from lines
    const lines = content.split('\n');
    const cleanedLines = lines.map(line => line.trim());
    
    return cleanedLines.join('\n').trim();
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

// Cache headers to prevent browser caching
const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Initialize scraper
    const scraper = new UltimateGuitarScraper();

    try {
      // Route handling
      if (path === '/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          service: 'capo-scraper-worker',
          version: '1.0.0'
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      if (path === '/search') {
        const query = url.searchParams.get('q');
        if (!query) {
          return new Response(JSON.stringify({
            error: 'Missing query parameter q'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const results = await scraper.search(query);
        return new Response(JSON.stringify(results), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...noCacheHeaders
          }
        });
      }

      if (path.startsWith('/tab/')) {
        const id = path.split('/')[2];
        if (!id || isNaN(id)) {
          return new Response(JSON.stringify({
            error: 'Invalid tab ID'
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }

        const tab = await scraper.getTabById(parseInt(id));
        return new Response(JSON.stringify(tab), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      if (path === '/popular') {
        const results = await scraper.getPopular();
        return new Response(JSON.stringify(results), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...noCacheHeaders
          }
        });
      }

      // 404 for unknown paths
      return new Response(JSON.stringify({
        error: 'Not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};