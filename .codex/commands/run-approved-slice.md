# Codex Run Approved Slice

Use this wrapper when Codex starts implementation for one approved FosholHaat slice.

## Required Inputs

- slice name
- approved slice pack path
- current Codex model policy from `AGENTS.md`

## Mandatory Sequence

1. Read the control docs required by `CLAUDE.md` and `AGENTS.md`.
2. Run:
   - `npm run orchestration:skills-ready`
   - `npm run orchestration:generate-ready`
3. Read the active slice pack.
4. Review the slice visual source truth before coding:
   - slice artifact PNG files in `docs/slices/<slice-name>/artifacts/images/`
   - matching approved Stitch PNGs in `docs/stitch/approved-screen-png/`
   - any AI Studio output or readiness brief still referenced by the slice
5. If AI Studio output is active for the slice, read the readiness brief first.
5. Create or refresh:
   - `docs/orchestration/<slice-name>-execution-plan.md`
   - `docs/orchestration/progress/<slice-name>-progress.md`
6. Record:
   - lane ownership
   - skill activation checklist
   - platform scope
   - route ownership
   - visual reference files reviewed
   - copy simplification requirements from the control docs
   - blockers
   - handoff notes
7. Spawn the Codex lead with:
   - model: `gpt-5.4`
   - reasoning: `high`
8. Spawn Codex workers with:
   - model: `gpt-5.4-mini`
   - reasoning: `medium`
9. Use orchestrator-mediated collaboration only:
   - workers update the progress file
   - workers request cross-lane help through the lead
   - the lead relays instructions and reconciles conflicts
10. Before any completion claim, run:
   - `npm run orchestration:preflight`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
11. Validate that:
   - look and feel stayed aligned with the reviewed PNG references
   - copy was simplified only within control-system-approved wording rules
   - low-literacy usability was improved, not degraded
12. Update acceptance evidence in:
   - `docs/orchestration/validation-report-<slice-name>.md`

## Completion Rule

Do not mark a slice complete if:

- the progress file is stale or missing
- lane ownership is unclear
- worker findings were not fanned back through the lead
- reviewed slice PNG references are missing from the progress file
- a required in-scope screen is missing
- a redirect replaced an in-scope screen
- copy drift changed approved meaning or made the flow harder to understand
- required checks were skipped
