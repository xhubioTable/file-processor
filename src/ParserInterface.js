/**
 * The interface definition for all the table parser.
 */
export class ParserInterface {
  /**
   * Parses the sheet with the given name und uses the given importer to access
   * the data.
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return tableModel {object} The created table model
   */
  // eslint-disable-next-line no-unused-vars
  async parse(sheetName, importer) {}
}
