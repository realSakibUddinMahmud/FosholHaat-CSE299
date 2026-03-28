import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const requiredDocs = [
  'CLAUDE.md',
  'docs/mission-and-delivery-principles.md',
  'docs/agent-rules.md',
  'docs/implementation-control-system.md',
  'docs/implementation-transition.md',
  'docs/agent-team-orchestration.md',
  'docs/ambiguity-escalation-policy.md',
  'docs/foundation/agent-handoff-contract.md',
]

const requiredRootScripts = ['tokens:audit', 'lint', 'typecheck', 'test', 'build']
const workspaceArgs = (process.env.ORCHESTRATION_WORKSPACES ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .concat(process.argv.slice(2))
const workspaces = workspaceArgs.length > 0 ? workspaceArgs : ['apps/api', 'apps/web', 'apps/mobile']

function readJson(relativePath) {
  const filePath = path.join(repoRoot, relativePath)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

function getScripts(relativePath) {
  if (!fileExists(relativePath)) {
    return {}
  }

  const json = readJson(relativePath)
  return json.scripts ?? {}
}

let hasFailure = false

console.log('== FosholHaat orchestration preflight ==')

for (const relativePath of requiredDocs) {
  const exists = fileExists(relativePath)
  console.log(`${exists ? 'OK' : 'MISSING'} doc ${relativePath}`)
  if (!exists) {
    hasFailure = true
  }
}

const rootScripts = getScripts('package.json')
for (const scriptName of requiredRootScripts) {
  const exists = typeof rootScripts[scriptName] === 'string'
  console.log(`${exists ? 'OK' : 'MISSING'} root script ${scriptName}`)
  if (!exists) {
    hasFailure = true
  }
}

for (const workspace of workspaces) {
  const packageJsonPath = `${workspace}/package.json`
  if (!fileExists(packageJsonPath)) {
    console.log(`MISSING workspace package ${packageJsonPath}`)
    hasFailure = true
    continue
  }

  const scripts = getScripts(packageJsonPath)
  const available = Object.keys(scripts).sort()
  console.log(`WORKSPACE ${workspace}: ${available.length > 0 ? available.join(', ') : 'no scripts'}`)

  for (const scriptName of ['lint', 'test', 'typecheck', 'build']) {
    const exists = typeof scripts[scriptName] === 'string'
    console.log(`${exists ? 'OK' : 'MISSING'} ${workspace} script ${scriptName}`)
    if (!exists) {
      hasFailure = true
    }
  }
}

if (hasFailure) {
  console.error('Preflight failed. Fix missing docs/scripts before claiming the slice is execution-ready.')
  process.exit(1)
}

console.log('Preflight passed.')
