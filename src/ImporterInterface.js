/**
 * Defines the interface for an importer.
 * An importer loads an Spreadsheet file and returns a map of sheets
 */

export class ImporterInterface {
  /**
   * Opens the Spreadsheet and loads it
   * @param fileName {string} The file to open
   */
  // eslint-disable-next-line no-unused-vars
  async loadFile(fileName) {}

  /**
   * Returns the Cell value from a given sheet
   * @param sheetName {string} The name of the sheet
   * @param column {number} The column number start with '0'
   * @param row {number} The row number start with '0'
   * @return value {string} The Cell value
   */
  // eslint-disable-next-line no-unused-vars
  cellValue(sheetName, column, row) {}

  /**
   * Returns a list of sheet names
   * @return sheets {array} A list of sheet names
   */
  sheetNames() {}

  /**
   * Free some memory
   */
  clear() {}
}
