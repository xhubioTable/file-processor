import assert from 'assert'
import ParserBase from './ParserBase'

import { TableDecision } from '@xhubiotable/model-decision'

import {
  START_COLUMN_TESTCASE,
  COLUMN_TYPE,
  COLUMN_FIELD_EQ_CLASS,
  COLUMN_FIELD_TDG,
  COLUMN_FIELD_COMMENT,
  COLUMN_MURO_KEY,
  COLUMN_MURO_OTHER,
  COLUMN_MURO_COMMENT,
} from './ParserDecisionConstants'

import { sectionTypes } from '@xhubiotable/model-decision'

const { EXECUTE_SECTION, NEVER_EXECUTE_SECTION, MULTIPLICITY_SECTION } =
  sectionTypes

import { START_ROW, START_COLUMN } from './ParserConstants'

/**
 * The parser implementation to parse decision tables.
 * @extends ParserBase
 */
export default class ParserDecision extends ParserBase {
  constructor(opts = {}) {
    super(opts)

    /** Stores the handler for the different kind of sections. */
    this.sectionHandler = {
      MultiRowSection: this.handleMultiRowSection,
      SummarySection: this.handleSummarySection,
      MultiplicitySection: this.handleMultiplicitySection,
      ExecuteSection: this.handleExecuteSection,
      NeverExecuteSection: this.handleNeverExecuteSection,
      TagSection: this.handleTagSection,
      FilterSection: this.handleFilterSection,
      GeneratorSwitchSection: this.handleGeneratorSwitchSection,
      FieldSection: this.handleFieldSection,
      FieldSubSection: 'SUB_SECTION',
    }

    /** This sequence is used to give each field a unique name. */
    this.fieldNameSequence = 0
  }

