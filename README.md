# Owl.md Landing Page

Modern, animated landing page for Owl.md app with mobile mockups and smooth animations.

## 📁 Project Structure

```
owlmd/
├── index.html                          # Main landing page
├── assets/
│   ├── css/
│   │   ├── main.css                   # Core styles & layout
│   │   └── animations.css             # Scroll animations & effects
│   ├── js/
│   │   ├── main.js                    # Interactive features
│   │   └── animations.js              # Animation system
│   ├── images/                        # General images
│   │   ├── logo.svg                   # Owl.md logo
│   │   ├── favicon.svg                # Favicon
│   │   ├── og-image.jpg               # Open Graph image (1200x630)
│   │   ├── theme-professional.png     # Theme preview images
│   │   ├── theme-modern.png
│   │   ├── theme-minimalist.png
│   │   └── theme-classic.png
│   └── mockups/                       # App screenshots
│       ├── hero-screen.png            # Main hero screenshot
│       ├── live-preview.png           # Live preview feature
│       ├── themes.png                 # Themes selection
│       ├── github.png                 # GitHub integration
│       └── files.png                  # File management
└── README.md                          # This file
```

## 📸 Adding Your Screenshots

### Required Screenshots

You need **5 app screenshots** and **4 PDF theme previews**:

#### 1. App Screenshots (Phone Screens)

Place these in `assets/mockups/`:

| File Name | Description | Recommended Size |
|-----------|-------------|------------------|
| `hero-screen.png` | Main app interface (Editor or Preview) | 1080x2400px |
| `live-preview.png` | Split view showing editor + preview | 1080x2400px |
| `themes.png` | Theme selection screen | 1080x2400px |
| `github.png` | GitHub URL input or loading screen | 1080x2400px |
| `files.png` | File history/management screen | 1080x2400px |

**How to capture:**
1. Open Owl.md app on your Android device
2. Navigate to the desired screen
3. Take screenshot (Power + Volume Down)
4. Transfer to computer
5. Rename according to table above
6. Place in `assets/mockups/` folder

**Tips:**
- Use clean, representative content in screenshots
- Avoid sensitive or personal information
- Capture in high resolution (1080p or better)
- Use light mode for better visibility (or dark if preferred)

#### 2. PDF Theme Previews

Place these in `assets/images/`:

| File Name | Description | Recommended Size |
|-----------|-------------|------------------|
| `theme-professional.png` | Professional theme sample | 800x1000px |
| `theme-modern.png` | Modern theme sample | 800x1000px |
| `theme-minimalist.png` | Minimalist theme sample | 800x1000px |
| `theme-classic.png` | Classic theme sample | 800x1000px |

**How to create:**
1. Open Owl.md app
2. Create a sample markdown document with various elements (headers, lists, code, etc.)
3. Export PDF with each theme
4. Take screenshot of PDF or convert first page to PNG
5. Crop to show document content
6. Resize to 800x1000px
7. Save with appropriate theme name

### Optional Images

| File Name | Description | Size |
|-----------|-------------|------|
| `logo.svg` | Owl.md logo vector | SVG |
| `favicon.svg` | Favicon | SVG or 32x32 PNG |
| `og-image.jpg` | Social media preview image | 1200x630px |

## 🚀 Deployment

### Option 1: Deploy to `injazapps.com/owlmd`

1. **Upload files via FTP/SFTP:**
   ```bash
   # Upload entire owlmd folder to your server
   # Final structure: public_html/owlmd/
   ```

2. **Verify URL:**
   - Visit: `https://injazapps.com/owlmd`
   - Test all links and animations

3. **Update Google Play Store link:**
   - Edit `index.html` line ~240
   - Replace `https://play.google.com/store/apps/details?id=com.owlmd` with actual URL

### Option 2: Deploy to GitHub Pages

1. **Move to `docs/` folder:**
   ```bash
   mv owlmd/* docs/
   ```

2. **Enable GitHub Pages:**
   - Repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `docs`

3. **Access at:**
   - `https://drmafouad.github.io/Owl.md/`

### Option 3: Deploy to Vercel/Netlify

1. **Connect repository to Vercel:**
   - Import project
   - Set root directory to `owlmd/`
   - Deploy

2. **Custom domain:**
   - Add `owlmd.injazapps.com` in settings
   - Update DNS CNAME record

## ⚙️ Customization

### Update App Store Links

**Google Play Store** (`index.html` line ~240):
```html
<a href="YOUR_PLAY_STORE_URL" class="store-button google-play">
```

**App Store** (when available, line ~254):
```html
<a href="YOUR_APP_STORE_URL" class="store-button app-store">
```
Remove `disabled` class when ready.

### Update Statistics

**Hero section** (`index.html` line ~95):
```html
<div class="stat-value">10K+</div> <!-- Update download count -->
```

### Modify Colors

