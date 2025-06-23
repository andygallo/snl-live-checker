# Supabase Setup Guide

This guide will walk you through creating your Supabase project and configuring it for the SNL Live Checker app.

## Prerequisites ✅

The following have already been completed automatically:
- ✅ Supabase dependencies installed
- ✅ Supabase client configuration created (`src/lib/supabase.ts`)
- ✅ Database types defined (`src/types/database.ts`)
- ✅ Connection test utilities created (`src/lib/test-supabase.ts`)
- ✅ Environment template ready (`.env.local`)

## Manual Steps Required 🚀

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Open your browser and navigate to: https://supabase.com/dashboard
   - Sign in with your existing account or create a new one

2. **Create New Project**
   - Click the **"New Project"** button
   - If prompted, select your organization (or create one)

3. **Configure Project Settings**
   - **Name**: `snl-live-checker` (or `prototype-2`)
   - **Database Password**: Create a strong password and **SAVE IT SECURELY**
     - ⚠️ **Important**: You'll need this password for database administration
     - Consider using a password manager
   - **Region**: Choose the region closest to your users (e.g., US East for North America)
   - **Pricing Plan**: Free tier is fine for development

4. **Create Project**
   - Click **"Create new project"**
   - Wait 2-3 minutes for the project to initialize

### Step 2: Get API Credentials

Once your project is ready:

1. **Navigate to API Settings**
   - In your Supabase dashboard, go to **Settings** → **API**

2. **Copy the Required Credentials**
   - **Project URL**: Copy the URL (starts with `https://`)
   - **anon public key**: Copy the `anon` key (safe for client-side use)
   - **service_role key**: Copy the `service_role` key (keep this secret!)

### Step 3: Update Environment Variables

1. **Open the Environment File**
   - Navigate to your project: `snl-live-checker/.env.local`
   - Open this file in your code editor

2. **Replace Placeholder Values**
   ```env
   # Replace these with your actual Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Save the File**
   - Make sure to save the file after updating the values

### Step 4: Test the Connection

1. **Run the Development Server**
   ```bash
   cd snl-live-checker
   npm run dev
   ```

2. **Test Supabase Connection**
   - Open your browser console (F12)
   - Navigate to: http://localhost:3000
   - In the browser console, run:
   ```javascript
   // Import and run the test
   import('./src/lib/test-supabase.js').then(module => {
     module.runAllSupabaseTests();
   });
   ```

3. **Expected Results**
   - ✅ Connection: PASS (even if profiles table doesn't exist yet)
   - ✅ Authentication: PASS (no active session is normal)
   - ✅ Overall Result: ALL TESTS PASSED

## Troubleshooting 🔧

### Common Issues:

**❌ "Invalid API key"**
- Double-check you copied the correct keys from Settings → API
- Ensure no extra spaces in your `.env.local` file

**❌ "Project not found"**
- Verify the Project URL is correct
- Make sure the project finished initializing (wait a few minutes)

**❌ "Network error"**
- Check your internet connection
- Verify the Supabase project is running (not paused)

### Need Help?
- Check the Supabase documentation: https://supabase.com/docs
- Verify your `.env.local` file has no syntax errors
- Restart your development server after updating environment variables

## Next Steps After Setup ✨

Once Supabase is connected:
1. Create the profiles table (automated in next subtask)
2. Set up Row Level Security (RLS)
3. Implement authentication UI components
4. Test user registration and login

---

**🎯 Ready to proceed?** Once you've completed these manual steps, let me know and we'll test the connection and move to the next subtask! 