# FitScore — AI Resume ↔ Job Description Match Checker

FitScore is a professional, corporate-styled, production-ready web application designed to help job seekers and recruiters check the compatibility between a resume and a job description. Built with Next.js 14/15, TypeScript, and Tailwind CSS, FitScore provides instant matching feedback without any server round-trips, highlighting matched and missing skills based on a curated taxonomy and weighted term frequency analysis. For deep analysis, users can request tailored AI resume suggestions via Google's Gemini API with a single click.

---

## How It Works

FitScore operates with a blended matching engine designed to work instantly at $0 cost:

1. **Text Preprocessing**: Lowercases text, strips stopwords (including standard English and resume noise words like "experience", "duties", etc.), removes punctuation, and tokenizes both the resume and job description into words and bigrams.
2. **Skills Taxonomy Matching (60% weight)**: Compares the job description against a curated database of ~200 common professional and tech terms (across languages, libraries, databases, DevOps, tools, and soft skills). It flags which skills are present or missing from the resume. Missing skills are ranked by their frequency in the job description.
3. **Weighted Lexical Overlap (40% weight)**: Evaluates the occurrence and term frequency of non-stopword tokens in the job description against the resume text. This catches industry-specific or company-specific keywords outside our static taxonomy.
4. **Final Scoring**: Blends the taxonomy score and lexical overlap score to calculate a deterministic fit score (0–100%).

---

## Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation Steps

1. **Clone the repository and navigate into the folder:**
   ```bash
   git clone <your-repository-url>
   cd FitScore
   ```

2. **Install package dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/apikey).
   - Add your key to the `.env.local` file:
     ```env
     GEMINI_API_KEY=your_actual_free_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Vercel Deployment

FitScore is optimized for a $0 budget and deploys seamlessly on **Vercel's free Hobby plan**.

### Step-by-Step Deployment

1. **Push your code to a public GitHub repository.**
2. **Deploy to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** → **Project**.
   - Import your GitHub repository.
   - Under **Environment Variables**, add:
     - `GEMINI_API_KEY` = `<your-gemini-api-key>`
   - Click **Deploy**.

> [!IMPORTANT]
> **API Key Terms & Google Cloud Billing**:
> Ensure that billing **is NOT enabled** on the Google Cloud project tied to your Gemini API key. Enabling billing will transition the project away from the Gemini free tier, which could result in usage charges. Keeping billing disabled guarantees $0 spend forever.

---

## Technologies Used

- **Framework**: Next.js App Router (TypeScript)
- **Styling**: Tailwind CSS
- **Document Parsing**: `pdf-parse` (PDF parsing), `mammoth` (DOCX parsing)
- **AI Engine**: `@google/generative-ai` (Gemini API integration using `gemini-2.5-flash`)
- **Icons**: `lucide-react`
