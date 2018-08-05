import assert from 'assert'
import ParserBase from './ParserBase'

import { START_ROW, START_COLUMN } from './ParserConstants'
import {
  KEY_SEVERITY,
  KEY_RULE,
  START_COLUMN_RULE,
} from './ParserSpecificationConstants'

export default class ImporterSpecification extends ParserBase {
  /**
   * Parses a single Spreadsheet
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return specification {object} The created specification model for the sheet
   */
  async parse(sheetName, importer) {
    try {
      await this.logger.debug(`parseExcelSheet`)
      assert.ok(sheetName, 'No sheet name given')
      assert.ok(importer, 'No importer given')

      const specification = new SpecificationModel({ name: sheetName })

      const sheetEndRow = this.getEndRow(importer, sheetName)
      const sheetEndColumn = this.getEndColumn(importer, sheetName)

      // get the sections and validate that all existing
      const { severityStartRow, ruleStartRow } = await this.checkSheetRows(
        sheetName,
        importer,
        sheetEndRow
      )

      if (severityStartRow === 0 || ruleStartRow === 0) {
        // furher parsing possible
        return
      }
      // console.log(`parseExcelSheet: severityStartRow=${severityStartRow}`);
      // console.log(`parseExcelSheet: ruleStartRow=${ruleStartRow}`);

      const fields = await this.parseFields({
        sheetName,
        importer,
        severityStartRow,
        ruleStartRow,
        sheetEndColumn,
      })
      const rules = await this.parseRules({
        sheetName,
        importer,
        ruleStartRow,
        endRow: sheetEndRow,
      })
      const severities = await this.parseSeverities({
        sheetName,
        importer,
        severityStartRow,
        ruleStartRow,
        sheetEndColumn,
      })

      await this.checkForUnusedRules({
        sheetName,
        importer,
        severityStartRow,
        sheetEndColumn,
        rules,
      })

      specification.fieldOrder = fields.fieldOrder
      specification.fields = fields.fields
      specification.rules = rules

      severities.forEach(name => {
        specification.severities.push(name)
      })

      return specification
    } catch (e) {
      await this.logger.error({
        message: e.message,
        function: 'parseExcelSheet',
        sheet: sheetName,
      })
    }
  }

  /**
   * Each rule defined must be used. Unused rules should be deleted from the table
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param severityStartRow {number} The start row of the severities
   * @param sheetEndColumn {number} The last column of the sheet
   * @param rules {object} All the existing rules stored by there rule name
   */
  async checkForUnusedRules({
    sheetName,
    importer,
    severityStartRow,
    sheetEndColumn,
    rules,
  }) {
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')
    assert(severityStartRow > 0)
    assert(sheetEndColumn > 0)
    assert(rules)

    const usedRules = {}

    for (let col = START_COLUMN + 2; col <= sheetEndColumn; col++) {
      const ruleName = importer.cellValue(sheetName, col, START_ROW + 1)
      usedRules[ruleName] = 1

      if (rules[ruleName] === undefined) {
        await this.logger.error({
          message: `The rule '${ruleName}' does not exists in the rule section`,
          function: 'checkForUnusedRules',
          sheet: sheetName,
        })
      }

      let hasValue = false
      for (let row = START_ROW + 2; row < severityStartRow; row++) {
        const val = importer.cellValue(sheetName, col, row)
        if (val !== undefined) {
          hasValue = true
        }
      }

      if (!hasValue) {
        await this.logger.error({
          message: `The rule '${ruleName}' is not used`,
          function: 'checkForUnusedRules',
          sheet: sheetName,
        })
      }
    }

    // now check that all the defined rules are also used
    for (const ruleName of Object.keys(rules)) {
      if (usedRules[ruleName] === undefined) {
        await this.logger.error({
          message: `The defined rule '${ruleName}' in the rule section is not used`,
          function: 'checkForUnusedRules',
          sheet: sheetName,
        })
      }
    }
  }