  /**
   * Parses the sheet with the given name und uses the given importer to access
   * the data.
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return tableModel {object} The created tablemodel
   */
  async parse(sheetName, importer) {
    await this.logger.debug(`parseExcelSheet '${sheetName}'`)

    assert(importer !== undefined)
    assert(sheetName !== undefined)

    // Create a new table object
    const table = new TableDecision({ name: sheetName })

    // get the last column of the testcases and also create empty testcase objects
    const testCaseEndColumn = await this.parseForTestcases(
      table,
      sheetName,
      importer,
      START_COLUMN_TESTCASE,
      START_ROW
    )

    const sheetEndRow = this.getEndRow(importer, sheetName)

    let currentRow = 1 // Start in the second line
    let processSheet = true
    do {
      const { startRow, endRow, sectionType } = await this.getNextSection(
        sheetName,
        importer,
        currentRow,
        sheetEndRow
      )
      currentRow = endRow

      const sectionHandler = this.sectionHandler[sectionType]
      assert(sectionHandler !== undefined)

      const sectionName = importer.cellValue(sheetName, START_COLUMN, startRow)
      if (sectionName === undefined) {
        throw new Error({
          message: `No section name defined in row '${startRow}'`,
          row: startRow,
          column: START_COLUMN,
          function: 'parseExcelSheet',
        })
      }

      await this.logger.debug({
        message: `Handle section ${sectionType}`,
        function: 'parseExcelSheet',
        row: startRow,
        sheet: sheetName,
      })
      await sectionHandler.apply(this, [
        {
          table,
          sheetName,
          importer,
          sectionName,
          startRow,
          endRow,
          testCaseEndColumn,
        },
      ])

      if (endRow >= sheetEndRow) {
        // this was the last section
        processSheet = false
      }
    } while (processSheet)

    this._updateTestcaseExecute(table)
    this._updateTestcaseNeverExecute(table)
    this._updateTestcaseMultiplicity(table)

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
   * Reads the first line until no testcase name found. This
   * column is the last column which will be read. By the way create emtpy testcases
   * and add them to the table.
   * @param table {object} The table object. The new model
   * @param sheetName {string} The name of the worksheet
   * @param importer {object} The importer
   * @param testCaseStartColumn {number} The coumn in which the testcases starts
   * @param startRow {number} The row in which the testcase names are defined
   * @return {number} The testcase end column
   */
  async parseForTestcases(
    table,
    sheetName,
    importer,
    testCaseStartColumn,
    startRow
  ) {
    await this.logger.debug(`Parse for testcase in sheet '${sheetName}'`)

    assert.ok(table !== undefined, 'Table must be defined')
    assert.ok(importer !== undefined, 'Importer must be defined')
    assert.ok(sheetName !== undefined, 'sheetName must be defined')
    assert.ok(
      testCaseStartColumn !== undefined,
      'testCaseStartColumn must be defined'
    )
    assert.ok(startRow !== undefined, 'startRow must be defined')

    // The column offset
    let i = 0
    let testcaseName
    do {
      testcaseName = importer.cellValue(
        sheetName,
        testCaseStartColumn + i,
        startRow
      )
      if (testcaseName !== undefined) {
        // There is a testcase lets create one and store it in the table
        table.addNewTestcase(testcaseName)
      }
      i++
    } while (testcaseName !== undefined)

    const endColumn = testCaseStartColumn + i - 1
    await this.logger.info(
      `Read ${table.testcases.length} testcases from sheet ${sheetName}.`
    )
    await this.logger.info(
      `Stop reading testcases in col:${endColumn} / row:${startRow}.`
    )
    return endColumn
  }
  /**
   * After the table was loaded it must be checked if there is a 'ExecuteSection'.
   * If so the values must be set in the testcase.execute property
   * @param table {object} The table to be updated
   */
  _updateTestcaseExecute(table) {
    const section = table.singleCheck.get(EXECUTE_SECTION)
    if (section !== undefined) {
      for (const key of Object.keys(table.testcases)) {
        const testcase = table.testcases[key]
        // Get the value from the testcase for this section
        const val = testcase.data[section.headerRow]
        testcase.execute = this._getBoolean(val)
      }
    }
  }

  /**
   * After the table was loaded it must be checked if there is a 'ExecuteSection'.
   * If so the values must be set in the testcase.execute property
   * @param table {object} The table to be updated
   */
  _updateTestcaseNeverExecute(table) {
    const section = table.singleCheck.get(NEVER_EXECUTE_SECTION)
    if (section !== undefined) {
      for (const key of Object.keys(table.testcases)) {
        const testcase = table.testcases[key]
        // Get the value from the testcase for this section
        const val = testcase.data[section.headerRow]
        testcase.neverExecute = this._getBoolean(val)
      }
    }
  }

  /**
   * Converts a string value into a boolen value
   * @param val {string} The value to be checked for a boolean
   * @return bool {boolean} true is the string is a true value else false
   */
  _getBoolean(val) {
    if (
      val !== undefined &&
      val.match(/^[tyj]$|^1$|^yes$|^ja$|^si$|^true$|^ok$/i)
    ) {
      return true
    }
    return false
  }

  /**
   * If this section exists the multiplicity of an testcase must be updated
   * @param table {object} The table to be updated
   */
  _updateTestcaseMultiplicity(table) {
    const section = table.singleCheck.get(MULTIPLICITY_SECTION)
    if (section !== undefined) {
      for (const key of Object.keys(table.testcases)) {
        const testcase = table.testcases[key]
        // Get the value from the testcase for this section
        const val = testcase.data[section.headerRow]
        testcase.multiplicity = this._getMultiplicityFromValue(val)
      }
    }
  }

  /**
   * Tries to convert a string into a multiplicity value
   * @param val {string} The value to be checked for a boolean
   * @return bool {boolean} true is the string is a true value else false
   */
  _getMultiplicityFromValue(val) {
    if (val !== undefined && !isNaN(val)) {
      try {
        const i = parseInt(val, 10)
        if (i > 0) {
          return i
        }
      } catch (e) {
        // nothing to do
      }
    }
    return 1
  }

  /**
   * Adds a new MultiRowSection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sectionName {string} The name of this section
   * @param startRow {number} The row the section begins
   * @param endRow {number} The row the next section begins
   */
  async handleMultiRowSection(opts) {
    const { table, sheetName, importer, sectionName, startRow, endRow } = opts

    // create new section
    const section = table.addNewMultiRowSection(sectionName)

    // add the rows
    for (let i = startRow + 1; i < endRow; i++) {
      const key = importer.cellValue(sheetName, COLUMN_MURO_KEY, i)
      const comment = importer.cellValue(sheetName, COLUMN_MURO_COMMENT, i)
      const other = importer.cellValue(sheetName, COLUMN_MURO_OTHER, i)

      const rowId = section.createNewRow()
      if (key !== undefined) {
        section.keys[rowId] = key
      }
      if (comment !== undefined) {
        section.comments[rowId] = comment
      }
      if (other !== undefined) {
        section.others[rowId] = other
      }

      this._readTestcaseValues(table, sheetName, importer, i, rowId)
    }
  }

  /**
   * Adds a new TagSection to the table. Updates the data for all the test cases
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sectionName {string} The name of this section
   * @param startRow {number} The row the section begins
   * @param endRow {number} The row the next section begins
   */
  async handleTagSection(opts) {
    const { table, sheetName, importer, sectionName, startRow, endRow } = opts

    // create new section
    const section = table.addNewTagSection(sectionName)

    // add the rows
    for (let i = startRow + 1; i < endRow; i++) {
      const tag = importer.cellValue(sheetName, COLUMN_MURO_KEY, i)
      const comment = importer.cellValue(sheetName, COLUMN_MURO_COMMENT, i)
      const other = importer.cellValue(sheetName, COLUMN_MURO_OTHER, i)

      const rowId = section.createNewRow()
      if (tag !== undefined) {
        section.tags[rowId] = tag
      }
      if (comment !== undefined) {
        section.comments[rowId] = comment
      }
      if (other !== undefined) {
        section.others[rowId] = other
      }

      this._readTestcaseValues(table, sheetName, importer, i, rowId)
    }
  }

  /**
   * Adds a new TagSection to the table. Updates the data for all the test cases
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sectionName {string} The name of this section
   * @param startRow {number} The row the section begins
   * @param endRow {number} The row the next section begins
   */
  async handleFilterSection(opts) {
    const { table, sheetName, importer, sectionName, startRow, endRow } = opts

    // create new section
    const section = table.addNewFilterSection(sectionName)

    // add the rows
    for (let i = startRow + 1; i < endRow; i++) {
      const filterProcessorName = importer.cellValue(
        sheetName,
        COLUMN_MURO_KEY,
        i
      )
      const expression = importer.cellValue(sheetName, COLUMN_MURO_OTHER, i)
      const comment = importer.cellValue(sheetName, COLUMN_MURO_COMMENT, i)

      const rowId = section.createNewRow()
      if (filterProcessorName !== undefined) {
        section.filterProcessorNames[rowId] = filterProcessorName
      }
      if (expression !== undefined) {
        section.expressions[rowId] = expression
      }
      if (comment !== undefined) {
        section.comments[rowId] = comment
      }

      this._readTestcaseValues(table, sheetName, importer, i, rowId)
    }
  }

  /**
   * Adds a new GeneratorSwitch to the table. Updates the data for all the test cases
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sectionName {string} The name of this section
   * @param startRow {number} The row the section begins
   * @param endRow {number} The row the next section begins
   */
  async handleGeneratorSwitchSection(opts) {
    const { table, sheetName, importer, sectionName, startRow, endRow } = opts

    // create new section
    const section = table.addNewGeneratorSwitchSection(sectionName)

    // add the rows
    for (let i = startRow + 1; i < endRow; i++) {
      const generatorName = importer.cellValue(sheetName, COLUMN_MURO_KEY, i)
      const values = importer.cellValue(sheetName, COLUMN_MURO_OTHER, i)
      const comment = importer.cellValue(sheetName, COLUMN_MURO_COMMENT, i)

      const rowId = section.createNewRow()
      if (generatorName !== undefined) {
        section.generatorNames[rowId] = generatorName
      }
      if (values !== undefined) {
        section.values[rowId] = values
      }
      if (comment !== undefined) {
        section.comments[rowId] = comment
      }

      this._readTestcaseValues(table, sheetName, importer, i, rowId)
    }
  }

  /**
   * Adds a new SummarySection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sectionName {string} The name of this section
   */
  async handleMultiplicitySection(opts) {
    const { table, sheetName, importer, sectionName, startRow } = opts
    const sectionDefinition = table.addNewMultiplicitySection(sectionName)
    this._readTestcaseValues(
      table,
      sheetName,
      importer,
      startRow,
      sectionDefinition.headerRow
    )
  }

  /**
   * Adds a new ExecuteSection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sectionName {string} The name of this section
   */
  async handleExecuteSection(opts) {
    const { table, sheetName, importer, sectionName, startRow } = opts
    const sectionDefinition = table.addNewExecuteSection(sectionName)
    this._readTestcaseValues(
      table,
      sheetName,
      importer,
      startRow,
      sectionDefinition.headerRow
    )
  }

  /**
   * Adds a new NeverExecuteSection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sectionName {string} The name of this section
   */
  async handleNeverExecuteSection(opts) {
    const { table, sheetName, importer, sectionName, startRow } = opts
    const sectionDefinition = table.addNewNeverExecuteSection(sectionName)
    this._readTestcaseValues(
      table,
      sheetName,
      importer,
      startRow,
      sectionDefinition.headerRow
    )
  }

  /**
   * Adds a new SummarySection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sectionName {string} The name of this section
   */
  async handleSummarySection(opts) {
    const { table, sectionName } = opts
    table.addNewSummarySection(sectionName)
  }

  /**
   * Adds a new FieldSection to the table. Updates the data for all the testcases
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param sectionName {string} The name of this section
   * @param startRow {number} The row the section begins
   * @param endRow {number} The row the next section begins
   */
  async handleFieldSection(opts) {
    const { table, sheetName, importer, sectionName, startRow, endRow } = opts

    // first add the fieldSection itself
    const fieldSectionDefinition = table.addNewFieldSection(sectionName)

    // now add the subSections
    let currentRow = startRow + 1
    do {
      // get the ranges of one subSection
      const {
        startRow: fieldStartRow,
        endRow: fieldEndRow,
        fieldName,
      } = await this.getNextSubSection(sheetName, importer, currentRow, endRow)

      const key = `FieldSubSection_${fieldName}`
      if (table.sectionNames.has(key)) {
        await this.logger.error({
          message: `Double FieldSubSection name '${fieldName}' in section '${sectionName}' in table '${sheetName}'`,
          function: 'handleFieldSection',
          row: currentRow + 1,
          column: COLUMN_TYPE,
        })
      } else {
        table.sectionNames.add(key)
      }

      // create a new subSection
      const subSectionDefinition =
        fieldSectionDefinition.createNewField(fieldName)
      subSectionDefinition.name = importer.cellValue(
        sheetName,
        START_COLUMN,
        currentRow
      )

      // get the data for the subSectionDefinition
      for (let row = fieldStartRow + 1; row < fieldEndRow; row++) {
        const eqClass = importer.cellValue(
          sheetName,
          COLUMN_FIELD_EQ_CLASS,
          row
        )
        const comment = importer.cellValue(sheetName, COLUMN_FIELD_COMMENT, row)
        const tdg = importer.cellValue(sheetName, COLUMN_FIELD_TDG, row)

        const rowId = subSectionDefinition.createNewRow()
        if (eqClass !== undefined) {
          subSectionDefinition.equivalenceClasses[rowId] = eqClass
        }
        if (comment !== undefined) {
          subSectionDefinition.comments[rowId] = comment
        }
        if (tdg !== undefined) {
          subSectionDefinition.tdgs[rowId] = tdg
        }

        this._readTestcaseValues(table, sheetName, importer, row, rowId)
      }

      currentRow = fieldEndRow
    } while (currentRow < endRow)
  }

  /**
   * reads the data for the testcases from the spreadsheet
   * @param table {object} The table to store the current sheet data
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param row {nuber} The row where to read the data
   * @param rowId {string} The uuid of this row
   */
  _readTestcaseValues(table, sheetName, importer, row, rowId) {
    for (let tc = 0; tc < table.testcaseOrder.length; tc++) {
      const testcaseId = table.testcaseOrder[tc]
      const testcase = table.testcases[testcaseId]
      const value = importer.cellValue(
        sheetName,
        START_COLUMN_TESTCASE + tc,
        row
      )
      testcase.setValue(rowId, value)
    }
  }

  /**
   * Get the definition of the next sub section
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param startRow {nuber} The row where to start searching
   * @param sectionEndRow {number} The last row in the parent section
   * @return table {object} A definition/boundaries of this subSection { startRow, endRow, fieldName }
   */
  async getNextSubSection(sheetName, importer, startRow, sectionEndRow) {
    assert(sheetName !== undefined)
    assert(importer !== undefined)
    assert(startRow !== undefined)
    assert(sectionEndRow !== undefined && sectionEndRow > 0)

    let sectionType
    let currentRow = startRow
    let subSectionStartRow
    let subSectionName
    let subSectionEndRow
    do {
      sectionType = importer.cellValue(sheetName, COLUMN_TYPE, currentRow)
      if (sectionType !== undefined) {
        // this is a new subSection
        if (subSectionStartRow === undefined) {
          // ok, this is the start of a section
          subSectionStartRow = currentRow
          subSectionName = importer.cellValue(
            sheetName,
            START_COLUMN,
            currentRow
          )
          if (subSectionName === undefined) {
            await this.logger.error({
              message: `No field name defined.`,
              function: 'getNextSubSection',
              row: currentRow,
              column: COLUMN_TYPE,
            })
            // create a unique fielName
            subSectionName = this.getFieldName()
          }
        } else {
          // this is be the start of the next section
          subSectionEndRow = currentRow
        }
      }
      currentRow++
    } while (subSectionEndRow === undefined && currentRow < sectionEndRow)
    if (subSectionEndRow === undefined) {
      // this was the last sectionEndRow
      subSectionEndRow = sectionEndRow
    }

    return {
      startRow: subSectionStartRow,
      endRow: subSectionEndRow,
      fieldName: subSectionName,
    }
  }

  /**
   * Get the definition of the next section
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param startRow {nuber} The row where to start searching
   * @param sheetEndRow {number} The last row in this sheet
   * @return table {object} The created table model for the sheet
   */
  async getNextSection(sheetName, importer, startRow, sheetEndRow) {
    assert(sheetName !== undefined)
    assert(importer !== undefined)
    assert(startRow !== undefined)
    assert(sheetEndRow !== undefined && sheetEndRow > 0)

    // each time a value is entered in the first column a sectionType
    // should exists

    let isError = false
    let sectionType
    let firstColCell // the value of the first column
    let currentRow = startRow
    let sectionStartRow
    let sectionStartType
    let sectionEndRow
    do {
      sectionType = importer.cellValue(sheetName, COLUMN_TYPE, currentRow)
      firstColCell = importer.cellValue(sheetName, START_COLUMN, currentRow)
      if (
        firstColCell !== undefined &&
        sectionType === undefined &&
        currentRow > START_ROW + 1
      ) {
        await this.logger.error({
          message: `If a name is entered in column '${START_COLUMN}' a sectionType must be probvided in column '${COLUMN_TYPE}'`,
          function: 'getNextSection',
          row: currentRow,
          column: START_COLUMN,
        })
        isError = true
      }

      if (sectionType !== undefined) {
        if (this.sectionHandler[sectionType] !== undefined) {
          if (this.sectionHandler[sectionType] !== 'SUB_SECTION') {
            // valid section found.
            if (sectionStartRow === undefined) {
              // ok, this is the start of a section
              sectionStartRow = currentRow
              sectionStartType = sectionType
            } else {
              // this is be the start of the next section
              sectionEndRow = currentRow
            }
          }
        } else {
          // invalid section type found
          await this.logger.error({
            message: `Invalid section type '${sectionType}' found.`,
            function: 'getNextSection',
            row: currentRow,
            column: COLUMN_TYPE,
          })
          isError = true
        }
      }
      currentRow++
    } while (sectionEndRow === undefined && currentRow < sheetEndRow)
    if (sectionEndRow === undefined) {
      // this was the last sectionEndRow
      sectionEndRow = sheetEndRow
    }

    if (isError) {
      throw new Error(`Could not parse the sheet beacause of the found errors!`)
    }

    await this.logger.info({
      message: `${sheetName}: Section '${sectionStartType}' from '${sectionStartRow}' to '${sectionEndRow}'`,
      function: 'getNextSection',
    })
    return {
      startRow: sectionStartRow,
      endRow: sectionEndRow,
      sectionType: sectionStartType,
    }
  }
}
