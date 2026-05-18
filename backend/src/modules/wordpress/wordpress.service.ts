/**
 * WooCommerce REST API service
 * Handles all communication with the remote WooCommerce store.
 */

export interface WCSetting {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
  apiVersion?: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  type: string; // simple | variable | grouped | external
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: string;
  weight: string;
  images: WCImage[];
  categories: WCCategory[];
  tags: { id: number; name: string; slug: string }[];
  attributes: WCAttribute[];
  variations: number[];
  brands?: { name: string; slug: string }[];
  meta_data?: { key: string; value: any }[];
  [key: string]: any;
}

export interface WCReview {
  id: number;
  date_created: string;
  review: string;
  rating: number;
  reviewer: string;
  reviewer_email: string;
}

export interface WCVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: string;
  image: WCImage | null;
  attributes: { id: number; name: string; option: string }[];
  [key: string]: any;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  image?: WCImage | null;
}

export interface WCBrand {
  id: number;
  name: string;
  slug: string;
}

export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCAttribute {
  id: number;
  name: string;
  options: string[];
  variation: boolean;
}

function makeAuth(key: string, secret: string): string {
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
}

async function fetchWithTimeout(resource: string, options: any = {}) {
  const { timeout = 30000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

function buildUrl(setting: WCSetting, endpoint: string, params: Record<string, any> = {}): string {
  const version = setting.apiVersion ?? 'wc/v3';
  const base = setting.siteUrl.replace(/\/$/, '');
  const url = new URL(`${base}/wp-json/${version}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function wcFetch<T>(setting: WCSetting, endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const url = buildUrl(setting, endpoint, params);
  const resp = await fetchWithTimeout(url, {
    headers: {
      Authorization: makeAuth(setting.consumerKey, setting.consumerSecret),
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(`WooCommerce API error ${resp.status}: ${text}`);
  }

  return resp.json() as Promise<T>;
}

export class WordPressService {
  /** Verify credentials by hitting the products endpoint */
  async testConnection(setting: WCSetting): Promise<{ ok: boolean; message: string }> {
    try {
      await wcFetch<WCProduct[]>(setting, 'products', { per_page: 1 });
      return { ok: true, message: 'Connection successful' };
    } catch (err: any) {
      return { ok: false, message: err.message ?? 'Connection failed' };
    }
  }

  /** Fetch a page of products */
  async fetchProducts(setting: WCSetting, page = 1, perPage = 20): Promise<WCProduct[]> {
    return wcFetch<WCProduct[]>(setting, 'products', { page, per_page: perPage, status: 'publish' });
  }

  /** Fetch all categories (paginated internally) */
  async fetchAllCategories(setting: WCSetting): Promise<WCCategory[]> {
    const all: WCCategory[] = [];
    let page = 1;
    while (true) {
      const batch = await wcFetch<WCCategory[]>(setting, 'products/categories', { page, per_page: 100 });
      if (!batch.length) break;
      all.push(...batch);
      if (batch.length < 100) break;
      page++;
    }
    return all;
  }

  /** Fetch variations for a variable product */
  async fetchVariations(setting: WCSetting, productId: number): Promise<WCVariation[]> {
    const all: WCVariation[] = [];
    let page = 1;
    while (true) {
      const batch = await wcFetch<WCVariation[]>(setting, `products/${productId}/variations`, {
        page,
        per_page: 100,
      });
      if (!batch.length) break;
      all.push(...batch);
      if (batch.length < 100) break;
      page++;
    }
    return all;
  }

  /** Fetch reviews for a product */
  async fetchReviews(setting: WCSetting, productId: number): Promise<WCReview[]> {
    return wcFetch<WCReview[]>(setting, 'products/reviews', { product: productId });
  }

  /** Get total product count */
  async getTotalProductCount(setting: WCSetting): Promise<number> {
    const url = buildUrl(setting, 'products', { per_page: 1, status: 'publish' });
    const resp = await fetchWithTimeout(url, {
      headers: { Authorization: makeAuth(setting.consumerKey, setting.consumerSecret) },
      timeout: 15000,
    });
    if (!resp.ok) throw new Error(`WC API ${resp.status}`);
    const total = parseInt(resp.headers.get('X-WP-Total') ?? '0', 10);
    return total;
  }
}

export const wordPressService = new WordPressService();
