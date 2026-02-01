# Feed Processing Guide for Skickablomma.se

## Quick Start

Follow these steps to process product feeds and download images:

### 1. Test the Feed Parser (Optional)

First, verify that the feed parsing works correctly:

```bash
npx tsx scripts/test-feed-processing.ts
```

This will:
- Parse the Fakeflowers feed (smallest, 408KB)
- Show the first 5 products
- Verify XML parsing works
- Test tracking URL generation

Expected output:
```
🧪 Testing Feed Processing
================================================================================
Working directory: /Users/ted/...
Test feed: /Users/ted/.../feeds/fakeflowers.xml

📊 Feed size: 408.00 KB
📄 Parsing XML...
✅ Found 500 products in feed

📦 First 5 products:
...
```

### 2. Run the Full Feed Processor

Process all 4 partner feeds and download images:

```bash
npm run feed:process
```

**What this does:**
- Parses all 4 XML feeds (Cramers, Fakeflowers, Interflora, My Perfect Day)
- Processes 100 products per partner (400 total)
- Downloads product images to `public/images/products/`
- Generates affiliate tracking URLs
- Categorizes products automatically
- Saves all products to `data/products.json`

**Processing time:**
- ~2-5 minutes for 100 products per partner (400 total)
- ~15-30 minutes for all products (thousands)

**Progress output:**
```
🌸 Skickablomma.se Feed Processor
================================================================================
Base directory: /Users/ted/...
Feeds directory: /Users/ted/.../feeds
Images directory: /Users/ted/.../public/images/products
Output file: /Users/ted/.../data/products.json
Products per partner: 100

================================================================================
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

...

================================================================================
📈 FINAL SUMMARY
================================================================================
Total products processed: 400
  Cramers Blommor: 100 products
  Fakeflowers: 100 products
  Interflora: 100 products
  My Perfect Day: 100 products

📦 Sample products:
...

✅ Done!
```

### 3. Verify the Output

Check that everything was created correctly:

```bash
# Check products JSON
ls -lh data/products.json

# Check downloaded images
ls -lh public/images/products/ | head -20

# View product count
cat data/products.json | grep '"id"' | wc -l
```

### 4. Start the Development Server

The Next.js app will now load products from the JSON file:

```bash
npm run dev
```

Open http://localhost:3000 to see the products.

## Configuration

### Process More/Fewer Products

Edit `scripts/process-feeds.ts`:

```typescript
// Line ~95
const MAX_PRODUCTS_PER_PARTNER = 100  // Change this number

// Examples:
const MAX_PRODUCTS_PER_PARTNER = 50      // Process 50 per partner (fast test)
const MAX_PRODUCTS_PER_PARTNER = 500     // Process 500 per partner
const MAX_PRODUCTS_PER_PARTNER = Infinity // Process ALL products (slow!)
```

### Adjust Image Download Settings

Edit `scripts/process-feeds.ts`:

```typescript
// Lines ~96-97
const IMAGE_DOWNLOAD_RETRY = 3     // Retry failed downloads 3 times
const IMAGE_TIMEOUT = 10000        // Timeout after 10 seconds
```

## Output Files

### `data/products.json`

Main product database in JSON format:

```json
{
  "generatedAt": "2026-02-01T12:00:00.000Z",
  "totalProducts": 400,
  "partners": ["cramers", "fakeflowers", "interflora", "myperfectday"],
  "products": [
    {
      "id": "cramers-CRM001",
      "sku": "CRM001",
      "partnerId": "cramers",
      "name": "Romantisk Rosbukett",
      "description": "En vacker bukett med röda rosor...",
      "mainCategory": "buketter",
      "subCategories": ["rosor", "roda-blommor"],
      "price": 549,
      "shipping": 79,
      "trackingUrl": "https://pin.cramersblommor.com/t/t?a=...",
      "primaryImage": {
        "url": "https://...",
        "localPath": "/images/products/cramers-CRM001.jpg"
      },
      ...
    },
    ...
  ]
}
```

### `public/images/products/`

Downloaded product images:

```
public/images/products/
├── cramers-CRM001.jpg
├── cramers-CRM002.jpg
├── fakeflowers-FF001.jpg
├── interflora-INT001.jpg
├── myperfectday-MPD001.jpg
└── ...
```

Filename format: `{partnerId}-{sku}.{ext}`

## Affiliate Tracking URLs

The script generates proper tracking URLs for each partner:

