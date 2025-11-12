# Deployment Guide - Owl.md Landing Page

## 🎯 Deployment to injazapps.com/owlmd

### Prerequisites

- FTP/SFTP access to `injazapps.com`
- All screenshots ready (see README.md)
- Google Play Store link (when available)

---

## 📦 Step 1: Prepare Files

### 1.1 Add All Screenshots

Before deploying, ensure all required images are in place:

```bash
# Check if all mockup screenshots exist
ls -la owlmd/assets/mockups/
# Should show:
# - hero-screen.png
# - live-preview.png
# - themes.png
# - github.png
# - files.png

# Check if all theme previews exist
ls -la owlmd/assets/images/
# Should show:
# - theme-professional.png
# - theme-modern.png
# - theme-minimalist.png
# - theme-classic.png
```

### 1.2 Optimize Images

```bash
# Compress PNG images (optional but recommended)
# Using ImageOptim, TinyPNG, or command line tools

# Example with pngquant (if installed)
pngquant --quality=65-80 owlmd/assets/mockups/*.png
pngquant --quality=65-80 owlmd/assets/images/*.png

# Convert to WebP for even better compression (optional)
# cwebp hero-screen.png -o hero-screen.webp
```

### 1.3 Update Links

Edit `owlmd/index.html` and update:

**Line ~240 - Google Play Store:**
```html
<a href="https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME"
   class="store-button google-play" target="_blank">
```

**Line ~280 - Footer email:**
```html
<a href="mailto:YOUR_EMAIL@injazapps.com">Contact</a>
```

**Line ~12 - Open Graph image URL:**
```html
<meta property="og:image" content="https://injazapps.com/owlmd/assets/images/og-image.jpg">
```

---

## 🚀 Step 2: Deploy via FTP/SFTP

### Method A: Using FileZilla

1. **Connect to server:**
   - Host: `ftp.injazapps.com` (or your FTP host)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (FTP) or 22 (SFTP)

2. **Navigate to web root:**
   ```
   /public_html/  (or /www/ or /httpdocs/)
   ```

3. **Upload owlmd folder:**
   - Drag and drop entire `owlmd/` folder
   - Wait for upload to complete
   - Final structure: `/public_html/owlmd/`

4. **Set permissions:**
   - Files: 644
   - Folders: 755
   - (Usually set automatically)

### Method B: Using Command Line (SFTP)

```bash
# Connect via SFTP
sftp username@injazapps.com

# Navigate to web root
cd public_html

# Upload entire folder
put -r owlmd/

# Set permissions if needed
chmod 755 owlmd
chmod 755 owlmd/assets
chmod 644 owlmd/index.html

# Disconnect
exit
```

### Method C: Using rsync (Fastest)

```bash
# One-time sync (dry run first to test)
rsync -avz --dry-run owlmd/ username@injazapps.com:~/public_html/owlmd/

# Actual sync
rsync -avz owlmd/ username@injazapps.com:~/public_html/owlmd/

# Future updates (only syncs changed files)
rsync -avz --delete owlmd/ username@injazapps.com:~/public_html/owlmd/
```

---

## 🔍 Step 3: Verify Deployment

### 3.1 Test URL

Visit: `https://injazapps.com/owlmd`

**Check:**
- [ ] Page loads correctly
- [ ] All images display
- [ ] Navigation links work
- [ ] Animations trigger on scroll
- [ ] Mobile menu works (test on phone)
- [ ] Download buttons link correctly
- [ ] No console errors (F12 → Console)

### 3.2 Test on Multiple Devices

**Desktop:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Mobile:**
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile menu toggles properly

**Tablet:**
- [ ] iPad
- [ ] Android tablet

### 3.3 Performance Check

**Run Lighthouse Audit:**
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Click "Generate report"
4. Target scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

**Fix common issues:**
- Compress images if performance < 90
- Add alt text if accessibility < 90
- Fix any console errors

---

## ⚙️ Step 4: Configure Server (Optional)

### 4.1 Create .htaccess (Apache)

Create `owlmd/.htaccess`:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Force HTTPS (if SSL is configured)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

