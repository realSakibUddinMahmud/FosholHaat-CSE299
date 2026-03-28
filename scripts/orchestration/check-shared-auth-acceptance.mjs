import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const requiredFiles = [
  'docs/slices/shared-auth/spec.md',
  'docs/slices/shared-auth/api-contract.md',
  'docs/slices/shared-auth/ui-contract.md',
  'docs/slices/shared-auth/test-plan.md',
  'docs/slices/shared-auth/screen-map.md',
  'docs/orchestration/shared-auth-execution-plan.md',
  'docs/orchestration/validation-report-shared-auth.md',
  '.claude/agents/fosholhaat-orchestrator.md',
  '.claude/agents/fosholhaat-validator.md',
  'docs/orchestration/agent-orchestration-runbook.md',
  'apps/web/src/components/workspace-shell.tsx',
  'apps/web/src/components/auth-card.tsx',
  'apps/web/src/components/language-switch.tsx',
  'apps/web/src/app/welcome/page.tsx',
  'apps/web/src/app/language/page.tsx',
  'apps/web/src/app/login/page.tsx',
  'apps/web/src/app/signup/role/page.tsx',
  'apps/api/src/auth/auth.controller.ts',
  'apps/api/src/main.ts',
  'apps/mobile/App.tsx',
  'apps/mobile/index.ts',
]

const webDesignFiles = [
  'apps/web/src/components/workspace-shell.tsx',
  'apps/web/src/components/auth-card.tsx',
  'apps/web/src/components/language-switch.tsx',
  'apps/web/src/app/welcome/page.tsx',
  'apps/web/src/app/language/page.tsx',
  'apps/web/src/app/login/page.tsx',
  'apps/web/src/app/signup/role/page.tsx',
]

const mobileAuthFiles = [
  'apps/mobile/src/app/welcome/index.tsx',
  'apps/mobile/src/app/language/index.tsx',
  'apps/mobile/src/app/login/index.tsx',
  'apps/mobile/src/app/signup/role/index.tsx',
]

const relatedTestFiles = [
  'apps/web/src/auth.spec.ts',
  'apps/api/src/auth.spec.ts',
  'apps/mobile/__tests__/App.test.tsx',
]

const webCssModuleFiles = [
  'apps/web/src/components/workspace-shell.module.css',
  'apps/web/src/components/auth-card.module.css',
  'apps/web/src/components/language-switch.module.css',
  'apps/web/src/app/welcome/welcome.module.css',
  'apps/web/src/app/language/language.module.css',
  'apps/web/src/app/login/login.module.css',
  'apps/web/src/app/signup/role/signup-role.module.css',
]

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath))
}

function fail(message) {
  console.error(`FAIL ${message}`)
  hasFailure = true
}

let hasFailure = false

console.log('== Shared-auth acceptance check ==')

for (const relativePath of requiredFiles) {
  if (!exists(relativePath)) {
    fail(`missing required file ${relativePath}`)
  } else {
    console.log(`OK file ${relativePath}`)
  }
}

const rootPackageJson = JSON.parse(read('package.json'))
for (const scriptName of ['orchestration:preflight', 'orchestration:shared-auth:acceptance', 'tokens:audit', 'lint', 'typecheck', 'test', 'build']) {
  if (!rootPackageJson.scripts?.[scriptName]) {
    fail(`missing root script ${scriptName}`)
  } else {
    console.log(`OK root script ${scriptName}`)
  }
}

const welcomePage = read('apps/web/src/app/welcome/page.tsx')
if (welcomePage.includes('redirect(') || welcomePage.includes('permanentRedirect(')) {
  fail('web welcome page uses redirect-based replacement')
} else {
  console.log('OK web welcome page is not redirect-based')
}

for (const relativePath of webDesignFiles) {
  const content = read(relativePath)
  if (/#(?:[0-9a-fA-F]{3}){1,2}\b/.test(content)) {
    fail(`web design file uses hardcoded hex colors instead of token-driven styling: ${relativePath}`)
  }
  if (content.includes('style={{') || content.includes(' style={')) {
    fail(`web design file still uses React style props instead of shared tokenized styling primitives: ${relativePath}`)
  }
  if (content.includes(".split(' ')") || content.includes('.split(" ")')) {
    fail(`web design file uses token parsing hacks instead of explicit token values: ${relativePath}`)
  }
}

const loginPage = read('apps/web/src/app/login/page.tsx')
if (loginPage.includes('setTimeout(')) {
  fail('login page uses simulated timeout behavior instead of real auth flow')
}