  /**
   * Parses the fields out of the Spreadsheet. This is the section where
   * the fields of the interface are defined
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param severityStartRow {number} The start row of the severities
   * @param ruleStartRow {number} The start row of the rules
   * @param sheetEndColumn {number} The last column of the sheet
   * @return data {object} on object with the fields and the fieldOrder
   */
  async parseFields({
    sheetName,
    importer,
    severityStartRow,
    ruleStartRow,
    sheetEndColumn,
  }) {
    const self = this
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')
    assert(severityStartRow > 0)
    assert(ruleStartRow > 0)
    assert(sheetEndColumn > 0)

    /**
     * Returns the severity for a given column
     * @param column {number} The column for which to get the severity
     * @return severity {string} The severity for this field
     */
    async function getSeverity(column) {
      // console.log(`parseExcelSheet/getSeverity: getSeverity for column=${column}`);

      let severity
      for (let i = severityStartRow + 1; i < ruleStartRow; i++) {
        const val = importer.cellValue(sheetName, column, i)
        if (val !== undefined) {
          if (severity === undefined) {
            severity = importer.cellValue(sheetName, START_COLUMN, i)
          } else {
            await self.logger.error({
              message: `The rule in column '${column}' has more than one severity asigned`,
              function: 'parseFields/getSeverity',
              row: i,
              sheet: sheetName,
            })
          }
        }
      }

      if (severity === undefined) {
        await self.logger.error({
          message: `The rule in column '${column}' has no severity asigned`,
          function: 'parseFields/getSeverity',
          sheet: sheetName,
        })
      }
      return severity
    }

    /**
     * Returns the complete field for a given row
     * @param row {number} The row to read
     * @return field {object} The field object
     */
    async function getField(row) {
      // console.log(`parseExcelSheet/getField: getField for row=${row}`);

      const name = importer.cellValue(sheetName, START_COLUMN, row)
      const fieldNameInternal = importer.cellValue(
        sheetName,
        START_COLUMN + 1,
        row
      )
      const rules = []

      if (name === undefined && fieldNameInternal === undefined) {
        // the field name is mandatory field
        await self.logger.error({
          message: `In the row '${row}' there is no field name defined`,
          function: 'parseFields.getField',
          row,
          sheet: sheetName,
        })
      } else {
        // now iterate the rules by column for one field
        for (let col = START_COLUMN + 2; col <= sheetEndColumn; col++) {
          const ruleName = importer.cellValue(sheetName, col, START_ROW + 1)
          const value = importer.cellValue(sheetName, col, row)

          if (value !== undefined) {
            const severity = await getSeverity(col)
            const rule = { ruleName, value, severity }
            rules.push(rule)
          }
        }

        if (rules.length === 0) {
          await self.logger.error({
            message: `No rules defined for the field '${fieldNameInternal}'`,
            function: 'parseFields.getField',
            row,
            sheet: sheetName,
          })
        }

        const field = { name, fieldNameInternal, rules }
        return field
      }
      return undefined
    }

    const fieldOrder = []
    const fields = {}

    let row = START_ROW + 2
    while (row < severityStartRow) {
      const field = await getField(row)
      if (field !== undefined) {
        fieldOrder.push(field.name)
        fields[field.name] = field
      }
      row++
    }

    return { fieldOrder, fields }
  }

  /**
   * Load the rules defined in the rule section
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param severityStartRow {number} The severity start row
   * @param ruleStartRow {number} The rule start row
   * @param sheetEndColumn {number} The last column of the sheet
   * @return severities {map} A map of the existing severities
   */
  async parseSeverities({
    sheetName,
    importer,
    severityStartRow,
    ruleStartRow,
    sheetEndColumn,
  }) {
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')
    assert(severityStartRow > 0)
    assert(ruleStartRow > 0)

    // console.log(`parseSeverities:`);

    let row = severityStartRow + 1
    const severities = new Set()
    while (row < ruleStartRow) {
      // console.log(`parseSeverities: row=${row}`);

      const severity = importer.cellValue(sheetName, START_COLUMN, row)

      if (severity === undefined) {
        // empty rows are an error
        await this.logger.error({
          message: `In the row '${row}' is no severity name defined`,
          function: 'parseSeverities',
          row,
          sheet: sheetName,
        })
      } else if (severities.has(severity)) {
        // this severity is double defined
        await this.logger.error({
          message: `The severity '${severity}' is double defined`,
          function: 'parseSeverities',
          row,
          sheet: sheetName,
        })
      } else {
        // check that the severitiy has a minimum of one assigned rule
        let hasVal = false
        for (let col = START_COLUMN + 2; col <= sheetEndColumn; col++) {
          const val = importer.cellValue(sheetName, col, row)
          if (val !== undefined) {
            hasVal = true
          }
        }
        if (!hasVal) {
          await this.logger.error({
            message: `The severity '${severity}' is not used`,
            function: 'parseSeverities',
            row,
            sheet: sheetName,
          })
        }
      }

      severities.add(severity)
      row++
    }

    return severities
  }

