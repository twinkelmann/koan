import { DateTime } from 'luxon'

/**
 * Check with luxon if an ISO datetime string is valid
 * @param {string} isoDateTime the string to check
 * @returns {boolean} true if the string is a valid ISO datetime string
 */
export function isValidISOString(isoDateTime) {
  // if not a string, or the string is empty, or undefined, or null
  if (typeof isoDateTime !== 'string' || !isoDateTime) {
    return false
  }
  return DateTime.fromISO(isoDateTime).isValid
}
