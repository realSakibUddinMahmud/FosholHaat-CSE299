import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const criticalSkills = [
  'fosholhaat-product-context',
  'fosholhaat-flow-mapper',
  'fosholhaat-implementation-guardrails',
  'fosholhaat-feature-delivery',
  'fosholhaat-control-system-governor',
  'fosholhaat-slice-pack-planner',
  'fosholhaat-implementation-readiness-orchestrator',
]

const requiredFiles = [
  'docs/implementation-skill-matrix.md',
  '.claude/commands/run-approved-slice.md',
]

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

let hasFailure = false

console.log('== FosholHaat skill surface readiness ==')

for (const relativePath of requiredFiles) {
  const ok = exists(relativePath)
  console.log(`${ok ? 'OK' : 'MISSING'} artifact ${relativePath}`)
  if (!ok) {
    hasFailure = true
  }
}

for (const skillName of criticalSkills) {
  const canonical = `.agents/skills/${skillName}/SKILL.md`
  const mirror = `.claude/skills/${skillName}/SKILL.md`
  const canonicalOk = exists(canonical)
  const mirrorOk = exists(mirror)

  console.log(`${canonicalOk ? 'OK' : 'MISSING'} canonical ${canonical}`)
  console.log(`${mirrorOk ? 'OK' : 'MISSING'} mirror ${mirror}`)

  if (!canonicalOk || !mirrorOk) {
    hasFailure = true
  }
}

if (hasFailure) {
  console.error(
    'Skill surface readiness failed. Fix missing canonical or mirrored control-critical skills before orchestration starts.',
  )
  process.exit(1)
}

console.log('Skill surface readiness passed.')