  /**
   * Load the rules defined in the rule section
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @param ruleStart {number} The rule start row
   * @param endRow {number} The last row of the sheet
   * @return rules {object} An object with the rules
   */
  async parseRules({ sheetName, importer, ruleStartRow, endRow }) {
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')
    assert(ruleStartRow > 0)
    assert(endRow > 0)

    // console.log(`parseRules:`);

    const rules = {}

    let row = ruleStartRow + 1
    while (row < endRow) {
      // console.log(`parseRules: row=${row}`);

      const ruleName = importer.cellValue(sheetName, START_COLUMN, row)
      const shortDesc = importer.cellValue(sheetName, START_COLUMN + 1, row)
      const longDesc = importer.cellValue(sheetName, START_COLUMN + 2, row)

      if (shortDesc === undefined) {
        await this.logger.error({
          message: `The short description for the rule '${ruleName}' is not defined`,
          function: 'parseRules',
          row,
          sheet: sheetName,
        })
      }
      if (longDesc === undefined) {
        await this.logger.warning({
          message: `The long description for the rule '${ruleName}' is not defined`,
          function: 'parseRules',
          row,
          sheet: sheetName,
        })
      }

      if (ruleName === undefined) {
        await this.logger.error({
          message: `The rule name is not defined`,
          function: 'parseRules',
          row,
          sheet: sheetName,
        })
      } else {
        const rule = { ruleName, shortDesc, longDesc }

        if (rules[ruleName] !== undefined) {
          await this.logger.error({
            message: `The rule '${ruleName}' is double defined`,
            function: 'parseRules',
            row,
            sheet: sheetName,
          })
        }

        rules[ruleName] = rule
      }

      row++
    }

    return rules
  }

  /**
   * Checks that the specification contains all the needed sections
   * @param sheetName {string} The name of the sheet
   * @param importer {object} The importer
   * @return rows {object} The following parameters {severityStartRow, ruleStartRow}
   */
  async checkSheetRows(sheetName, importer, endRow) {
    let severityStartRow = 0
    let ruleStartRow = 0
    let row = START_ROW + 1
    while (row < endRow) {
      const val = importer.cellValue(sheetName, START_COLUMN, row)
      if (val === KEY_SEVERITY) {
        severityStartRow = row
      } else if (val === KEY_RULE) {
        ruleStartRow = row
      }
      row++
    }

    if (severityStartRow === 0) {
      await this.logger.error({
        message: `The '${KEY_SEVERITY}' section could not be found`,
        function: 'checkSheetRows',
        sheet: sheetName,
      })
    }
    if (ruleStartRow === 0) {
      await this.logger.error({
        message: `The '${KEY_RULE}' section could not be found`,
        function: 'checkSheetRows',
        sheet: sheetName,
      })
    }

    return { severityStartRow, ruleStartRow }
  }

  /**
   * Parses the sheet to get the last row of the table.
   * @param importer {object} The importer
   * @param sheetName {string} The name of the sheet
   * @return endRow {number} The last row of the table
   */
  getEndColumn(importer, sheetName) {
    assert.ok(sheetName, 'No sheet name given')
    assert.ok(importer, 'No importer given')

    // console.log(`getSheetEndColumn:`);

    const maxEmptyCol = 100
    const row = START_ROW + 1
    let endColumn = 0
    let column = START_COLUMN_RULE
    do {
      // console.log(`getSheetEndColumn: column=${column}`);

      const val = importer.cellValue(sheetName, column, row)
      if (val === undefined) {
        endColumn = column - 1
      }
      column++
    } while (endColumn === 0)

    if (endColumn < START_COLUMN_RULE) {
      // no rules defined
      throw new Error(
        `The specification sheet '${sheetName}' does not contain any rule`
      )
    }

    // check for empty columns
    let emptyColumnDetected = false
    for (let i = endColumn + 1; i < endColumn + maxEmptyCol; i++) {
      const val = importer.cellValue(sheetName, i, row)
      if (val !== undefined && val !== '') {
        // console.log(`getSheetEndColumn: got empty rule name in column =${i}`);
        // console.log(val);
        emptyColumnDetected = true
      }
    }

    if (emptyColumnDetected) {
      throw new Error(
        `The specification sheet '${sheetName}' contains empty rule columns`
      )
    }

    return endColumn
  }
}

/**
 * The model for a specification object
 */
export class SpecificationModel {
  constructor({ name = '' }) {
    this.name = name

    this.fieldOrder = []
    this.fields = {}

    this.severities = []

    this.rules = {}
  }
}

/**
 *  rule : {
 *		<rule_name> : {
 *      short_desc :  ""
 *      long_desc :  ""
 *    }
 *  }
 */

/**
 * field : {
 *	 field_name : "",
 *   field_name_internal : "",
 *   rules : {
 *     <rule_name> : {
 *       val: ""
 *       severity : ""
 *     }
 *   }
 * }
 */
