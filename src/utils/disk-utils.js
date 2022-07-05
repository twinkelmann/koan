import * as fs from 'fs'
import * as path from 'path'
import semver from 'semver'

/**
 * Initialize a board on disk by creating it's parent folder and main json file
 * @param {import('./koan-data-current').Koan} json The board's data structure
 * @param {string} diskRoot The full path on disk in which to create a subfolder for the new board
 */
export function initializeNewBoard(json, diskRoot) {
  const boardRoot = path.join(diskRoot, json.meta.safeName)

  if (fs.existsSync(boardRoot)) {
    return 'A board with the same name already exists on disk.'
  }

  try {
    fs.mkdirSync(boardRoot)
  } catch (e) {
    console.error(e)
    return 'Could not create initialize board on disk.'
  }

  // TODO: remove spaces
  const data = JSON.stringify(json, null, 2)
  const boardFilePath = path.join(boardRoot, `${json.meta.safeName}.json`)

  fs.writeFileSync(boardFilePath, data, { encoding: 'utf-8' })

  return `Board "${json.meta.name}" initialized !`
}

/**
 * List all existing and compatible boards on disk
 * @param {string} diskRoot The full path on disk in which to create a subfolder for the new board
 * @returns {[import('./koan-data-current').Koan]} An array of parsed boards
 */
export function listExistingBoards(diskRoot) {
  const allBoards = []

  const allDirectories = fs
    .readdirSync(diskRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())

  for (const dirent of allDirectories) {
    const jsonPath = path.join(diskRoot, dirent.name, `${dirent.name}.json`)

    if (!fs.existsSync(jsonPath) || !fs.statSync(jsonPath).isFile()) {
      // does not exist or is not a file
      continue
    }

    const jsonContent = fs.readFileSync(jsonPath, { encoding: 'utf-8' })
    /**
     * @type {import('./koan-data-current').Koan}
     */
    let parsedContent = null

    try {
      parsedContent = JSON.parse(jsonContent)
    } catch (e) {
      // not a json file
      continue
    }

    // TODO: actually validate JSON
    if (
      !parsedContent.koan_board ||
      semver.gt(parsedContent.version, require('../../package.json').version)
    ) {
      // ignore json that are not koan boards or that are of versions too recent for this software
      continue
    }

    // add valid boards to the list
    allBoards.push(parsedContent)
  }

  return allBoards
}