const webLayoutExists = exists('apps/web/src/app/layout.tsx')
if (!webLayoutExists) {
  fail('web app is missing app/layout.tsx, so global token CSS and root app structure cannot be guaranteed')
}

const webLayout = webLayoutExists ? read('apps/web/src/app/layout.tsx') : ''
const webGlobalsExists = exists('apps/web/src/app/globals.css')
const webGlobals = webGlobalsExists ? read('apps/web/src/app/globals.css') : ''
const webTokenCss = exists('packages/tokens/web.css') ? read('packages/tokens/web.css') : ''
const importedGlobalCss = webLayout.includes('globals.css') || webLayout.includes('packages/tokens/web.css') || webLayout.includes('web.css')
if (webLayoutExists && !importedGlobalCss) {
  fail('web app layout does not import any global CSS token source')
}

let webDefinesExpectedCssVars = false
const globalCssSources = `${webGlobals}\n${webTokenCss}`
if (globalCssSources.includes('--color-canvas:') || globalCssSources.includes('--brand-primary:')) {
  webDefinesExpectedCssVars = true
}
if (globalCssSources.includes('--fh-color-canvas:') && globalCssSources.includes('--color-canvas:')) {
  webDefinesExpectedCssVars = true
}

for (const relativePath of webCssModuleFiles) {
  if (!exists(relativePath)) {
    continue
  }
  const content = read(relativePath)
  if ((content.includes('var(--color-') || content.includes('var(--brand-') || content.includes('var(--spacing-') || content.includes('var(--radius-') || content.includes('var(--shadow-')) && !webDefinesExpectedCssVars) {
    fail(`web CSS module consumes custom properties that are never defined globally: ${relativePath}`)
  }
}

for (const requiredImport of ['WorkspaceShell', 'AuthCard']) {
  if (!welcomePage.includes(requiredImport)) {
    fail(`welcome page does not use required shared module ${requiredImport}`)
  }
}

const languagePage = read('apps/web/src/app/language/page.tsx')
if (!languagePage.includes('LanguageSwitch')) {
  fail('language page does not use required shared module LanguageSwitch')
}
if (!languagePage.includes('/auth/locale') && !languagePage.includes('localStorage') && !languagePage.includes('setLocale') && !languagePage.includes('router.push(') && !languagePage.includes('<Link')) {
  fail('web language page does not persist locale or navigate anywhere after selection')
}

const mobileLanguagePage = exists('apps/mobile/src/app/language/index.tsx')
  ? read('apps/mobile/src/app/language/index.tsx')
  : ''
if (mobileLanguagePage && !mobileLanguagePage.includes('/auth/locale') && !mobileLanguagePage.includes('AsyncStorage') && !mobileLanguagePage.includes('SecureStore') && !mobileLanguagePage.includes('locale')) {
  fail('mobile language page does not persist locale or call the locale endpoint')
}

if (loginPage.includes("locale: 'en'") || loginPage.includes('locale: "en"')) {
  fail('web login still hardcodes locale instead of consuming the selected language')
}

if (loginPage.includes("window.location.href = '/buyer'") || loginPage.includes('window.location.href = "/buyer"')) {
  fail('login page hardcodes buyer-only success routing instead of role-aware navigation')
}

const nextConfigPath = exists('apps/web/next.config.ts')
  ? 'apps/web/next.config.ts'
  : exists('apps/web/next.config.mjs')
    ? 'apps/web/next.config.mjs'
    : null
const nextConfig = nextConfigPath ? read(nextConfigPath) : ''
const hasWebProxyRoute =
  exists('apps/web/src/app/api/auth/login/route.ts') ||
  exists('apps/web/src/app/api/auth/login/route.js')
const hasRewriteToBackend = nextConfig.includes('rewrites') && nextConfig.includes('/api/auth')
if (loginPage.includes("fetch('/api/auth/login'") && !hasWebProxyRoute && !hasRewriteToBackend) {
  fail('web login calls /api/auth/login but no Next.js route or rewrite exists to reach the Nest backend')
}

const executionPlan = read('docs/orchestration/shared-auth-execution-plan.md')
for (const routeText of ['/welcome', '/language', '/login', '/signup/role']) {
  if (!executionPlan.includes(routeText)) {
    fail(`execution plan does not mention ${routeText}`)
  }
}
for (const laneText of ['Backend Teammate', 'Web Teammate', 'Mobile Teammate']) {
  if (!executionPlan.includes(laneText)) {
    fail(`execution plan does not include delegation lane ${laneText}`)
  }
}

