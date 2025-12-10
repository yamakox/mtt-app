export default class WakeLock {
  private wakeLock: any = undefined

  async request() {
    if (this.wakeLock) {
      return
    }
    try {
      // NOTE: This only works via https
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen')
      }
    } catch (error) {
      console.error(error)
    }
  }

  async release() {
    if (!this.wakeLock) {
      return
    }
    await this.wakeLock.release()
    this.wakeLock = undefined
  }
}
