# 📖 Owl.md User Guide

**Last Updated:** 2025-12-14
**App Version:** 1.1.47

Welcome to **Owl.md** - your professional markdown to PDF converter! This guide will help you master all the features.

---

## 🚀 Quick Start

### Creating Your First PDF

1. **Write Markdown**: Type or paste your markdown content in the editor
2. **Preview**: Swipe or tap the "Preview" tab to see how it looks with smooth slide animation
3. **Choose Theme**: Select from 4 beautiful PDF themes (Professional, Modern, Minimalist, Classic)
4. **Save & Share**: Your PDF is ready to save and share!

---

## ✏️ Using the Markdown Editor

### Basic Editing

- **Type freely** - The editor supports all standard markdown syntax
- **Live preview** - Swipe or tap to switch between Editor and Preview with smooth animations
- **Auto-save** - Your work is automatically saved locally
- **Smooth transitions** - Professional slide animations when switching views

### Formatting Toolbar

Access quick formatting tools at the bottom of the editor:

- **H** -Insert heading (choose H1-H6)
- **Bold** text
- *Italic text*
- ==Highlight==
- **[ ]** - Create checklist
- `Code` - Add code block
- **>** - Insert blockquote
- **•** - Create bullet list
- **1.** - Create numbered list
- **🖼️** - Insert image (new!)

---

## 🖼️ Image Insertion ✨ NEW Feature

Insert images into your markdown with advanced control:

### Using the Image Button

