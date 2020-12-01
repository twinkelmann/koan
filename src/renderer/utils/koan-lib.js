import semver from 'semver'
import { DateTime } from 'luxon'
import { isValidISOString } from './utils'
const { version } = require('../../../package.json')

/**
 * Create a defualt empty board
 * @param {string} now the current utc datetime in ISO format, in case the data is invalid
 * @param {string} author the name of the default author, in case the data is invalid
 * @returns {import('./koan-data').Koan} an empty valid board
 */
export function createEmpty(now, author) {
  return {
    koan_board: true,
    version,
    meta: {
      created_at: now,
      updated_at: now,
      author,
      remote: null,
    },
    data: {
      board: {
        lists: {
          active: [],
          archived: [],
        },
      },
      labels: {
        'koan-lbl-0': {
          id: 'koan-lbl-0',
          properties: {
            color: '#578f36',
            text: '',
          },
        },
        'koan-lbl-1': {
          id: 'koan-lbl-1',
          properties: {
            color: '#c2ab00',
            text: '',
          },
        },
        'koan-lbl-2': {
          id: 'koan-lbl-2',
          properties: {
            color: '#bc6d00',
            text: '',
          },
        },
        'koan-lbl-3': {
          id: 'koan-lbl-3',
          properties: {
            color: '#9d2211',
            text: '',
          },
        },
        'koan-lbl-4': {
          id: 'koan-lbl-4',
          properties: {
            color: '#611c7b',
            text: '',
          },
        },
        'koan-lbl-5': {
          id: 'koan-lbl-5',
          properties: {
            color: '#006199',
            text: '',
          },
        },
      },
    },
  }
}

/**
 * Validate the current version of the data
 * This functions always returns valid koan data
 * @param {import('./koan-data').Koan} json the parsed current version JSON file
 * @param {string} now the current utc datetime in ISO format, in case the data is invalid
 * @param {string} author the name of the default author, in case the data is invalid
 * @returns {import('./koan-data').Koan} a validated current version of the data
 */
function validateCurrent(json, now, author) {
  const output = createEmpty(now, author)

  // Meta

  if (typeof json.meta === 'object' && json.meta !== null) {
    if (isValidISOString(json.meta.created_at)) {
      output.meta.created_at = json.meta.created_at
    }
    if (isValidISOString(json.meta.updated_at)) {
      output.meta.updated_at = json.meta.updated_at
    }
    if (typeof json.meta.author === 'string' && json.meta.author !== '') {
      output.meta.author = json.meta.author
    }
    if (json.meta.remote && typeof json.meta.remote.url === 'string') {
      json.meta.remote = { url: json.meta.remote.url }
    }
  }

  // Data

  if (typeof json.data === 'object' && json.data !== null) {
    // Board
    if (Array.isArray(json.data.board?.lists?.active)) {
      // TODO: validate KoanLists
    }
    if (Array.isArray(json.data.board?.lists?.archived)) {
      // TODO: validate KoanLists
    }

    // Labels
  }

  // TODO: validate
  return output
}

/**
 * Validate any version of Koan Data parsed from a JSON file
 * @param {import('./koan-data').KoanBase} json the parsed JSON file
 * @returns {import('./koan-data').Koan} a validated current version of the data
 * @throws if data is not valid or too recent
 */
export function validate(json) {
  if (!json.koan_board || typeof json.version !== 'string') {
    throw new Error('Input is not valid Koan data')
  }

  // if the data version is newer than the software, we can't support it
  if (semver.gt(json.version, version)) {
    throw new Error(
      `The data you are trying to read is too recent. Upgrade Koan to version ${json.version} and try again`
    )
  }

  const now = DateTime.utc().toISO()
  // TODO: retrieve author from git config
  const author = 'Michel bay'

  // if the software is in the same major version and higher in minor and patch than the data
  // then we don't need to update the data
  if (semver.satisfies(version, `>=${json.version}`)) {
    return validateCurrent(json, now, author)
  } else {
    // we have to first upgrade the data to the latest version, then validate it
    // TODO: upgrade when there are new versions
    const upgraded = json
    return validateCurrent(upgraded, now, author)
  }
}
