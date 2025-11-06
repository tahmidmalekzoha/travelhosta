# Deploying to Vercel

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed (optional, for CLI deployment)

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

   ```bash
   git add .
   git commit -m "Migrate to Vercel"
   git push origin main
   ```

2. **Import Project to Vercel**

   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `travelhosta` repository
   - Configure the following:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`
     - **Node Version**: 20.x

3. **Set Environment Variables**
   Add these in the Vercel dashboard under Project Settings > Environment Variables:

   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (only for server-side)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

   Follow the prompts to configure your project.

4. **Set Environment Variables**

   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

1. **Update Supabase URL Settings**

   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Add your Vercel deployment URL to the "Site URL" and "Redirect URLs"

2. **Test Your Deployment**

   - Visit your Vercel URL
   - Test authentication flows
   - Verify all features work correctly

3. **Custom Domain (Optional)**
   - Go to Vercel Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

## Environment Variables Reference

All environment variables that were set in Netlify need to be configured in Vercel:

| Variable Name                   | Description                                  | Example                     |
| ------------------------------- | -------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                    | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                       | `eyJhbGc...`                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-side only) | `eyJhbGc...`                |

## Differences from Netlify

1. **Build Configuration**: Vercel automatically detects Next.js and optimizes the build
2. **Edge Functions**: Vercel uses Edge Functions instead of Netlify Functions
3. **Incremental Static Regeneration**: Vercel has native ISR support
4. **Analytics**: Vercel Analytics is built-in (optional upgrade)
5. **Previews**: Every push to a branch gets a unique preview URL

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node version is set to 20.x
- Check build logs in Vercel dashboard

### 404 Errors

- Ensure `outputDirectory` is set to `.next`
- Verify the root directory is set to `frontend`

### Environment Variables Not Working

- Make sure they're prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/updating environment variables

## Rollback to Netlify (if needed)

If you need to rollback:

1. Keep the `netlify.toml` file (don't delete it)
2. Re-enable the Netlify site
3. The project will continue to work with both platforms

## Notes

- Vercel provides automatic HTTPS
- Preview deployments are created for every push
- Production deployments happen on pushes to the main branch
- Vercel has excellent Next.js optimization out of the box
