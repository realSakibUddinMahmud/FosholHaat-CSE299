import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const scanRoots = [
  'apps/web/src',
  'apps/mobile/src',
]

const allowedExtensions = new Set(['.css', '.ts', '.tsx'])
const ignoredDirectories = new Set(['.next', '__tests__', 'test'])
const ignoredFiles = new Set([
  'apps/web/src/styles/tokens.ts',
  'apps/mobile/src/styles/tokens.ts',
  'apps/web/src/app/globals.css',
])

const lineChecks = [
  {
    name: 'hardcoded hex color',
    regex: /#[0-9A-Fa-f]{3,8}\b/g,
  },
  {
    name: 'hardcoded color function',
    regex: /\b(?:rgba?|hsla?)\(/g,
  },
  {
    name: 'inline presentation style prop',
    regex: /style=\{\{.*(?:color|background|boxShadow|borderColor|shadowColor|fill|stroke).*\}\}/g,
  },
  {
    name: 'literal JSX color prop',
    regex: /\bcolor=(["'])(?:#[0-9A-Fa-f]{3,8}|white|black)\1/g,
  },
]

function walk(relativeDir, files) {
  const absoluteDir = path.join(repoRoot, relativeDir)
  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(path.join(relativeDir, entry.name), files)
      }
      continue
    }

    const relativePath = path.join(relativeDir, entry.name)
    if (!allowedExtensions.has(path.extname(entry.name))) {
      continue
    }

    if (ignoredFiles.has(relativePath)) {
      continue
    }

    files.push(relativePath)
  }
}

function scanFile(relativePath) {
  const content = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
  const lines = content.split(/\r?\n/)
  const findings = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    for (const check of lineChecks) {
      check.regex.lastIndex = 0
      if (check.regex.test(line)) {
        findings.push({
          relativePath,
          line: index + 1,
          type: check.name,
          snippet: line.trim(),
        })
      }
    }
  }

  return findings
}

const files = []
for (const root of scanRoots) {
  walk(root, files)
}

const findings = files.flatMap(scanFile)

if (findings.length > 0) {
  console.error('FAIL design token discipline check found literal presentation values:')
  for (const finding of findings) {
    console.error(`- ${finding.relativePath}:${finding.line} ${finding.type}`)
    console.error(`  ${finding.snippet}`)
  }
  process.exit(1)
}

console.log(`OK design token discipline check passed across ${files.length} source files.`)
