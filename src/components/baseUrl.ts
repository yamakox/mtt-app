let baseUrl = import.meta.env.BASE_URL
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1)
}

export default function makeUrl(path: string): string {
  return baseUrl + path
}
