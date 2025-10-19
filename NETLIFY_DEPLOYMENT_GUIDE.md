# TravelHosta - Netlify Deployment Guide

Complete guide to deploy your Next.js application to Netlify.

---

## 🚀 Quick Deployment (Recommended Method)

### Step 1: Push to GitHub

Ensure your code is pushed to GitHub:

```powershell
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### Step 2: Connect to Netlify

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Sign in with your GitHub account
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **"GitHub"** and authorize Netlify
5. Select your repository: **`tahmidmalekzoha/travelhosta`**

### Step 3: Configure Build Settings

Enter these exact settings:

| Setting               | Value            |
| --------------------- | ---------------- |
| **Base directory**    | `frontend`       |
| **Build command**     | `npm run build`  |
| **Publish directory** | `frontend/.next` |

### Step 4: Environment Variables

Click **"Add environment variables"** and add these:

| Variable Name                   | Value                                      |
| ------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://icimdqlnkndmdhdoicsm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key                     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your Supabase service role key (optional)  |
| `NODE_VERSION`                  | `20`                                       |

**⚠️ Important:** Get your Supabase keys from:

- Supabase Dashboard → Settings → API
- URL: [https://app.supabase.com/project/icimdqlnkndmdhdoicsm/settings/api](https://app.supabase.com/project/icimdqlnkndmdhdoicsm/settings/api)

### Step 5: Deploy

Click **"Deploy site"** and wait for the build to complete (2-5 minutes).

Your site will be live at: `https://your-site-name.netlify.app`

---

## 🔧 Alternative: Deploy via Netlify CLI

### 1. Install Netlify CLI

```powershell
npm install -g netlify-cli
```

### 2. Login to Netlify

```powershell
netlify login
```

### 3. Initialize Netlify in Your Project

```powershell
cd d:\TravelHosta\Website
netlify init
```

Follow the prompts:

- **Create & configure a new site**
- **Team**: Choose your team
- **Site name**: Enter a unique name (or leave blank for random)
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`

### 4. Add Environment Variables

```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://icimdqlnkndmdhdoicsm.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set NODE_VERSION "20"
```

### 5. Deploy

```powershell
netlify deploy --prod
```

---

## 📝 Configuration Files

### netlify.toml (Already Created)

The `netlify.toml` file at the root of your project configures:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20
- Redirect rules for Next.js routing
- Security headers

---

## ✅ Post-Deployment Checklist

After deployment, verify these:

- [ ] Homepage loads correctly
- [ ] Admin panel accessible at `/admin`
- [ ] Sign in works at `/signin`
- [ ] Guides page displays at `/guides`
- [ ] Images load properly
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Supabase connection works

---

## 🔒 Security Considerations

### Update next.config.js

You need to add your Netlify domain to allowed image domains:

1. Open `frontend/next.config.js`
2. Update the domains array:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "your-site-name.netlify.app", // Add your Netlify domain
      "icimdqlnkndmdhdoicsm.supabase.co", // Add Supabase storage domain
    ],
  },
};

module.exports = nextConfig;
```

### Update Supabase Allowed Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL to **Site URL** and **Redirect URLs**:
   - `https://your-site-name.netlify.app`
   - `https://your-site-name.netlify.app/signin`
   - `https://your-site-name.netlify.app/admin`

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** "Module not found" or dependency errors

**Solution:**

```powershell
cd frontend
rm -rf node_modules package-lock.json
npm install
```

Then redeploy.

### Environment Variables Not Working

**Issue:** Supabase connection fails

**Solution:**

- Verify all environment variables are set in Netlify dashboard
- Variable names must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables

### Images Not Loading

**Issue:** Images show as broken

**Solution:**

1. Check `next.config.js` includes your domain in `images.domains`
2. Verify image URLs are correct
3. Check Netlify build logs for image optimization errors

### 404 on Page Refresh

**Issue:** Direct URLs return 404

**Solution:**
The `netlify.toml` file includes redirect rules. If still having issues:

1. Check `netlify.toml` is at project root
2. Verify redirect rules are correct
3. Redeploy the site

### Admin Routes Not Protected

**Issue:** Anyone can access `/admin`

**Solution:**

- This is expected in development
- For production, implement proper authentication
- Consider using middleware to protect routes
- Add server-side auth checks

---

## 🌟 Custom Domain (Optional)

### Add Your Own Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

### Enable HTTPS

Netlify automatically provisions SSL certificates via Let's Encrypt.

- It's free and automatic
- Usually takes a few minutes after domain verification

---

## 📊 Monitoring & Analytics

### Netlify Analytics

Enable in Netlify dashboard:

- Site overview → Analytics
- See page views, bandwidth, forms submissions
- Monitor build performance

### Add Error Tracking

Consider integrating:

- Sentry for error tracking
- Google Analytics for user analytics
- Vercel Analytics (if migrating to Vercel later)

---

## 🔄 Continuous Deployment

Once connected, Netlify automatically:

- ✅ Builds on every push to `main` branch
- ✅ Creates deploy previews for pull requests
- ✅ Rolls back to previous deploys if needed
- ✅ Invalidates cache automatically

### Disable Auto Deploy (Optional)

If you want manual deploys:

1. Site settings → Build & deploy
2. Stop builds
3. Deploy manually via CLI or dashboard

---

## 💡 Performance Optimization

### Before Deploying

1. **Optimize Images**

   ```powershell
   # Use Next.js Image component everywhere
   import Image from 'next/image'
   ```

2. **Enable Caching**

   - Already configured in `netlify.toml`

3. **Minimize Bundle Size**
   ```powershell
   cd frontend
   npm run build
   # Check build output for large files
   ```

### After Deploying

1. Run Lighthouse audit
2. Check Core Web Vitals
3. Monitor Netlify analytics

---

## 🎯 Next Steps After Deployment

1. **Custom Domain**: Add your domain (optional)
2. **SSL**: Verify HTTPS is working
3. **SEO**: Add meta tags and sitemap
4. **Monitoring**: Set up error tracking
5. **Testing**: Test all features on production
6. **Backup**: Regular backups of Supabase data

---

## 📞 Need Help?

- **Netlify Docs**: [https://docs.netlify.com/](https://docs.netlify.com/)
- **Next.js on Netlify**: [https://docs.netlify.com/integrations/frameworks/next-js/](https://docs.netlify.com/integrations/frameworks/next-js/)
- **Netlify Support**: [https://www.netlify.com/support/](https://www.netlify.com/support/)

---

## ✅ Quick Checklist

Before you deploy, make sure you have:

- [x] `netlify.toml` file at project root
- [ ] Code pushed to GitHub
- [ ] Supabase keys ready
- [ ] Environment variables prepared
- [ ] Build command tested locally (`npm run build`)
- [ ] All features working in development

**You're ready to deploy! 🚀**

---

**Last Updated:** October 19, 2025  
**Deployment Status:** Ready for Production
