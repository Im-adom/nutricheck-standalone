# NutriCheck Setup Guide - Local Development

## ✅ Prerequisites

Before you start, ensure you have:
- **Node.js** v14 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Groq API key** (free, get from https://console.groq.com)

## 🚀 Quick Start (5 minutes)

### Step 1: Get Your Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (or log in)
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (you'll need it in Step 4)

### Step 2: Install Dependencies

```bash
# Navigate to the project directory
cd nutricheck-main

# Install all required packages
npm install
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file and add your Groq API key
# On macOS/Linux:
nano .env

# On Windows:
# Use Notepad or your preferred editor to open .env
```

In the `.env` file, replace `your_groq_api_key_here` with your actual API key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
✅ NutriCheck server running at http://localhost:3000
📱 Open your browser and go to http://localhost:3000
```

### Step 5: Open in Browser

1. Open your browser
2. Go to: `http://localhost:3000`
3. Try analyzing a nutrition claim!

## 📝 Example Claims to Test

Try these claims to verify the system works:

1. **"Greek yogurt is better for weight loss than regular yogurt"**
   - Topic: Weight Loss
   - Expected: Mix of evidence

2. **"Eating fruits after meals obstructs digestion"**
   - Topic: Digestion
   - Expected: Likely FALSE (this is a myth)

3. **"Fiber is beneficial for digestive health"**
   - Topic: Fiber
   - Expected: Likely TRUE (strong evidence)

## 🔧 Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install
```

### Issue: "GROQ_API_KEY is undefined"

**Solution:**
1. Check that `.env` file exists in the project root
2. Verify your API key is correct in `.env`
3. Restart the server (`npm start`)

### Issue: "Port 3000 is already in use"

**Solution - Option A:** Kill the process using port 3000
```bash
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution - Option B:** Use a different port
```bash
# Create/edit .env and add:
PORT=3001

# Then start the server
npm start
```

### Issue: "Request failed to PubMed"

**Possible causes:**
- Network connectivity issue
- PubMed service temporarily down
- Rate limiting (try again in a few seconds)

**Solution:**
- Check your internet connection
- Try again after waiting 30 seconds
- Check PubMed status at https://www.ncbi.nlm.nih.gov/

### Issue: "All claims are coming back as MISLEADING"

This was the original bug! If you're still seeing this:
1. Make sure you're using the FIXED version of the code
2. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
3. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)

## 📱 How It Works

### The Analysis Flow

1. **User Input** → User enters a nutrition claim
2. **PubMed Search** → System searches for relevant research
3. **Paper Retrieval** → Fetches paper metadata and abstracts
4. **LLM Analysis** → Groq LLM analyzes the claim against the papers
5. **Evidence Scoring** → Calculates research quality and quantity
6. **Display Results** → Shows verdict, explanation, and papers

### Data Flow

```
User Claim
    ↓
PubMed API (search)
    ↓
Paper Details (from PubMed)
    ↓
Groq LLM (analyze)
    ↓
Evidence Strength Calculation
    ↓
Result Display (in browser)
```

**Important:** No data is stored on any server. Everything happens in real-time and only during the analysis. After the results are displayed, no information is persisted (except in your browser's localStorage for history).

## 🌐 Accessing Remotely

If you want to access the app from another computer:

1. Find your computer's local IP address:
   ```bash
   # macOS/Linux:
   ipconfig getifaddr en0
   
   # Windows:
   ipconfig
   ```

2. Access from another computer on the same network:
   ```
   http://<YOUR_IP>:3000
   ```

Note: This only works if both computers are on the same network. For public access, deploy to Vercel (see main README).

## 📊 Monitoring the Server

When analyzing claims, you'll see logs in your terminal:
```
Analysis error: [error details]
```

This helps debug issues. If you encounter errors, check:
1. PubMed availability
2. Groq API quota
3. Network connectivity

## 🛑 Stopping the Server

To stop the development server:
```
Press Ctrl+C
```

## ✨ Next Steps

After getting the app running locally:

1. **Test thoroughly** - Try various nutrition claims
2. **Customize** - Modify the UI/UX or add new features
3. **Deploy** - Follow the main README for Vercel deployment
4. **Contribute** - Submit improvements back to the project

## 📞 Need Help?

If you encounter issues:

1. Check this guide first
2. Look at error messages in the terminal
3. Verify your Groq API key is valid
4. Ensure PubMed is accessible from your network
5. Check internet connectivity

---

**Happy fact-checking!** 🥗✅
