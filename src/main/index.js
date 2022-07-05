/* globals INCLUDE_RESOURCES_PATH */
import { app, ipcMain, shell } from 'electron'
import { initializeNewBoard, listExistingBoards } from '../utils/disk-utils'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH
if (__resources === undefined) {
  console.error('[Main-process]: Resources path is undefined')
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

const appPath = path.resolve(__dirname, '..', '..')
const userDataPath =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'production'
    ? app.getPath('userData') // Live Mode
    : path.join(appPath, 'AppData') // Dev Mode

const boardsPath = path.join(userDataPath, 'Boards')

if (!fs.existsSync(boardsPath)) {
  // If the AppData dir doesn't exist at expected Path. Then Create
  // Maybe the case when the user runs the app first.
  fs.mkdirSync(boardsPath, { recursive: true })
}

// Load here all startup windows
require('./mainWindow')

ipcMain.handle('openExternal', (event, url) => {
  return shell.openExternal(url)
})

ipcMain.handle('initializeNewBoard', (event, json) => {
  return initializeNewBoard(json, boardsPath)
})

ipcMain.handle('listExistingBoards', (event) => {
  return listExistingBoards(boardsPath)
})
