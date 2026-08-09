# ClauseGuard — Frontend

The web UI for **ClauseGuard**, an AI-powered contract compliance auditor. Built with Next.js 16 and React 19, it walks the user through a guided 4-step flow — configure your AI provider, upload your policy library, upload a contract, review the flagged clauses — and talks to the [ClauseGuard backend](https://github.com/Danialpro2k04/ClauseGuard_backend) for everything past step 1.

🔗 **Live app:** https://clause-guard-live.vercel.app
⚙️ **Backend repo:** [ClauseGuard_backend](https://github.com/Danialpro2k04/ClauseGuard_backend)
👤 **Built by:** [Danyal Wahdat](https://www.linkedin.com/in/danyal-wahdat-b747a928b/)

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8)

---

## What it does

ClauseGuard's frontend is a session-based wizard, not a dashboard with accounts — there's nothing to sign up for. Each visit is its own isolated audit session:

1. **Configuration** — pick an LLM provider (Groq free tier, OpenAI, or Anthropic) and model, then paste your provider API key and a Cohere embedding key. Keys are held in memory for the session only; nothing is sent anywhere except directly to the backend for that request, and nothing is persisted after a refresh or a new audit.
2. **Policy KB** — drag and drop your company's policy documents (`.pdf`, `.docx`, `.txt`). They're chunked and embedded into a private, session-scoped vector collection on the backend.
3. **Contract Audit** — upload the contract you want checked. The backend runs it through the intake → retrieval → risk-scoring pipeline and returns a structured report.
4. **Review Queue** — every clause flagged `HIGH`, `MEDIUM`, or `UNVERIFIED` shows up with its risk level, the exact clause text, and an LLM-generated justification grounded in your policy documents. Each has a **Resolve** button for the human-in-the-loop step; once everything's resolved, **New Audit** resets the session.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI library | React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + Base UI |
| State management | Zustand (wizard step, session config, in-memory keys) |
| Animation | Framer Motion |
| File uploads | react-dropzone (drag & drop for policies + contract) |
| HTTP client | Axios |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

## Project structure

```
.
├── public/            # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/      # UI components (shadcn/ui-based)
│   └── ...              # Wizard state (Zustand store), API client, types
├── components.json     # shadcn/ui config
├── next.config.ts
└── package.json
```

## Running locally

```bash
git clone https://github.com/Danialpro2k04/ClauseGuard_frontend.git
cd ClauseGuard_frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app needs to know where the backend is running. Check the API client / config in `src/` for the base-URL variable (typically a `NEXT_PUBLIC_*` env var read via `.env.local`) and point it at either your locally-running backend (`uvicorn main:app --reload`, default `http://localhost:8000`) or the deployed FastAPI Cloud instance. No other environment variables or secrets are required — LLM and embedding API keys are entered by the user in the UI at runtime, not baked into the build.

## Design notes

- The whole flow is modeled as a single Zustand store so the 4 steps can read/write shared session state (provider, model, keys, `session_id`, uploaded files, report data) without prop-drilling.
- Drag-and-drop everywhere policy or contract files are needed, via `react-dropzone`, to keep the "upload → wait → review" loop fast on repeated audits.
- No client-side storage of API keys — they live in the Zustand store in memory for the tab's lifetime only, by design, to match the backend's "never persisted" guarantee end to end.

## Known limitations

- No persistent history — closing the tab loses the last audit's results (by design, since nothing is stored server-side either).
- No pagination/virtualization on the review list yet, so a contract that produces a very large number of flagged clauses will render them all at once.
- Error states for backend timeouts (e.g. a long Groq-paced audit) are minimal — worth a dedicated "still working" state for large contracts.

## Roadmap

- [ ] Optional "export report as PDF/CSV" from the Review Queue
- [ ] Persist the last session's report to `sessionStorage` (not the keys) so an accidental refresh doesn't lose results
- [ ] Loading/progress indicator that reflects pipeline stage (intake → retrieval → scoring), not just a spinner

---

Questions, feedback, or found a bug? Open an issue or reach out on [LinkedIn](https://www.linkedin.com/in/danyal-wahdat-b747a928b/).