### Cramers Blommor
```
https://pin.cramersblommor.com/t/t?a=1954033070&as=1771789045&t=2&tk=1&url={ProductUrl}
```

### Fakeflowers
```
https://go.fakeflowers.se/t/t?a=1998457785&as=1771789045&t=2&tk=1&url={ProductUrl}
```

### Interflora
```
https://go.adt246.net/t/t?a=767510657&as=1771789045&t=2&tk=1&url={ProductUrl}
```

### My Perfect Day
```
https://in.myperfectday.se/t/t?a=1615913086&as=1771789045&t=2&tk=1&url={ProductUrl}
```

## Product Categorization

Products are automatically categorized based on their name and category:

### Main Categories
- `buketter` - Flower bouquets
- `begravning` - Funeral flowers
- `brollop` - Wedding flowers
- `konstgjorda-blommor` - Artificial flowers

### Subcategories (Auto-detected)
- Flower types: `rosor`, `tulpaner`, `liljor`, `solrosor`, `orkideer`
- Colors: `roda-blommor`, `rosa-blommor`, `vita-blommor`, `gula-blommor`
- And more...

### Color Extraction
Colors are automatically extracted from product names and descriptions:
- `röd/red` → `röd`
- `rosa/pink` → `rosa`
- `vit/white` → `vit`
- `gul/yellow` → `gul`
- `lila/purple` → `lila`
- `blå/blue` → `blå`

## Troubleshooting

### Feed file not found
```
❌ Feed file not found: /Users/ted/.../feeds/cramersblommor.xml
```

**Solution:** Make sure all feed files are in the `feeds/` directory:
- `feeds/cramersblommor.xml`
- `feeds/fakeflowers.xml`
- `feeds/interflora.xml`
- `feeds/myperfectday.xml`

### Image download fails
```
❌ Failed to download image after 3 attempts: https://...
```

**Possible causes:**
- Network issues
- Image URL no longer valid
- Image server blocking requests

**Solution:** Products will still be processed without images. Re-run the script later and it will try again.

### Out of memory
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Solution:** Reduce `MAX_PRODUCTS_PER_PARTNER` to process fewer products at once.

### Products not showing in app
```
Loaded 0 products from JSON
```

**Possible causes:**
- `data/products.json` doesn't exist
- JSON file is corrupted
- Next.js server needs restart

**Solution:**
1. Verify `data/products.json` exists
2. Check JSON is valid: `cat data/products.json | jq '.totalProducts'`
3. Restart dev server: `npm run dev`

## Next Steps

After processing feeds:

### 1. Test the Website
```bash
npm run dev
```

Visit these pages to verify:
- Homepage: http://localhost:3000
- Products page: http://localhost:3000/produkter
- Search: http://localhost:3000/produkter?query=ros

### 2. Process All Products
Change the limit to process all products:
```typescript
const MAX_PRODUCTS_PER_PARTNER = Infinity
```

Then run:
```bash
npm run feed:process
```

### 3. Set Up Periodic Updates
Create a cron job to update feeds daily:
```bash
# Run every day at 3 AM
0 3 * * * cd /path/to/project && npm run feed:process
```

### 4. Optimize Images
Consider adding image optimization:
- Resize to consistent dimensions (e.g., 800x800)
- Compress to reduce file size
- Convert to WebP for better performance

### 5. Add to Database
For production, consider storing products in a database:
- PostgreSQL
- MongoDB
- Supabase
- PlanetScale

## Files Created

This solution created the following files:

### Scripts
- `scripts/process-feeds.ts` - Main feed processor
- `scripts/test-feed-processing.ts` - Test script
- `scripts/README.md` - Scripts documentation

### Data
- `data/products.json` - Generated product database

### Images
- `public/images/products/*.jpg` - Downloaded product images

### Code Updates
- `src/lib/products.ts` - Updated to load from JSON instead of mock data

### Documentation
- `FEED_PROCESSING_GUIDE.md` - This guide

## Summary

You now have a complete feed processing solution that:

✅ Parses XML feeds from 4 affiliate partners
✅ Downloads product images with retry logic
✅ Generates proper affiliate tracking URLs
✅ Categorizes products automatically
✅ Extracts colors and attributes
✅ Saves everything to JSON
✅ Updates the Next.js app to use real data

**To get started, run:**
```bash
npm run feed:process
```

**For questions or issues, check:**
- `scripts/README.md` - Detailed script documentation
- Script output for error messages
- `data/products.json` - Verify generated data
