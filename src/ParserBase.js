import { getLoggerMemory } from '@xhubioTable/logger'

import { START_ROW, START_COLUMN, KEY_TABLE_END } from './ParserConstants'

export default class ParserBase {
  /**
   * @param startRow {number} The start row of this sheet
   * @param startColumn {number} The start column of this sheet
   * @param endKey {string} The table end key
   * @param name {string} The name of this sheet
   */
  constructor(opts = {}) {
    this.startRow = opts.startRow !== undefined ? opts.startRow : START_ROW
    this.startColumn =
      opts.startColumn !== undefined ? opts.startColumn : START_COLUMN
    this.endKey = opts.endKey !== undefined ? opts.endKey : KEY_TABLE_END
    this.logger = opts.logger ? opts.logger : getLoggerMemory()
  }

  /**
   * Parser the sheet with the given name
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return tableModel {object} The created tablemodel
   */
  // eslint-disable-next-line no-unused-vars
  async parse(sheetName, importer) {}

  /**
   * Parses the sheet to get the last row of the decision table.
   * @param importer {object} The importer object
   * @param sheetName {string} The name of the sheet to parse
   * @param maxEmpty {integer} The maximum of empty lines which will be ignored
   * @return endRow {number} The last row of the table
   */
  getEndRow(importer, sheetName, maxEmpty = 20) {
    let row = this.startRow + 1
    let emptyLines = 0
    let endRow = 0
    do {
      const val = importer.cellValue(sheetName, this.startColumn, row)
      if (val === undefined) {
        emptyLines++
      } else {
        emptyLines = 0
        if (val === this.endKey) {
          endRow = row
        }
      }

      row++
    } while (endRow === 0 && emptyLines < maxEmpty)

    if (endRow === 0) {
      throw new Error(
        `SheetEndRow: Could not find the end sheet identifier '${
          this.endKey
        }' in the sheet '${sheetName}' in column '${this.startColumn}'`
      )
    } else {
      this.logger.info(
        `SheetEndRow: Detect sheetEnd '${this.endKey}' in row '${endRow}'`
      )
    }

    return endRow
  }

  /**
   * Parses the sheet to get the last column of the decision table.
   * @param importer {object} The importer object
   * @param sheetName {string} The name of the sheet to parse
   * @param maxEmpty {integer} The maximum of empty columns which will be ignored
   * @return endRow {number} The last column of the table
   */
  getEndColumn(importer, sheetName, maxEmpty = 20) {
    let column = this.startColumn + 1
    let emptyLines = 0
    let endColumn = 0
    do {
      const val = importer.cellValue(sheetName, column, this.startRow)
      if (val === undefined) {
        emptyLines++
      } else {
        emptyLines = 0
        if (val === this.endKey) {
          endColumn = column
        }
      }

      column++
    } while (endColumn === 0 && emptyLines < maxEmpty)

    if (endColumn === 0) {
      throw new Error(
        `SheetEndColumn: Could not find the end sheet identifier '${
          this.endKey
        }' in the sheet '${sheetName}' in row '${this.startRow}'`
      )
    } else {
      this.logger.info(`Detect sheetEnd '${this.endKey}' in row '${endColumn}'`)
    }

    return endColumn
  }
}
