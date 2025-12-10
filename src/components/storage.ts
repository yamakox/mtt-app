/*
 * ローカルストレージはこのドキュメントのオリジンで共有される。
 * (オリジン = プロトコル + ホスト(ドメイン) + ポート)
 * https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage
 */

const prefix: string = '/muscle-training/'

export function getStorage(key: string): string | null {
  return localStorage.getItem(prefix + key)
}

export function setStorage(key: string, value: string): void {
  localStorage.setItem(prefix + key, value)
}
