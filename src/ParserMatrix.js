import assert from 'assert'
import ParserBase from './ParserBase'

import { TableMatrix } from '@xhubioTable/model-matrix'

import {
  START_COLUMN_DATA,
  START_ROW_DATA,
  COLUMN_NAME,
  ROW_NAME,
  COLUMN_SHORT_NAME,
  ROW_SHORT_NAME,
  COLUMN_POSITION_NAME,
  ROW_POSITION_NAME,
  COLUMN_EXECUTE,
  ROW_EXECUTE,
  COLUMN_GENERATOR,
  ROW_GENERATOR,
  COLUMN_DESCRIPTION,
  ROW_DESCRIPTION,
} from './ParserMatrixConstants'

import { START_ROW, START_COLUMN } from './ParserConstants'

const META_ROWS = {
  name: ROW_NAME,
  shortName: ROW_SHORT_NAME,
  position: ROW_POSITION_NAME,
  execute: ROW_EXECUTE,
  generator: ROW_GENERATOR,
  description: ROW_DESCRIPTION,
}

const META_COLUMNS = {
  name: COLUMN_NAME,
  shortName: COLUMN_SHORT_NAME,
  position: COLUMN_POSITION_NAME,
  execute: COLUMN_EXECUTE,
  generator: COLUMN_GENERATOR,
  description: COLUMN_DESCRIPTION,
}

export default class ParserMatrix extends ParserBase {
  constructor(opts = {}) {
    super(opts)
    this.fieldNameSequence = 0
  }

  /**
   * Parser the sheet with the given name
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return tableModel {object} The created tablemodel
   */
  async parse(sheetName, importer) {
    await this.logger.debug(`parseExcelSheet '${sheetName}'`)
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')

    // Create a new table object
    const table = new TableMatrix({ name: sheetName })

    const sheetEndRow = this.getEndRow(importer, sheetName)
    const sheetEndColumn = this.getEndColumn(importer, sheetName)

    await this._parseMetaDataColumn(
      table,
      sheetName,
      importer,
      sheetEndColumn,
      sheetEndRow
    )
    await this._parseMetaDataRow(
      table,
      sheetName,
      importer,
      sheetEndRow,
      sheetEndRow
    )
    await this._parseFieldData(
      table,
      sheetName,
      importer,
      sheetEndColumn,
      sheetEndRow
    )

    return table
  }

  /**
   * Creates a unique field name.
   * @return fieldName {string} New generated fieldName
   */
  getFieldName() {
    this.fieldNameSequence++
    return '__Field_' + this.fieldNameSequence
  }

  /**
   * Reads the meta data information of each column and stores it in the
   * table object
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sheetEndColumn {number} The last column of the sheed (Exclusive)
   * @param sheetEndRow {number} The last row of the sheet (Exclusive)
   */
  async _parseMetaDataColumn(
    table,
    sheetName,
    importer,
    sheetEndColumn,
    sheetEndRow
  ) {
    for (let column = START_COLUMN_DATA; column < sheetEndColumn; column++) {
      const meta = {}

      for (const key of Object.keys(META_ROWS)) {
        const row = META_ROWS[key]
        const val = importer.cellValue(sheetName, column, row)

        if (key === 'name' && val === '') {
          // in this case the complete column must be null
          await this._checkForEmptyColumn(
            sheetName,
            importer,
            column,
            sheetEndRow
          )
        }
        meta[key] = val
      }
      table.columns.push(meta)
    }
  }

  /**
   * Checks that the complete row is empty.
   * If the column has no name, then the complete row must be null
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param column {number} The current column
   * @param sheetEndRow {number} The last row of the sheet (Exclusive)
   */
  async _checkForEmptyColumn(sheetName, importer, column, sheetEndRow) {
    for (let row = START_ROW; row < sheetEndRow; row++) {
      const val = importer.cellValue(sheetName, column, row)
      if (val !== undefined && val !== '') {
        await this.logger.error({
          message: `If the name is null there must be no data for the complete column`,
          function: '_checkForEmptyColumn',
          row,
          column,
        })
      }
    }
  }

  /**
   * Reads the meta data information of each row and stores it in the
   * table object
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sheetEndColumn {number} The last column of the sheed (Exclusive)
   * @param sheetEndRow {number} The last row of the sheet (Exclusive)
   */
  async _parseMetaDataRow(
    table,
    sheetName,
    importer,
    sheetEndColumn,
    sheetEndRow
  ) {
    for (let row = START_ROW_DATA; row < sheetEndRow; row++) {
      const meta = {}
      for (const key of Object.keys(META_COLUMNS)) {
        const column = META_COLUMNS[key]
        const val = importer.cellValue(sheetName, column, row)

        if (key === 'name' && val === '') {
          // in this case the complete column must be null
          await this._checkForEmptyRow(sheetName, importer, row, sheetEndColumn)
        }
        meta[key] = val
      }
      table.rows.push(meta)
    }
  }

  /**
   * Checks that the complete row is empty.
   * If the column has no name, then the complete row must be null
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param row {number} The current row
   * @param sheetEndColumn {number} The last column of the sheet (Exclusive)
   */
  async _checkForEmptyRow(sheetName, importer, row, sheetEndColumn) {
    for (let column = START_COLUMN; column < sheetEndColumn; column++) {
      const val = importer.cellValue(sheetName, column, row)
      if (val !== undefined && val !== '') {
        await this.logger.error({
          message: `If the name is null there must be no data for the complete row`,
          function: '_parseMetaDataRow',
          row,
          column,
        })
      }
    }
  }

  /**
   * Reads the data section of the matrix table
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sheetEndColumn {number} The last column of the sheed (Exclusive)
   * @param sheetEndRow {number} The last row of the sheet (Exclusive)
   */
  _parseFieldData(table, sheetName, importer, sheetEndColumn, sheetEndRow) {
    for (let row = START_ROW_DATA; row < sheetEndRow; row++) {
      const matrixData = []
      for (let column = START_COLUMN_DATA; column < sheetEndColumn; column++) {
        const val = importer.cellValue(sheetName, column, row)
        matrixData.push(val)
      }
      table.data.push(matrixData)
    }
  }
}
