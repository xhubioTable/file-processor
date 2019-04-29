import assert from 'assert'
import path from 'path'

import { getLoggerMemory } from '@xhubiotable/logger'

// The key used to identify the end column and end row
export const TABLE_END_KEY = '<END>'

// The start row defines where the data starts in the sheet.
export const START_ROW = 0

// The start column defines where the data starts in the sheet.
export const START_COLUMN = 0

// This is the default configuration for a sheet
const DEFAULT_SHEET_NAME = '__default__'

// The importer will load only tables wich match the given keys
const DEFAULT_TABLE_TYPE_KEYS = [
  '<DECISION_TABLE>',
  '<MATRIX_TABLE>',
  '<SPECIFICATION>',
]

/**
 * The file processor.
 */
export default class FileProcessor {
  constructor(opts = {}) {
    /** The logger for the processor */
    this.logger = opts.logger || getLoggerMemory()

    /** {map} Stores importer for file extensions. So the extension of a file defines which importer is used. */
    this.importerMap = new Map()

    /** for every loaded file there may be different type of tables in one Spreadsheet.
     * This map has a parser for the different table types. The processor reads the value
     * in the first cell. This value is the table type. Then teh processor looks up
     * if there is a parser registered for this table type.
     */
    this.parserMap = new Map()

    /**
     * Defines the start column and row per sheetName. Also which key is used
     * to find the end of a row or the last column.
     * This map stores the definition per sheet name.
     * The format of ths definition is:
     * {
     *   startRow: 0,
     *   startColumn: 0,
     *   endKey: '<END>',
     * }
     */
    this.sheetDefinition = {}

    this.sheetDefinition[DEFAULT_SHEET_NAME] = {
      startRow: START_ROW,
      startColumn: START_COLUMN,
      endKey: TABLE_END_KEY,
    }

    /**
     * The importer will load only tables wich match the given keys
     * The key value must be in the first cell of the table defined by
     * start_row and start_column
     * The keys are not case sensitive
     */
    this.tableTypeKeys = opts.tableTypeKeys
      ? opts.tableTypeKeys
      : DEFAULT_TABLE_TYPE_KEYS

    this._tables = new Map()
  }

  /**
   * Returns all the laoded table models
   * @return {array} A list of tables
   */
  get tables() {
    return Array.from(this._tables.values())
  }

  /**
   * Delets all the loaded tables
   */
  clearTables() {
    this._tables = new Map()
  }

  /**
   * Loads a list of files
   * @param fileNames {string|array} The file(s) to open
   */
  async load(fileNames) {
    if (!Array.isArray(fileNames)) {
      // eslint-disable-next-line no-param-reassign
      fileNames = [fileNames]
    }

    for (const fileName of fileNames) {
      await this.logger.debug(`Load the file '${fileName}'`)

      try {
        const importer = this.getImporter(fileName)
        importer.logger = this.logger

        // imports a spreadsheet and returns an array of tables
        await importer.loadFile(fileName)
        await this._processImporter(importer, fileName)
      } catch (err) {
        if (typeof err === 'string') {
          await this.logger.error({
            function: 'load',
            message: err,
            fileName,
          })
        } else {
          await this.logger.error({
            function: 'load',
            stack: err.stack,
            message: err.message,
            fileName,
          })
        }
      }
    }
  }

  /**
   * Adds a new table to the loaded tables
   * @param sheetName {string} The name of the table
   * @param tableModel {object} The table itself
   */
  async _addTable(sheetName, tableModel) {
    if (this._tables.has(sheetName)) {
      this.logger.warning(
        `The table '${sheetName}' was already loaded. Now it is overwritten with a new version`
      )
    }
    this._tables.set(sheetName, tableModel)
  }

  /**
   * Processes the sheets imported by the importer.
   * @param importer {object} The sheet importer
   * @param fileName {string} The name of the file
   */
  async _processImporter(importer, fileName) {
    const sheetNames = importer.sheetNames
    for (const sheetName of sheetNames) {
      await this.logger.debug(
        `Process the sheet '${sheetName}' of the file '${fileName}'`
      )

      const row = this._getSheetStartRow(sheetName)
      const column = this._getSheetStartColumn(sheetName)
      const endKey = this._getSheetEndKey(sheetName)

      if (typeof row !== 'number') {
        throw new Error({
          message: `The sheet start row for '${sheetName}' must be a number`,
          function: '_processImporter',
          fileName,
        })
      }

      if (typeof column !== 'number') {
        throw new Error({
          message: `The sheet start column for '${sheetName}' must be a number`,
          function: '_processImporter',
          fileName,
        })
      }

      const tableType = importer.cellValue(sheetName, column, row)
      if (tableType !== undefined) {
        const parser = this.getParser(tableType)
        if (parser !== undefined) {
          parser.startRow = row
          parser.startColumn = column
          parser.endKey = endKey
          parser.logger = this.logger

          // Ok, parse the sheet
          const tableModel = await parser.parse(sheetName, importer)

          // add the original file name as meta information to the table
          tableModel.meta.fileName = fileName
          await this._addTable(sheetName, tableModel)
        } else {
          await this.logger.info(
            `Ignore the sheet '${sheetName}' in file '${fileName}' because there is no parser fopr the table type '${tableType}'`
          )
        }
      } else {
        await this.logger.info(
          `Ignore the sheet '${sheetName}' in file '${fileName}' because it has no table type in the first cell`
        )
      }
    }
  }

