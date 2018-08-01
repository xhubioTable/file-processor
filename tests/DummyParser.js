export default class ParserInterface {
  /**
   * Parser the sheet with the given name
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return tableModel {object} The created tablemodel
   */
  // eslint-disable-next-line no-unused-vars
  async parse(sheetName, importer) {
    return { name: sheetName, type: 'dummyModel' }
  }
}
