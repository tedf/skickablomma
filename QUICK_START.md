# Quick Start Guide

## TL;DR

```bash
# 1. Test the parser (optional)
npx tsx scripts/test-feed-processing.ts

# 2. Process feeds and download images
npm run feed:process

# 3. Start the app
npm run dev
```

## What This Does

1. **Parses** all 4 XML feeds (Cramers, Fakeflowers, Interflora, My Perfect Day)
2. **Downloads** product images to `public/images/products/`
3. **Generates** affiliate tracking URLs
4. **Saves** all products to `data/products.json`
5. **Updates** the Next.js app to show real products

## Expected Time

- **Test:** ~5 seconds
- **Process 100 products/partner:** ~2-5 minutes
- **Process ALL products:** ~15-30 minutes

## Current Settings

- 100 products per partner (400 total)
- Images with 3 retry attempts
- 10 second timeout per image

## Output

- `data/products.json` - All processed products
- `public/images/products/` - Downloaded images

## Verify Success

```bash
# Check products count
cat data/products.json | grep '"id"' | wc -l

# Check images count
ls public/images/products/ | wc -l

# View sample product
cat data/products.json | jq '.products[0]'
```

## Next Steps

1. Run `npm run dev`
2. Visit http://localhost:3000
3. See real products instead of mock data

## Documentation

- `FEED_PROCESSING_GUIDE.md` - Detailed user guide
- `IMPLEMENTATION_SUMMARY.md` - Technical overview
- `scripts/README.md` - Script documentation

## Need Help?

All four affiliate partners configured:
- ✅ Cramers Blommor (48MB feed, ~5000 products)
- ✅ Fakeflowers (408KB feed, ~500 products)
- ✅ Interflora (257KB feed, ~300 products)
- ✅ My Perfect Day (8.6MB feed, ~1000 products)

Tracking URLs are properly configured for all partners.

## Process All Products

To process ALL products instead of just 100 per partner:

1. Edit `scripts/process-feeds.ts`
2. Change line ~95: `const MAX_PRODUCTS_PER_PARTNER = Infinity`
3. Run: `npm run feed:process`

## That's It!

You're ready to go. Run:

```bash
npm run feed:process
```