  /**
   * Registers an importer for a file extension. The extension are
   * not case sensitive
   * @param extension {string} The file extension. For Example 'xlsx'
   * @param importer {object} An instance of an importer
   */
  async registerImporter(extension, importer) {
    assert.ok(extension, 'A extension must be provided')
    assert.ok(importer, 'An importer must be provided')

    if (this.importerMap.has(extension)) {
      // A step with the same name was already registred
      // eslint-disable-next-line no-console
      await this.logger.warning(
        `There was already an importer registered with the extension '${extension}'`
      )
    }
    this.importerMap.set(extension.toLowerCase(), importer)
  }

  /**
   * Returns an instance of a step class
   * @param fileName {string} The name of the file to import
   * @return step {object} The instance of the step class
   */
  getImporter(fileName) {
    assert.ok(fileName, 'A fileName name must be provided')

    const ext =
      path.extname(fileName) !== ''
        ? path.extname(fileName).substring(1)
        : undefined
    if (ext !== undefined) {
      if (!this.importerMap.has(ext.toLowerCase())) {
        throw new Error({
          message: `There was no importer registered for the extension '${ext}'`,
          function: 'getImporter',
          fileName,
        })
      }
      return this.importerMap.get(ext.toLowerCase())
    }

    throw new Error({
      message: `The file name '${fileName}' does not have an extension. So no importer could be found.`,
      function: 'getImporter',
      fileName,
    })
  }

  /**
   * Registers a parser for a table type
   * @param type {string} The table type
   * @param parser {object} The parser to use
   */
  async registerParser(type, parser) {
    assert.ok(type, 'A type must be provided')
    assert.ok(parser, 'An parser must be provided')

    if (this.importerMap.has(type)) {
      // A step with the same name was already registred
      // eslint-disable-next-line no-console
      await this.logger.warning(
        `There was already a parser registered with the type '${type}'`
      )
    }
    this.parserMap.set(type.toLowerCase(), parser)
  }

  /**
   * Returns an instance of a step class
   * @param type {string} type of the table
   * @return parser {object} The parser for this table type or undefined
   */
  getParser(type) {
    assert.ok(type, 'A type must be provided')
    return this.parserMap.get(type.toLowerCase())
  }

  /**
   * Sets a config for a sheet name. Each sheet may have different configs
   * @param sheetName {string} The name of the sheet
   * @param config {object} A config for the sheet. config = {startRow, startColumn}
   */
  setSheetConfig(sheetName, config) {
    assert(sheetName, 'No sheet name given')
    assert(config, 'No config given')

    this.sheetDefinition[sheetName] = {
      startRow: 0,
      startColumn: 0,
      endKey: TABLE_END_KEY,
      ...config,
    }
  }

  /**
   * Returns the startRow for a given sheetName.
   * If there is no definition for the sheetName
   * The default definition will be returned.
   * @param sheetName {string} Optional: The name of the sheet
   * @return startRow {number} The row number
   */
  _getSheetStartRow(sheetName = DEFAULT_SHEET_NAME) {
    if (this.sheetDefinition[sheetName] === undefined) {
      return this.sheetDefinition[DEFAULT_SHEET_NAME].startRow
    }
    return this.sheetDefinition[sheetName].startRow
  }

  /**
   * Returns the startColumn for a given sheetName.
   * If there is no definition for the sheetName
   * The default definition will be returned.
   * @param sheetName {string} Optional: The name of the sheet
   * @return startColumn {number} The column number
   */
  _getSheetStartColumn(sheetName = DEFAULT_SHEET_NAME) {
    if (this.sheetDefinition[sheetName] === undefined) {
      return this.sheetDefinition[DEFAULT_SHEET_NAME].startColumn
    }
    return this.sheetDefinition[sheetName].startColumn
  }

  /**
   * Returns the endKey for a given sheetName.
   * If there is no definition for the sheetName
   * The default definition will be returned.
   * @param sheetName {string} Optional: The name of the sheet
   * @return endKey {number} The endKey for this sheet
   */
  _getSheetEndKey(sheetName = DEFAULT_SHEET_NAME) {
    if (this.sheetDefinition[sheetName] === undefined) {
      return this.sheetDefinition[DEFAULT_SHEET_NAME].endKey
    }
    return this.sheetDefinition[sheetName].endKey
  }
}
