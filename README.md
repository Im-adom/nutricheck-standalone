# NutriCheck 🥗

**Evidence-Based Nutrition Fact Checker with LLM Intelligence & Interactive Visualization**

NutriCheck is a sophisticated web application that combats nutritional misinformation by analyzing nutrition claims against peer-reviewed research from PubMed. Using advanced LLM technology and D3.js visualizations, it provides users with evidence-based verdicts, detailed research citations, and transparent explanations of the scientific foundation behind each analysis.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Dataset](#dataset)
- [Visualization Guide](#visualization-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## 🎯 Overview

Nutritional misinformation spreads rapidly on social media platforms like Instagram, often leading users to make uninformed dietary decisions. NutriCheck addresses this critical problem by:

1. **Accepting user-submitted nutrition claims** (e.g., "Greek yogurt is better for weight loss than regular yogurt")
2. **Searching peer-reviewed literature** via PubMed's live API
3. **Analyzing findings with AI** (Groq LLM - free tier)
4. **Generating friendly, evidence-based verdicts** (TRUE, MISLEADING, or FALSE)
5. **Visualizing evidence strength** with D3.js gauges showing research composition
6. **Providing clickable links** to original research papers

**Goal:** Help users understand nutritional claims through a transparent, scientific lens without operating as a "black box."

---

## ✨ Features

### Core Features

✅ **Claim Analysis Engine**
- Accepts free-form nutrition claims from users
- Auto-detects claim topic (weight loss, heart health, digestion, kidney health, skin health, etc.)
- Real-time PubMed search for relevant peer-reviewed studies

✅ **Evidence-Based Verdicts**
- **TRUE**: Claim is supported by peer-reviewed research
- **MISLEADING**: Claim contains half-truths or lacks important context
- **FALSE**: Claim is contradicted by current scientific evidence
- **INSUFFICIENT_DATA**: Not enough research found

✅ **Confidence Scoring**
- HIGH: Strong consensus across multiple high-quality studies
- MEDIUM: Some supporting evidence but with limitations
- LOW: Limited research or contradictory findings

✅ **Interactive D3.js Visualization**
- Evidence Strength Gauge (Weak → Moderate → Strong with color coding)
- Study Type Breakdown:
  - 🔴 Systematic Reviews/Meta-analyses (highest weight)
  - 🟠 Randomized Controlled Trials (RCTs)
  - 🟡 Clinical Trials
  - 🟢 Observational Studies
  - ⚪ Other research types
- Evidence Quality Score (0-100%)

✅ **Research Transparency**
- Direct links to PubMed papers
- Study type classification
- Author names and publication dates
- Abstract previews
- Complete paper URLs for deeper investigation

✅ **Local History Tracking**
- Browser-based localStorage
- Quick access to previous analyses
- One-click reanalysis of past claims
- Clear history option

✅ **Example Claims**
- Pre-loaded examples for user testing
- Quick demonstration of tool functionality
- Categories: Digestion, Fiber, Weight Loss

✅ **Professional UI/UX**
- Split-screen layout (input on left, analysis on right)
- Responsive design (desktop, tablet, mobile)
- Loading states with progress indicators
- Toast notifications
- Smooth animations and transitions
- Accessible color contrast and typography

---

## 🔗 Live Demo

**[NutriCheck Live](https://nutricheck-git-main-grace-amaning-kwartengs-projects.vercel.app/)**

*Note: First load may take a few seconds as Vercel serverless functions initialize*

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS variables, gradients, animations
- **JavaScript (Vanilla)** - No frameworks for lightweight deployment
- **D3.js v7.9.0** - Interactive data visualization (evidence gauges, breakdowns)

### Backend
- **Node.js** - Runtime environment
- **Vercel Serverless Functions** - Scalable API endpoints (no server to manage)
- **Express.js** - HTTP server (optional for local development)

### AI/ML
- **Groq API** - Free LLM service (mixtral-8x7b-32768 model)
  - Medical reasoning & chain-of-thought
  - Fast inference (perfect for real-time analysis)
  - No rate limits (beta tier)
- **HuggingFace Inference API** - Backup LLM (30k tokens/month free)

### Data Sources
- **PubMed API** - Free, government-provided
  - 35+ million biomedical articles
  - No API key required (respects rate limits)
  - Search by keywords, study type, date range
- **NCBI Entrez Utilities** - Direct paper metadata access

### Database
- **localStorage** - Client-side history storage (no backend database needed)
- Optional: SQLite for production-level history tracking

### Deployment
- **GitHub** - Version control & collaboration
- **Vercel** - Full-stack deployment (frontend + serverless backend)
- **Free tier** - Adequate for educational/demonstration use

---

## 📦 Installation

### Prerequisites
- Git
- Node.js (v14+)
- npm or yarn
- GitHub account
- Vercel account (free)
- Groq API key (free, get from https://console.groq.com)

### Step 1: Clone Repository

```bash
git clone https://github.com/Im-adom/nutricheck.git
cd nutricheck
