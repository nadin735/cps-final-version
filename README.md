# Critical Path Scanner

**Live:** https://projektmanagement.nadin.dev

A project scheduling tool that finds the critical path of a project plan. Import a plan from PDF or enter tasks by hand, and get duration, critical tasks, float, the biggest bottleneck, a confidence forecast and a target date simulator. English, German and Arabic.

## Features

- Portfolio table of all saved projects with status, duration, critical task count and a sparkline. Searchable and sortable.
- Add a project plan from a PDF (read in the browser) or by hand, including dependencies. Detected tasks are reviewed before import.
- Result view: duration, critical tasks, total float and the biggest bottleneck, with a schedule corridor chart.
- Recommendations with a forecast, generated from the computed critical path numbers.
- Confidence forecast: a Monte Carlo simulation over three point task estimates.
- Target date simulator: checks whether an earlier end date is reachable by crashing tasks, and which tasks help.
- CSV export of the full task list: dates, float and critical flag.
- Demo data: "Try with demo data" loads fictional projects without an account.

## Method

Classic critical path method: a forward pass gives earliest start and finish, a backward pass gives latest start and finish. Float is the difference, and tasks with zero float are critical. Dependency cycles are rejected when tasks are edited.

## PDF format

One task per line: name; duration in days; optional dependency.

```
Requirements Workshop; 3;
System Architecture; 5; Requirements Workshop
Backend Development; 10; System Architecture
```

## Tech

React, TypeScript, Vite, Tailwind CSS and pdf.js. There is no backend: everything lives in the browser's local storage under `cps-` keys. The local sign in only separates data per name and is not a security feature.

## Structure

```
src/
  components/   views and dialogs
  utils/        CPM engine, Monte Carlo, crashing, PDF parser, recommendations
public/
```

## Run locally

```bash
npm install
npm run dev
npm run build
```

Built by Nadin Okil.
