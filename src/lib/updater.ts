import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const REPO = 'PrabishaConsulting/travel-nexus-world-app'
const LATEST_URL = `https://api.github.com/repos/${REPO}/releases/latest`
const SKIPPED_KEY = 'update:skipped-version'

export interface UpdateInfo {
  version: string
  notes: string
  /** Direct APK download if the release has one, else the release page. */
  url: string
}

function parse(v: string): number[] {
  return v.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0)
}

export function isNewer(remote: string, local: string): boolean {
  const a = parse(remote)
  const b = parse(local)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0)
    if (diff !== 0) return diff > 0
  }
  return false
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  const current = Constants.expoConfig?.version
  if (!current) return null

  const res = await fetch(LATEST_URL, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) return null
  const release = await res.json()
  const tag: string | undefined = release?.tag_name
  if (!tag || release.draft || release.prerelease || !isNewer(tag, current)) return null

  const version = tag.replace(/^v/i, '')
  if ((await AsyncStorage.getItem(SKIPPED_KEY)) === version) return null

  const apk = (release.assets ?? []).find((a: { name: string }) => a.name.toLowerCase().endsWith('.apk'))
  return {
    version,
    notes: (release.body ?? '').trim(),
    url: apk?.browser_download_url ?? release.html_url,
  }
}

export function skipVersion(version: string) {
  return AsyncStorage.setItem(SKIPPED_KEY, version).catch(() => {})
}
