# NutriCheck

## Evidence-Based Nutrition Claim Fact-Checker

NutriCheck is a web application that helps users evaluate nutrition claims using peer-reviewed scientific evidence from PubMed and AI-powered analysis through the Groq API.

Users can enter a nutrition-related claim and receive a verdict (**TRUE**, **MISLEADING**, or **FALSE**) supported by scientific evidence, confidence scoring, and linked PubMed studies.

# Live Deployment

## Live Application
[https://nutricheck-standalone.onrender.com​]

# What the Application Does

1. The user enters a nutrition claim  
   Example:
   > "Eating eggs raises cholesterol"

2. The application searches PubMed for relevant peer-reviewed studies

3. Retrieved abstracts and metadata are analyzed using the Groq-hosted Llama 3 large language model

4. The system returns:
   - A verdict (**TRUE**, **MISLEADING**, or **FALSE**)
   - Evidence strength score
   - Supporting PubMed studies and links

---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript, D3.js |
| Backend | Node.js, Express.js |
| AI Model | Llama 3 70B via Groq API |
| Research Database | PubMed / NCBI Entrez API and curated dataset from social media |
| Hosting | Render |
| Local Storage | Browser localStorage |


# System Architecture

NutriCheck follows a client-server architecture:

- The frontend interface is served using Express.js
- API endpoints process user nutrition claims
- PubMed scientific abstracts are retrieved dynamically from NCBI APIs
- The Groq LLM evaluates scientific evidence and generates verdicts
- Results are returned and visualized on the frontend

# Features

- AI-powered nutrition claim fact-checking
- Peer-reviewed PubMed literature retrieval
- Evidence strength scoring
- Interactive D3.js evidence gauge visualization
- Local search history storage
- Automatic nutrition topic detection
- Scientific paper linking through PubMed

---

# Prerequisites

Before running the project locally, install the following:

- **Node.js v18 or later** (recommended: latest LTS version)
- **npm** (comes bundled with Node.js)
- A free **Groq API key**

---

# Getting a Free Groq API Key

1. Visit:
   https://console.groq.com

2. Create a free account

3. Navigate to:
   **API Keys**

4. Create a new API key and copy it

---

# Running Locally

## Step 1 — Clone the Repository

```bash
git clone <repo-url>
cd nutricheck-main
````

Alternatively, download and unzip the repository manually.

---

## Step 2 — Install Dependencies

```bash
npm install
```

This installs:

* Express.js
* Groq SDK
* dotenv
* all required project dependencies

---

## Step 3 — Create Environment Variables

Create a file named:

```bash
.env
```

inside the root `nutricheck-main` directory.

Add:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

Replace:

```env
your_groq_api_key_here
```

with your actual Groq API key.

> IMPORTANT:
> Never upload your `.env` file or API keys to GitHub.

---

## Step 4 — Start the Server

```bash
npm start
```

Expected terminal output:

```bash
✅ NutriCheck server running at http://localhost:3000
📱 Open your browser and go to http://localhost:3000
```

---

## Step 5 — Open the Application

Visit:

```text
http://localhost:3000
```

The application should now be fully functional locally.

# Deployment

## Recommended Deployment Platform — Render

NutriCheck is structured as a traditional Express.js application and is best deployed using Render.

# Render Deployment Configuration

## Build Command

```bash
npm install
```

## Start Command

```bash
node server.js
```
## Environment Variables

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=10000
```

# Deploying on Render

1. Push the repository to GitHub

2. Create a new Web Service on Render

3. Connect the GitHub repository

4. Configure:

   * Build Command → `npm install`
   * Start Command → `node server.js`

5. Add the required environment variables

6. Deploy the application

# Vercel Deployment Note

Vercel deployment is possible but may require additional serverless routing configuration.

Render is the recommended hosting platform for this project because it better supports Express.js server architecture.


# Project Structure

```text
nutricheck-main/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── d3-gauge.js
│       └── utils.js
│
├── api/
│   ├── analyze.js
│   └── search.js
│
├── data/
│   └── dataset.json
│
├── server.js
├── package.json
├── .env.example
└── README.md
```

# How the Analysis Pipeline Works

## 1. Topic Detection

The claim is analyzed using keyword matching to identify the nutrition topic.

Examples include:

* cholesterol
* fiber
* weight loss
* supplements
* heart health

## 2. PubMed Retrieval

The application performs multiple PubMed query strategies until relevant papers are found.

Data is retrieved using:

* NCBI Entrez Search API
* NCBI Summary API
* NCBI Abstract Fetch API

## 3. Evidence Strength Scoring

Studies are weighted based on evidence quality.

| Study Type                        | Weight |
| --------------------------------- | ------ |
| Systematic Review / Meta-analysis | 10     |
| Randomized Controlled Trial       | 8      |
| Clinical Trial                    | 7      |
| Review                            | 5      |
| Observational Study               | 3      |


## 4. LLM Evidence Analysis

The Groq-hosted Llama 3 model:

* evaluates scientific evidence
* analyzes claim validity
* generates structured JSON verdicts
* assigns confidence levels

## 5. Result Visualization

The frontend displays:

* verdict classification
* confidence level
* evidence gauge
* retrieved scientific papers
* PubMed links

# Verdict Categories

| Verdict    | Meaning                                                     |
| ---------- | ----------------------------------------------------------- |
| TRUE       | Strong scientific evidence supports the claim               |
| MISLEADING | The claim contains partial truth or lacks important context |
| FALSE      | Scientific evidence contradicts the claim                   |

# Example Claims

Try entering:

* "Eating eggs every day raises cholesterol"
* "Greek yogurt helps with weight loss"
* "Lemon water boosts metabolism"
* "Red meat causes heart disease"
* "High-fiber diets reduce colon cancer risk"

---

# Troubleshooting

## `Error: GROQ_API_KEY is not set`

* Ensure the `.env` file exists in the project root
* Verify the variable name is exactly:

  ```env
  GROQ_API_KEY
  ```
* Restart the server after editing `.env`

---

## `Port 3000 already in use`

Change the port inside `.env`:

```env
PORT=3001
```

Then restart the server.

---

## `Application exited early` on Render

Ensure the Render Start Command is:

```bash
node server.js
```

Do NOT use:

```bash
node api/analyze.js
```

because `analyze.js` is only an API route handler and not a standalone server.

---

## Analysis Returns Errors

* Verify your Groq API key is valid
* Check Render logs or terminal logs
* Ensure internet access is available for PubMed requests

---

# Security Considerations

* API keys are stored securely using environment variables
* The frontend never exposes secret credentials
* PubMed data is retrieved directly from official NCBI APIs
* The application does not store personal medical data
* Users should avoid submitting personally identifiable health information

---

# Limitations

* AI-generated analysis may occasionally oversimplify scientific nuance
* PubMed search relevance depends on query quality
* Evidence strength scoring is heuristic-based
* The tool is educational and not a substitute for clinical advice

# Disclaimer

NutriCheck is intended for educational and informational purposes only.

It does not replace professional medical advice, diagnosis, or treatment.

Users should consult qualified healthcare professionals or registered dietitians before making significant dietary or medical decisions.

```
```