1. Tap the 🖼️ button in the formatting toolbar
2. Choose your image source:
   - **From Device**: Select from your photo library or files
   - **From URL**: Enter an image URL (https://)
3. Set image properties:
   - **Width**: Auto, 25%, 50%, 75%, or 100%
   - **Alignment**: Left, Center, or Right
4. Add optional alt text (description)
5. Tap "Insert"

### Image Syntax

Images use this format:

```markdown
![Alt text](url){width=50% align=center}
```

**Examples:**

```markdown
![Logo](https://example.com/logo.png){width=25% align=left}
![Photo](path/to/image.jpg){width=75% align=center}
![Diagram](diagram.png){width=100% align=left}
```

**Supported image sources:**

- **Local files**: Select from device storage
- **URLs**: Images from any HTTPS URL are automatically fetched and embedded
- **Formats**: PNG, JPG, JPEG, GIF supported

**Features:**

- ✅ **Smart caching**: Images are cached to improve performance
- ✅ **Placeholders**: If an image can't be loaded, a placeholder with alt text appears
- ✅ **Timeout handling**: Network images timeout after 10 seconds
- ✅ **Mixed content**: Images work perfectly in paragraphs

---

## 📄 Working with Files

### Opening Markdown Files

1. Tap the folder icon (📁) in the top bar
2. Choose from available options
   1. Device
   2. Saved Files
   3. GitHub Url - should be public repository
   4. Recent files
3. Select a `.md` file from source
4. The content appears in the editor

### Saving Files

**Save Markdown:**

1. Tap More Menu (⋮)
2. Select "Save As..."
3. Choose "Save as Markdown"
4. File wil be saved to app folder and share dialog appears.

**Save PDF:**

1. Tap More Menu (⋮)
2. Select "Save As..."
3. Choose "Save as PDF"
4. File wil be saved to app folder and share dialog appears.

### Load Files

1. Access recently opened files:
2. Tap More Menu (⋮)
3. Tap Load files
4. Choose from available options
   * Device
   * Saved Files
   * GitHub Url - should be public repository
   * Recent files
5. Tap any file to open it

---

## 🎨 PDF Themes

Choose from 4 professionally designed themes, each optimized for different use cases:

### 1. **Professional** (Default)

- **Font**: Inter (clean sans-serif)
- **Accent**: Professional blue
- **Best for**: Business documents, reports, professional writing
- **Style**: Ultra-clean high-contrast design with pure black text

### 2. **Modern**

- **Font**: Asap (contemporary sans-serif)
- **Accent**: Vibrant orange
- **Best for**: Creative projects, presentations, marketing materials
- **Style**: Clean minimal style with Baseline-inspired colors

### 3. **Minimalist**

- **Font**: Ubuntu (matching PDF rendering)
- **Accent**: Medium gray
- **Best for**: Technical documentation, minimalist designs
- **Style**: Black/gray only palette for ultimate simplicity

### 4. **Classic**

- **Font**: Noto Serif (traditional serif)
- **Accent**: Saddle brown
- **Best for**: Academic papers, formal documents, traditional publishing
- **Style**: Ivory background with serif typography

**How to Change Theme:**

- Tap More Menu (⋮)
- Choose Document Theme
- Choose from available themes

**Theme Features:**

- ✅ Hierarchical font sizes (H1 largest → H6 smallest)
- ✅ Theme-specific font families
- ✅ Matching preview and PDF styling

---

## 📝 Markdown Syntax Guide

### Headers

Headers now have hierarchical sizing in all themes:

```markdown
# H1 Heading (Largest)
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading (Smallest)
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`Inline code`
==Highlighted text== 
```

### Lists

**Bullet List:**

```markdown
- First item
- Second item
  - Nested item
```

**Numbered List:**

```markdown
1. First step
2. Second step
   1. Sub-step
```

**Task List:**

```markdown
- [ ] Uncompleted task
- [x] Completed task
```

### Code Blocks

````markdown
```python
def hello():
    print("Hello World!")
```
````


### Blockquotes

```markdown
> This is a quote
> It can span multiple lines
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

**Table Features:**

- ✅ Automatic column width adjustment
- ✅ Header row styling
- ✅ Border rendering
- ✅ Text alignment support

### Links

```markdown
[Link text](https://example.com)
<https://auto-link.com>
```

**🎉 Links are clickable in PDFs!** Click any link in your generated PDF to open it in your browser.

### Horizontal Rule

```markdown
---
```

**New Styling:** Horizontal rules now appear as narrow (1pt), faded (30% opacity) lines for a more professional look.

---

## 🎯 Special Features

### Document Metadata & Title Page

Add professional metadata to your documents with YAML frontmatter:

```markdown
---
title: My Document Title
author: Your Name
date: 2025-12-14
version: 1.0.0
---

# Your content starts here
```

**Features:**

- **Auto Title Page**: Generates a beautiful centered title page
- **Page Numbers**: Automatically adds "Page X of Y" to all pages
- **Professional Watermark**: Subtle "Generated by OwlMD" with logo (30% opacity)

### Table of Contents

Automatically generate a table of contents from your headers if adding `[TOC]` to start of document:

```markdown
---
title: My Document
---

[TOC]

# Chapter 1
## Section 1.1
## Section 1.2

# Chapter 2
## Section 2.1
```

**TOC Features:**

- ✅ Auto-generates from H1-H6 headers
- ✅ Indents based on header level
- ✅ Clickable links to sections
- ✅ Page numbers for each entry


### Highlight Syntax

Highlight important text:

```markdown
This is normal text, but ==this is highlighted==!
```

The highlighted text appears with an accent color background in both preview and PDF.

### Emoji Support

Use any emoji directly - all render perfectly:

- 🎯 🔥 ✨ 💡 📝 ✅ ❌ 📊 🚀 💻 📱 🌟
- Emojis are automatically optimized for PDF rendering
- Variation selectors stripped for clean display

### Special Characters

Full support for:

- **Greek letters**: α β γ δ ε θ λ μ π σ φ ω Σ Δ Ω
- **Arrows**: → ← ↑ ↓ ↔ ⇒ ⇐ ⇔ ➜
- **Math symbols**: ∂ ∫ ∑ ∏ √ ∞ ≈ ≠ ≤ ≥ ± × ÷ °
- **Subscript/Superscript**: x² H₂O

---

## 🔗 GitHub Integration

Load markdown files directly from public GitHub repositories:

1. Tap folder icon (📁)
2. Select "Load from GitHub URL"
3. Paste a GitHub URL to a markdown file
4. File content loads automatically into the editor

**Supported URL formats:**

- Direct: `https://github.com/user/repo/blob/main/file.md`
- Raw: `https://raw.githubusercontent.com/user/repo/main/file.md`

**Requirements:**

- Public repositories only
- Internet connection required
- Valid markdown file

---

## 🌓 Theme & Display

### Light/Dark Mode

Toggle between themes:

1. Tap the theme icon (☀️/🌙) under settings menu in the More Menu (⋮)
2. Mode switches instantly
3. Preference is saved
4. All PDF themes work in both modes

### Smooth Animations

Professional slide animations throughout the app:

- **Mobile**: Swipe or tap to slide between Editor and Preview
- **Desktop**: Editor panel slides in/out smoothly
- **Loading indicators**: See progress while preview renders
- **Instant start**: Animation begins immediately, even during rendering

### Fullscreen Mode

Distraction-free writing:

1. Tap More Menu (⋮)
2. Select "Enter Fullscreen" under Settings
3. App bar hides for maximum space
4. Tap "Exit Fullscreen" button when done

---

## 📤 Sharing PDFs
1. Tap "Share PDF" button
2. Choose sharing method:
   - Email
   - WhatsApp
   - Drive
   - Any app that accepts PDFs
3. PDF shares instantly with professional formatting

---

## 🔔 Notifications & Updates

### In-App Announcements

- Check the bell icon (🔔) in top bar
- See new features and updates
- Red badge shows unread count
- Tap to view all announcements

### Reading Announcements

1. Tap bell icon
2. View announcements by category
3. Tap any announcement to expand
4. Pull down to refresh

---

## 💬 Getting Help & Support

### Report a Bug

1. Tap More Menu (⋮)
2. Select "Report a Bug"
3. Email opens with device info pre-filled
4. Describe the issue
5. Send email

### Request a Feature

1. Tap More Menu (⋮)
2. Select "Request a Feature"
3. Email opens with template
4. Share your idea
5. Send email

### Get Help

1. Tap More Menu (⋮)
2. Select "Get Help"
3. Email opens for support
4. Ask your question
5. We'll respond quickly!

**Email:** support@injazapps.com

---

## ⭐ Rate & Support

Love Owl.md? Help us grow!

1. Tap More Menu (⋮)
2. Select "Rate on Play Store"
3. Leave a 5-star review
4. Share with friends!

---

## 🔒 Privacy & Data

### Your Data is Safe

- ✅ **No data collection** - We never collect your personal info
- ✅ **Offline first** - Works without internet (except GitHub/images)
- ✅ **Local storage** - All files stay on your device
- ✅ **No tracking** - No analytics or tracking
- ✅ **No ads** - Completely ad-free

### What We Access

**Storage Permission:**

- Only to save/load YOUR files
- Only files YOU select
- We never scan your device

**Internet Permission:**

- Only for optional GitHub URL loading
- Only for fetching network images
- Only for in-app announcements
- Never required for core features

---

## 💡 Tips & Tricks

### Productivity Tips

1. **Use Image Button**: Quick access to insert images with custom sizing
2. **Swipe to Preview**: Fast switching with smooth animations
3. **Try All Themes**: Each optimized for different content types
4. **Highlight Key Points**: Use ==highlight syntax== for emphasis
5. **Add TOC**: Use [TOC] marker for automatic table of contents

### Best Practices

1. **Use Metadata**: Add YAML frontmatter for professional title pages
2. **Preview Before PDF**: Ensure everything looks right
3. **Choose Right Theme**: Match theme to document purpose
4. **Structure with Headings**: Use H1-H6 for hierarchy
5. **Optimize Images**: Use appropriate width and alignment
6. **Keep Backups**: Save important files to cloud storage

### Common Use Cases

**📚 Students:**

- Lecture notes with images and formatting
- Study guides with highlights
- Assignment submissions with title pages

**💼 Professionals:**

- Meeting minutes with table of contents
- Project documentation with diagrams
- Technical specifications with code blocks

**✍️ Writers:**

- Draft documents with metadata
- Story outlines with structure
- Research notes with citations

**👨‍💻 Developers:**

- README files with images
- API documentation with code examples
- Tutorials with syntax highlighting

---

## ❓ Troubleshooting

### PDF Won't Generate

**Solution:**

1. Check markdown syntax is valid
2. Try a different theme
3. Ensure enough storage space
4. Check if images are accessible
5. Restart the app

### Images Not Appearing

**Solution:**

1. Verify image URL is HTTPS
2. Check internet connection for network images
3. Ensure image file exists for local paths
4. Check image format (PNG, JPG supported)
5. Look for error in placeholder alt text

### File Won't Load

**Solution:**

1. Check file is `.md` format
2. Verify storage permission granted
3. Try copying file to Downloads
4. Use "Load from GitHub URL" as alternative

### Preview Not Updating

**Solution:**

1. Swipe to refresh
2. Type additional character to trigger update
3. Switch to Editor and back
4. Restart the app

### Animations Stuttering

**Solution:**

1. Close other apps to free memory
2. Reduce document complexity
3. Remove large images
4. Restart device

---

## 🎓 Advanced Features

### Image Positioning

Combine images with text and formatting:

```markdown
# Product Overview

![Logo](logo.png){width=25% align=left}

This text flows around the logo on the right side. Use left alignment for this effect.

---

![Banner](banner.jpg){width=100% align=center}

Full-width centered images work great for banners and diagrams.
```

### Complex Documents

Create professional multi-section documents:

````markdown
---
title: Annual Report 2025
author: John Doe
date: 2025-12-14
version: 1.0.0
---

[TOC]

# Executive Summary

![Chart](revenue-chart.png){width=75% align=center}

Our revenue increased by ==45%== this year!

⚡TIP Check the financial section for details.

# Financial Overview

## Revenue

| Quarter | Revenue | Growth |
|---------|---------|--------|
| Q1 2025 | $1.2M   | +15%   |
| Q2 2025 | $1.5M   | +25%   |

## Code Example

```python
def calculate_growth(current, previous):
    return ((current - previous) / previous) * 100
```

# Conclusion

==Key achievements== this year demonstrate strong performance.
````

### Nested Lists & Complex Hierarchies

```markdown
1. Main Project
   - Frontend Development
     - [ ] Design system
     - [x] Component library
     - [ ] Testing
   - Backend Development
     1. Database schema
     2. API endpoints
        - Authentication
        - Data endpoints
     3. Testing suite
2. Documentation
   - User guide
   - API reference
```

---

## 🚀 What's New

### Version 1.1.47 (Latest)

- ✨ Watermark and logo now 30% opacity (more subtle)
- ✨ Professional slide animations
- ✨ Loading indicators during transitions
- ✨ Emoji variation selectors automatically stripped

### Version 1.1.46

- ✨ Smooth slide animations for panel switching
- ✨ PageView navigation with swipe support
- ✨ Loading overlays during preview rendering

### Version 1.1.45

- ✨ Narrow, faded horizontal rules (1pt, 40% opacity)
- ✨ Minimalist theme uses Ubuntu font (matching PDF)
- ✨ Hierarchical header sizing in all themes

### Version 1.1.44

- ✨ Fixed emoji exclamation mark issue
- ✨ Improved PDF text rendering

### Version 1.1.43

- ✨ Theme-specific header font weights
- ✨ Professional: H1 Light, H2 Regular, H3-H5 Bold
- ✨ Minimalist: Same as Professional
- ✨ Modern & Classic: All bold

### Version 1.1.42

- ✨ Fixed image rendering in PDFs
- ✨ Images now work in mixed content paragraphs

### Version 1.1.37

- ✨ Image insertion with toolbar button
- ✨ Custom width and alignment attributes
- ✨ Device and URL image sources

---

## 📞 Contact & Support

**Email:** support@injazapps.com
**Website:** https://owlmd.injazapps.com
**Privacy Policy:** https://owlmd.injazapps.com/privacy

---

## 📄 About

**Owl.md v1.1.47**
**Updated:** 2025-12-14

Copyright © 2025 InjazApps. All rights reserved.

Built with ❤️ using Flutter. Made for creators, writers, and professionals who love markdown.

### Key Features Summary

✅ Professional PDF generation with 4 themes
✅ Image insertion with custom sizing
✅ Live preview with smooth animations
✅ Table of contents generation
✅ GitHub integration
✅ Offline-first design
✅ No ads, no tracking
✅ Completely free

**Thank you for using Owl.md!** 🦉