**Main colors** (`assets/css/main.css` line ~10):
```css
:root {
    --accent-orange: #F59E0B;  /* Change primary color */
    --accent-purple: #8B5CF6;  /* Change secondary color */
    /* ... */
}
```

### Add New Sections

1. Add HTML in `index.html`
2. Style in `assets/css/main.css`
3. Add scroll animations with `data-aos` attributes

## 🎨 Design System

### Colors

- **Background Dark:** `#0A0E27`
- **Background Darker:** `#060920`
- **Card Background:** `#12172E`
- **Primary Accent:** `#F59E0B` (Amber)
- **Secondary Accent:** `#8B5CF6` (Purple)
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#94A3B8`

### Typography

- **Font:** Inter (Google Fonts)
- **Hero Title:** 3.5rem / 800 weight
- **Section Title:** 3rem / 800 weight
- **Body:** 1rem / 400 weight

### Spacing

- **XS:** 0.5rem (8px)
- **SM:** 1rem (16px)
- **MD:** 1.5rem (24px)
- **LG:** 2rem (32px)
- **XL:** 3rem (48px)

## 🔧 Features

### Included Animations

- ✅ Scroll-triggered fade/slide animations
- ✅ Floating phone mockups with parallax
- ✅ Smooth scroll navigation
- ✅ Counter animations for stats
- ✅ Hover effects on cards and buttons
- ✅ Gradient orb background animations
- ✅ Scroll progress indicator
- ✅ Mobile-responsive menu

### Interactive Elements

- ✅ Smooth scroll to sections
- ✅ Phone mockup tilt on hover
- ✅ Theme card hover effects
- ✅ Animated gradient text
- ✅ Mobile menu toggle
- ✅ External link handling
- ✅ Analytics event tracking

## 📱 Responsive Breakpoints

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Wide:** 1440px+

All layouts are mobile-first and fully responsive.

## 🔍 SEO Optimization

### Included Meta Tags

- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Card
- ✅ Viewport and charset
- ✅ Description and keywords

### To Add

1. **Structured Data (JSON-LD):**
   - Add before `</head>` in `index.html`
   - Use schema.org/SoftwareApplication

2. **Sitemap:**
   - Create `sitemap.xml` in root
   - Submit to Google Search Console

3. **robots.txt:**
   - Create in root directory
   - Allow all crawlers

## 🚀 Performance

### Optimization Tips

1. **Compress images:**
   ```bash
   # Use tools like TinyPNG or ImageOptim
   # Convert PNG to WebP for smaller file sizes
   ```

2. **Minify CSS/JS:**
   ```bash
   # Use online tools or build process
   # cssnano for CSS
   # terser for JavaScript
   ```

3. **Enable caching:**
   - Add `.htaccess` with cache headers
   - Or configure server cache settings

4. **Use CDN:**
   - Consider Cloudflare or similar
   - Improves load times globally

### Current Performance

- **Lighthouse Score Target:** 90+
- **Load Time Target:** < 3s
- **First Contentful Paint:** < 1.5s

## 📊 Analytics Setup

### Google Analytics 4

Add before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-friendly)

Add before `</head>`:
```html
<script defer data-domain="injazapps.com" src="https://plausible.io/js/script.js"></script>
```

## 🐛 Troubleshooting

### Images Not Showing

1. Check file paths are correct
2. Verify image files exist in correct folders
3. Check file permissions (644 for files, 755 for folders)
4. Clear browser cache

### Animations Not Working

1. Ensure JavaScript files are loaded
2. Check browser console for errors
3. Verify scroll position (animations trigger on scroll)
4. Test in different browsers

### Mobile Menu Not Appearing

1. Check viewport width (< 768px)
2. Verify JavaScript is enabled
3. Check console for errors

### Slow Page Load

1. Compress/optimize images
2. Minify CSS and JavaScript
3. Enable server compression (gzip)
4. Use lazy loading for images

## 📞 Support

For issues or questions:
- **GitHub Issues:** https://github.com/drmafouad/Owl.md/issues
- **Email:** support@injazapps.com

## 📝 Checklist Before Launch

- [ ] All screenshots added and optimized
- [ ] Google Play Store link updated
- [ ] Contact email updated in footer
- [ ] Analytics tracking added
- [ ] Meta tags and OG image configured
- [ ] Favicon added
- [ ] All links tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Performance optimized (Lighthouse score 90+)
- [ ] SEO meta tags complete
- [ ] 404 page created (if applicable)
- [ ] SSL certificate active (HTTPS)

## 🎉 Next Steps

1. **Capture and add screenshots** (highest priority)
2. **Test on multiple devices** (phone, tablet, desktop)
3. **Upload to server** at `injazapps.com/owlmd`
4. **Update Play Store listing** with landing page URL
5. **Share on social media** to drive traffic
6. **Monitor analytics** and gather feedback

---

**Built with ❤️ for Owl.md**