Upload this file to `public_html/owlmd/.htaccess`

### 4.2 SSL Certificate

Ensure HTTPS is enabled:
- Contact your hosting provider
- Or use Let's Encrypt (free)
- Most hosts provide free SSL via cPanel

---

## 📊 Step 5: Analytics & SEO

### 5.1 Add Google Analytics

1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (e.g., G-XXXXXXXXXX)
3. Edit `index.html` and add before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 5.2 Submit to Search Engines

**Google Search Console:**
1. Visit https://search.google.com/search-console
2. Add property: `https://injazapps.com/owlmd`
3. Verify ownership
4. Submit sitemap (create `sitemap.xml` first)

**Bing Webmaster Tools:**
1. Visit https://www.bing.com/webmasters
2. Add and verify site
3. Submit URL

### 5.3 Create Sitemap

Create `owlmd/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://injazapps.com/owlmd</loc>
    <lastmod>2025-11-11</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 5.4 Create robots.txt

Create `owlmd/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://injazapps.com/owlmd/sitemap.xml
```

---

## 🔗 Step 6: Integration

### 6.1 Link from Main Site

Add link to your main injazapps.com navigation:

```html
<a href="/owlmd">Owl.md</a>
```

### 6.2 Update Google Play Listing

When app is published:
1. Go to Google Play Console
2. Edit store listing
3. Add website: `https://injazapps.com/owlmd`

### 6.3 Social Media

Share on:
- [ ] Twitter/X
- [ ] LinkedIn
- [ ] Reddit (r/androidapps, r/markdown)
- [ ] Product Hunt
- [ ] Hacker News

Use the Open Graph image for previews.

---

## 🔄 Step 7: Maintenance & Updates

### Regular Updates

**Monthly:**
- Update download statistics
- Check for broken links
- Review analytics data

**Per App Release:**
- Update version number
- Add new features to feature list
- Update screenshots if UI changed
- Generate new demo videos

### Quick Updates via SFTP

```bash
# Update only changed files
sftp username@injazapps.com
cd public_html/owlmd
put index.html
put assets/css/main.css
exit
```

### Full Redeployment

```bash
# Sync all changes
rsync -avz --delete owlmd/ username@injazapps.com:~/public_html/owlmd/
```

---

## 🐛 Troubleshooting

### Issue: 404 Not Found

**Solution:**
- Check folder path: `/public_html/owlmd/`
- Verify `index.html` exists
- Check file permissions (644)

### Issue: Images Not Loading

**Solution:**
- Check image paths in HTML
- Verify images uploaded to correct folder
- Check file names (case-sensitive on Linux servers)
- Clear browser cache

### Issue: CSS/JS Not Loading

**Solution:**
- Check file paths in HTML
- Verify files uploaded correctly
- Clear browser cache (Ctrl+F5)
- Check `.htaccess` for any blocking rules

### Issue: Slow Load Times

**Solution:**
- Compress images (use TinyPNG)
- Enable gzip compression in `.htaccess`
- Use CDN (Cloudflare)
- Minify CSS and JS

### Issue: Mobile Menu Not Working

**Solution:**
- Check JavaScript console for errors
- Verify `main.js` is loaded
- Test on actual mobile device (not just browser resize)

---

## ✅ Post-Deployment Checklist

- [ ] URL loads: `https://injazapps.com/owlmd`
- [ ] All images display correctly
- [ ] Animations work smoothly
- [ ] Mobile responsive
- [ ] Navigation links work
- [ ] Download buttons link to store
- [ ] No console errors
- [ ] Lighthouse score 90+
- [ ] HTTPS enabled (SSL)
- [ ] Analytics installed
- [ ] Search Console verified
- [ ] Shared on social media
- [ ] Linked from main site

---

## 📞 Support

**Need help?**
- Check README.md for common issues
- Review browser console for errors
- Contact hosting support for server issues

**Contact:**
- Email: support@injazapps.com
- GitHub: https://github.com/drmafouad/Owl.md/issues

---

## 🎉 You're Done!

Your landing page is now live at:
**https://injazapps.com/owlmd**

Monitor analytics and gather user feedback to continuously improve!
