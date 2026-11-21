---
paths:
  - "examtopics-practice/**"
---

# Frontend rules

- Never use `dangerouslySetInnerHTML` or `innerHTML` for exam content. Render text, line breaks and images as React elements (see `src/components/QuestionContent.tsx`). Allow only `http:`/`https:` image URLs.
- The access token lives only in memory (`src/contexts/AuthContext.tsx`). Never store it in `localStorage`, `sessionStorage`, cookies or URLs. `localStorage` holds UI preferences only (theme, language, section visibility).
- Every `REACT_APP_*` variable is compiled into the public bundle (`vite.config.mts`). Never put secrets there.
- API calls go through `src/utils/apiClient.ts`, and the backend URL comes from `src/utils/backendUrl.ts`.
- User-facing text goes into all three locale files: `src/locales/translations/{en,ja,vi}.json`.
- TypeScript is strict. `npm run build` runs `tsc --noEmit` before `vite build`, so it must pass.
- Tests use Vitest, jsdom and Testing Library, colocated as `*.test.ts(x)`. Add a test with every behaviour change.
- `public/exams/` and `public/img/` hold large data. Don't rewrite or move them in bulk, and keep exam filenames such as `aws_saa_c03.json`.
- Avoid growing `AdminPage.tsx` (1,300+ lines) and `ExamPage.tsx` further. Put new logic in hooks or utils.
