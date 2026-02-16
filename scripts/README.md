# Feed Processing Scripts

## Overview

This directory contains scripts to process product feeds from affiliate partners and download product images.

## Scripts

### `process-feeds.ts`

Processes XML product feeds from all 4 partners and downloads product images.

**Features:**
- Parses large XML files efficiently (handles 48MB+ feeds)
- Downloads product images with retry logic
- Generates proper affiliate tracking URLs
- Categorizes products automatically
- Extracts colors and attributes
- Saves all products to `data/products.json`
- Shows progress during processing
- Skips already-downloaded images

**Usage:**

```bash
npm run feed:process
```

**Configuration:**

Edit these constants in the script to customize:

```typescript
const MAX_PRODUCTS_PER_PARTNER = 100  // Limit products per partner (set to Infinity for all)
const IMAGE_DOWNLOAD_RETRY = 3        // Number of retry attempts for failed downloads
const IMAGE_TIMEOUT = 10000           // Timeout for image downloads (ms)
```

**Partners:**

The script processes feeds from:

1. **Cramers Blommor**
   - Feed: `feeds/cramersblommor.xml` (48MB)
   - Tracking: `https://pin.cramersblommor.com/t/t?a=1954033070&as=1771789045&t=2&tk=1&url={ProductUrl}`
   - Same-day delivery: Yes

2. **Fakeflowers**
   - Feed: `feeds/fakeflowers.xml` (408KB)
   - Tracking: `https://go.fakeflowers.se/t/t?a=1998457785&as=1771789045&t=2&tk=1&url={ProductUrl}`
   - Same-day delivery: No

3. **Interflora**
   - Feed: `feeds/interflora.xml` (257KB)
   - Tracking: `https://go.adt246.net/t/t?a=767510657&as=1771789045&t=2&tk=1&url={ProductUrl}`
   - Same-day delivery: Yes

4. **My Perfect Day**
   - Feed: `feeds/myperfectday.xml` (8.6MB)
   - Tracking: `https://in.myperfectday.se/t/t?a=1615913086&as=1771789045&t=2&tk=1&url={ProductUrl}`
   - Same-day delivery: No

**Output:**

- **Products JSON:** `data/products.json`
  - Contains all processed products with metadata
  - Used by the Next.js app to display products

- **Product Images:** `public/images/products/`
  - Format: `{partnerId}-{sku}.{ext}`
  - Example: `cramers-CRM001.jpg`

**Product Structure:**

Each product includes:
- Basic info (name, description, SKU)
- Pricing (price, original price, shipping, discount)
- Categorization (main category, subcategories, tags)
- Attributes (colors, size, style, occasions)
- Images (URL and local path)
- Affiliate links (product URL and tracking URL)
- Metadata (brand, popularity score, timestamps)

**Error Handling:**

- Failed image downloads are logged but don't stop processing
- Products without images still get processed
- Invalid or missing data uses sensible defaults
- All errors are logged to console

**Progress Output:**

The script shows detailed progress:
```
🏪 Processing Cramers Blommor (cramers)
================================================================================
📄 Parsing feed: cramersblommor.xml
   Found 5000 products in feed
📊 Processing first 100 products (limit: 100)

[1/100] Processing: Romantisk Rosbukett
   SKU: CRM001
   ⬇️  Downloading image...
   ✅ Image downloaded

[2/100] Processing: Tulpanbukett
   SKU: CRM002
   ⏭️  Image already exists, skipping download

...

📊 Cramers Blommor Summary:
   Products processed: 100
   Images downloaded: 85
   Images skipped: 10
   Images failed: 5
```

## Next Steps

After running `npm run feed:process`:

1. **Check the output:**
   - Review `data/products.json` to see all processed products
   - Check `public/images/products/` for downloaded images

2. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app will now load products from the JSON file instead of mock data.

3. **Process all products:**
   To process ALL products (not just 100 per partner), edit `process-feeds.ts`:
   ```typescript
   const MAX_PRODUCTS_PER_PARTNER = Infinity
   ```

4. **Re-run periodically:**
   Set up a cron job or manual process to re-fetch feeds and update products:
   ```bash
   npm run feed:fetch    # Download latest feeds (if implemented)
   npm run feed:process  # Process feeds and download images
   ```

## Troubleshooting

**Problem:** Images not downloading
- Check internet connection
- Verify image URLs are accessible
- Increase `IMAGE_TIMEOUT` if on slow connection

**Problem:** Script runs out of memory
- Reduce `MAX_PRODUCTS_PER_PARTNER`
- Process partners one at a time

**Problem:** Products not showing in app
- Verify `data/products.json` exists
- Check console for loading errors
- Ensure Next.js dev server is restarted

## Future Enhancements

Potential improvements:
- [ ] Parallel image downloads for faster processing
- [ ] Image optimization (resize, compress, convert to WebP)
- [ ] Incremental updates (only process changed products)
- [ ] Database integration (store products in PostgreSQL/MongoDB)
- [ ] Status feed processing (update stock/price from status feeds)
- [ ] Image validation (check dimensions, file size)
- [ ] Duplicate detection (find similar products across partners)
- [ ] Category mapping improvements (more sophisticated categorization)
