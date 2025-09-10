# Vercel Environment Variables Setup

## Required Environment Variables

Add these to your Vercel project environment variables:

### Production Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://ifcjvulukaqoqnolgajb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k
```

## How to Add in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project: `port-san-antonio`
3. Go to Settings → Environment Variables
4. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://ifcjvulukaqoqnolgajb.supabase.co`
   - Environment: Production, Preview, Development
   
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k`
   - Environment: Production, Preview, Development

5. Save and redeploy

## Alternative: CLI Method
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variables via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: https://ifcjvulukaqoqnolgajb.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k
```

After adding the environment variables, trigger a new deployment by pushing a commit or manually redeploy in the Vercel dashboard.