const validationReport = read('docs/orchestration/validation-report-shared-auth.md')
for (const requiredLine of [
  '**Lint:** `npm run lint` passed.',
  '**Typecheck:** `npm run typecheck` passed.',
  '**Tests:** `npm run test` passed.',
  '**Build:** `npm run build` passed.',
]) {
  if (!validationReport.includes(requiredLine)) {
    fail(`validation report missing line: ${requiredLine}`)
  }
}
for (const requiredLine of [
  '**Generation Ready:** `npm run orchestration:generate-ready` passed.',
  '**Preflight:** `npm run orchestration:preflight` passed.',
  '**Acceptance:** `npm run orchestration:shared-auth:acceptance` passed.',
]) {
  if (!validationReport.includes(requiredLine)) {
    fail(`validation report missing line: ${requiredLine}`)
  }
}

const mobilePackageJson = JSON.parse(read('apps/mobile/package.json'))
for (const scriptName of ['lint', 'test', 'typecheck', 'build']) {
  if (!mobilePackageJson.scripts?.[scriptName]) {
    fail(`missing mobile script ${scriptName}`)
  } else {
    console.log(`OK mobile script ${scriptName}`)
  }
}

const runbook = read('docs/orchestration/agent-orchestration-runbook.md')
for (const requiredPhrase of [
  'orchestration:preflight',
  'orchestration:shared-auth:acceptance',
  'No slice may be declared complete',
  'No false green',
]) {
  if (!runbook.includes(requiredPhrase)) {
    fail(`runbook missing phrase: ${requiredPhrase}`)
  }
}

const orchestrator = read('.claude/agents/fosholhaat-orchestrator.md')
if (!orchestrator.includes('orchestration:preflight') || !orchestrator.includes('orchestration:shared-auth:acceptance')) {
  fail('orchestrator agent does not require scripted preflight and acceptance checks')
}
if (!orchestrator.includes('MUST use sub-agents')) {
  fail('orchestrator agent does not require visible sub-agent delegation for multi-lane slices')
}

const validator = read('.claude/agents/fosholhaat-validator.md')
if (!validator.includes('orchestration:preflight')) {
  fail('validator agent does not mention scripted preflight')
}

const apiController = read('apps/api/src/auth/auth.controller.ts')
for (const requiredSnippet of ["@Controller('auth')", "@Post('login')", "@Post('locale')", "@Post('role-selection')"]) {
  if (!apiController.includes(requiredSnippet)) {
    fail(`auth controller missing required NestJS endpoint declaration: ${requiredSnippet}`)
  }
}

const apiMain = read('apps/api/src/main.ts')
for (const requiredSnippet of ['NestFactory', 'AppModule']) {
  if (!apiMain.includes(requiredSnippet)) {
    fail(`api main file missing required Nest bootstrap snippet: ${requiredSnippet}`)
  }
}

for (const relativePath of relatedTestFiles) {
  if (!exists(relativePath)) {
    fail(`missing related test file ${relativePath}`)
    continue
  }
  const content = read(relativePath)
  if (content.includes('expect(true).toBe(true)')) {
    fail(`placeholder test detected in ${relativePath}`)
  }
}

for (const relativePath of mobileAuthFiles) {
  if (!exists(relativePath)) {
    fail(`missing mobile auth file ${relativePath}`)
    continue
  }
  const content = read(relativePath)
  if (content.includes('setTimeout(')) {
    fail(`mobile auth file uses simulated timeout behavior instead of real flow: ${relativePath}`)
  }
}

const mobileLogin = read('apps/mobile/src/app/login/index.tsx')
if (mobileLogin.includes("locale: 'en'") || mobileLogin.includes('locale: "en"')) {
  fail('mobile login still hardcodes locale instead of consuming the selected language')
}
if (mobileLogin.includes("router.push('/')") || mobileLogin.includes('router.push("/")')) {
  fail('mobile login routes to root instead of a role-aware success path')
}

const authService = exists('apps/api/src/auth/auth.service.ts') ? read('apps/api/src/auth/auth.service.ts') : ''
if ((authService.includes('/buyer') || authService.includes('/seller') || authService.includes('/hub')) && !validationReport.includes('Downstream Routes')) {
  fail('validation report does not document that login nextRoute targets downstream routes outside the current slice')
}

if (hasFailure) {
  console.error('Shared-auth acceptance check failed.')
  process.exit(1)
}

console.log('Shared-auth acceptance check passed.')
