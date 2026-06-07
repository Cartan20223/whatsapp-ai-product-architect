export class RateLimiter {
  #lastReply = 0
  #minInterval

  constructor(minIntervalMs = 15000) {
    this.#minInterval = minIntervalMs
  }

  canReply() {
    const now = Date.now()
    if (now - this.#lastReply < this.#minInterval) {
      return false
    }
    this.#lastReply = now
    return true
  }
}
