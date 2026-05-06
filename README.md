# NutriCheck

**Evidence-Based Nutrition Claim Fact-Checker**

NutriCheck is a web application that helps users verify nutrition claims using peer-reviewed research from PubMed and AI analysis via the Groq API. Enter any nutrition claim and receive a verdict (TRUE, MISLEADING, or FALSE) backed by real scientific papers.

---

## What It Does

1. You type a nutrition claim (e.g. *"Eating eggs raises cholesterol"*)
2. The app searches PubMed for relevant peer-reviewed studies
3. An AI model (Llama 3 via Groq) analyses the evidence
4. You receive a verdict with confidence level, evidence strength gauge, and links to the actual papers

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript, D3.js |
| Backend | Node.js, Express.js |
| AI Model | Llama 3 70B via Groq API (free tier) |
| Research Data | PubMed / NCBI Entrez API (no key required) |
| History Storage | Browser localStorage |

---

## Prerequisites

Before running this project, install the following:

- **Node.js v14 or later** — [https://nodejs.org](https://nodejs.org) (download the LTS version)
- **npm** — comes bundled with Node.js automatically
- **A Groq API key** — free, takes ~1 minute to get (see below)

### How to get a free Groq API key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card required)
3. Navigate to **API Keys** in the left sidebar
4. Click **Create API Key**, give it a name, and copy the key

---

## Running Locally (Step-by-Step)

### Step 1 — Download or clone the project

If you have git installed:
```bash
git clone <repo-url>
cd nutricheck-main
```

Or simply unzip the project folder and open a terminal inside the `nutricheck-main` directory.

### Step 2 — Install dependencies

```bash
npm install
```

This installs Express, Groq SDK, dotenv, and other required packages into a `node_modules` folder.

### Step 3 — Create your environment file

In the `nutricheck-main` folder, create a file named `.env` (no extension) with the following content:

```
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Replace `your_groq_api_key_here` with the key you copied from console.groq.com.

> A template file called `.env.example` is included in the project for reference.

### Step 4 — Start the server

```bash
npm start
```

You should see:

```
✅ NutriCheck server running at http://localhost:3000
📱 Open your browser and go to http://localhost:3000
```

### Step 5 — Open the app

Open your browser and go to:

```
http://localhost:3000
```

The app is now fully running locally. No internet deployment is needed to test it — only the PubMed API calls and Groq API calls go outward.

---

## Project Structure

```
nutricheck-main/
├── public/
│   ├── index.html          # Main UI
│   ├── css/
│   │   └── style.css       # All styling
│   └── js/
│       ├── app.js          # Frontend logic (fetch, display, history)
│       ├── d3-gauge.js     # Evidence strength gauge chart
│       └── utils.js        # Shared utilities
├── api/
│   ├── analyze.js          # Core logic: PubMed search + Groq LLM analysis
│   └── search.js           # PubMed search endpoint
├── data/
│   └── dataset.json        # Sample claims dataset
├── server.js               # Express server (entry point for local run)
├── package.json
├── .env.example            # Template for environment variables
└── vercel.json             # Config for optional Vercel deployment
```

---

## How the Analysis Works

1. **Topic detection** — the claim is matched against keywords to identify the nutritional topic (e.g. protein, heart health, weight loss)
2. **PubMed search** — up to 5 query strategies are tried in sequence until papers are found; searches the NCBI database of 35+ million biomedical articles
3. **Evidence scoring** — papers are weighted by study type:
   - Systematic Review / Meta-analysis → highest weight (10)
   - Randomised Controlled Trial (RCT) → weight 8
   - Clinical Trial → weight 7
   - Review → weight 5
   - Observational Study → weight 3
4. **LLM analysis** — Groq runs Llama 3 70B to evaluate the claim against the retrieved abstracts and returns a structured JSON verdict
5. **Result display** — verdict, confidence, evidence gauge, and paper links are rendered in the UI

---

## Verdicts Explained

| Verdict | Meaning |
|---|---|
| **TRUE** | The claim is factually accurate and well-supported by scientific evidence |
| **MISLEADING** | The claim has partial truth but is oversimplified, exaggerated, or missing important context |
| **FALSE** | The claim is directly contradicted by scientific evidence |

Confidence levels: **HIGH**, **MEDIUM**, or **LOW** — based on the quantity and quality of papers found.

---

## Example Claims to Try

- "Greek yogurt is better for weight loss than regular yogurt"
- "Eating eggs every day raises your cholesterol"
- "High-fiber diets reduce the risk of colon cancer"
- "Drinking lemon water in the morning boosts your metabolism"
- "Red meat causes heart disease"

---

## Troubleshooting

**`Error: GROQ_API_KEY is not set`**
- Make sure your `.env` file exists in the `nutricheck-main` folder (not inside any subfolder)
- Check that the key is pasted correctly with no spaces around the `=`

**`npm install` fails**
- Ensure Node.js v14+ is installed: run `node --version` to check
- Try deleting the `node_modules` folder and running `npm install` again

**Port 3000 already in use**
- Change `PORT=3001` in your `.env` file and restart

**Analysis always returns an error**
- Check your terminal for the error message — it will show the exact Groq API error
- Verify your API key is valid by logging in to console.groq.com

---

## Disclaimer

NutriCheck is an educational tool for informational purposes only. It does not replace professional medical or dietary advice. Always consult a registered dietitian or healthcare provider for personalised nutrition guidance.

