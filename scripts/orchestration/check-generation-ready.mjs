import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const requiredDocs = [
  'CLAUDE.md',
  'docs/master-spec.md',
  'docs/mission-and-delivery-principles.md',
  'docs/mvp-scope.md',
  'docs/architecture.md',
  'docs/design-system.md',
  'docs/agent-rules.md',
  'docs/implementation-control-system.md',
  'docs/implementation-transition.md',
  'docs/agent-team-orchestration.md',
  'docs/ambiguity-escalation-policy.md',
  'docs/foundation/agent-handoff-contract.md',
  'docs/orchestration/agent-orchestration-runbook.md',
  'docs/orchestration/code-reset-note.md',
]

const requiredControlFiles = [
  '.claude/agents/fosholhaat-orchestrator.md',
  '.claude/agents/fosholhaat-implementer.md',
  '.claude/agents/fosholhaat-validator.md',
  '.claude/commands/run-approved-slice.md',
  'scripts/orchestration/preflight-check.mjs',
  'scripts/orchestration/check-generation-ready.mjs',
]

const requiredAppScaffold = [
  'apps/api/package.json',
  'apps/api/README.md',
  'apps/web/package.json',
  'apps/web/README.md',
  'apps/mobile/package.json',
  'apps/mobile/README.md',
]

function fileExists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

let hasFailure = false

console.log('== FosholHaat generation readiness ==')

for (const relativePath of requiredDocs) {
  const exists = fileExists(relativePath)
  console.log(`${exists ? 'OK' : 'MISSING'} doc ${relativePath}`)
  if (!exists) {
    hasFailure = true
  }
}

for (const relativePath of requiredControlFiles) {
  const exists = fileExists(relativePath)
  console.log(`${exists ? 'OK' : 'MISSING'} control ${relativePath}`)
  if (!exists) {
    hasFailure = true
  }
}

for (const relativePath of requiredAppScaffold) {
  const exists = fileExists(relativePath)
  console.log(`${exists ? 'OK' : 'MISSING'} scaffold ${relativePath}`)
  if (!exists) {
    hasFailure = true
  }
}

if (hasFailure) {
  console.error('Generation readiness failed. Fix missing control or scaffold artifacts before fresh code generation.')
  process.exit(1)
}

console.log('Generation readiness passed.')
console.log('Note: this command validates the pre-generation control state. It does not replace post-generation lint/typecheck/test/build.')
