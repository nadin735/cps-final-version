// No login: all projects live in one local workspace in this browser.
//
// Earlier versions had a demo "login" that stored names and passwords in
// plain text in localStorage. That is gone. On start-up we migrate the last
// signed-in user's portfolio into the local workspace and then delete every
// stored name/password, so no credentials remain in the browser.

export const WORKSPACE = 'local'

const LEGACY_ACCOUNTS_KEY = 'cps-accounts-v1'
const LEGACY_SESSION_KEY = 'cps-session-v1'

const portfolioKey = (key: string) => `cps-portfolio-${key}-v1`

export function purgeLegacyAccounts(): void {
  try {
    const session = localStorage.getItem(LEGACY_SESSION_KEY)
    if (session && !localStorage.getItem(portfolioKey(WORKSPACE))) {
      const legacy = localStorage.getItem(portfolioKey(session))
      if (legacy) localStorage.setItem(portfolioKey(WORKSPACE), legacy)
    }
    localStorage.removeItem(LEGACY_ACCOUNTS_KEY)
    localStorage.removeItem(LEGACY_SESSION_KEY)
  } catch {
    /* storage unavailable (private mode) — nothing to clean up */
  }
}

/** Deletes every key this app wrote in this browser: portfolios, theme, legacy data. */
export function deleteAllLocalData(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('cps-'))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
