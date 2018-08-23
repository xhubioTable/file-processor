import assert from 'assert'

import { TableDecision } from '@xhubiotable/model-decision'

/**
 * Converts a specification object into a decision table model.
 */
export default class ParserSpecificationConverter {
  /**
   * Do the conversion
   * @param specification {object} The specification object
   * @return table {object} The created decision table model
   */
  convert(specification) {
    assert.ok(specification, 'No specification object given')

    const table = new TableDecision()

    this._createExecutionMultirowSection(table)
    const secDataObject = this._createSecondaryDataSection(specification, table)
    const rowIdObjects = this._createPrimaryDataSection(specification, table)
    this._createSummarySection(table)
    this._createSeveritySection(specification, table)

    this._createTestcases(table, rowIdObjects, secDataObject)

    return table
  }

  /**
   * Creates the default testcases for this decision table
   * @param table {object} The decision table model
   * @param rowIdObjects {array} An array with all the primary data rowIdObjects
   * @param secDataObject {object} The secondary rowidObjewct
   */
  _createTestcases(table, rowIdObjects, secDataObject) {
    assert(table)
    assert(table)
    assert(table)

    let tcName = 0

    // Iterate the fields of the primary data
    for (let i = 0; i < rowIdObjects.length; i++) {
      const mainObject = rowIdObjects[i]
      mainObject.error.forEach(rowId => {
        tcName++
        const tc = table.addNewTestcase(tcName)
        tc.data[rowId] = 'x'

        // set for all the following fields all the 'e'
        for (let j = i + 1; j < rowIdObjects.length; j++) {
          const nextObject = rowIdObjects[j]
          nextObject.error.forEach(rowIdNext => {
            tc.data[rowIdNext] = 'e'
          })
          nextObject.valid.forEach(rowIdNext => {
            tc.data[rowIdNext] = 'a'
          })
        }

        if (i > 0) {
          // set for all the previous fields all the valid ones to 'e'
          for (let k = 0; k < i; k++) {
            const nextObject = rowIdObjects[k]
            nextObject.valid.forEach(rowIdPrev => {
              tc.data[rowIdPrev] = 'a'
            })
          }
        }

        // set the secundary data to 'a'
        secDataObject.valid.forEach(rowIdSec => {
          tc.data[rowIdSec] = 'a'
        })
      })
    }
  }

  /**
   * Creates the primary data section and returns an array
   * of rowIdObjects
   * @param specification {object} The specification object
   * @param table {object} The decision table model
   * @return rowIdObjects {array} an array of rowIdObjects
   */
  _createPrimaryDataSection(specification, table) {
    assert(specification)
    assert(table)

    // Stores the field Ids
    // const fields = {};
    const section = table.addNewFieldSection('Primary Data')

    const rowIdObjects = []

    Object.keys(specification.fields).forEach(fieldName => {
      const fieldData = specification.fields[fieldName]
      // Stores the rules by there name
      const rules = {}

      if (fieldData.rules !== undefined) {
        fieldData.rules.forEach(rule => {
          let ruleName = rule.ruleName
          if (typeof ruleName === 'string') {
            ruleName = ruleName.toUpperCase()
          }
          rules[ruleName] = rule
        })
      }

      // get all the equivalence classes for this field
      const equivalenceClasses = this._getClassesForRules(
        specification,
        table,
        fieldData,
        rules
      )

      // create the field in the decision table model
      const rowIdObj = this._createFieldSubSection(
        section,
        fieldName,
        equivalenceClasses
      )
      rowIdObjects.push(rowIdObj)
    })

    return rowIdObjects
  }

  /**
   * Create one field of the primary data section. Also adds the rowId to the class.
   * Returns an object of the following format:
   * obj = {
   *     valid : [rowIds]
   *     error : [rowIds]
   * }
   *
   * @param section {object} The primary data field section
   * @param fieldName {string} The name of the field
   * @param classes {object} The equivalenceClasses for this field
   * @return rowIdObj {object} The object containing all the rowIds by there type
   */
  _createFieldSubSection(section, fieldName, classes) {
    const field = section.createNewField()
    field.name = fieldName

    const rowIdObj = {
      error: [],
      valid: [],
    }
    ;['valid', 'error'].forEach(type => {
      Object.keys(classes[type]).forEach(className => {
        const clazz = classes[type][className]
        const comment = clazz.comment
        const rowId = field.createNewRow()

        rowIdObj[type].push(rowId)

        clazz.rowid = rowId
        field.equivalenceClasses[rowId] = `${type} ${className}`
        field.comments[rowId] = comment.join(', ')
      })
    })

    return rowIdObj
  }

  /**
   * Create all the equivalenceClasses for one field
   * @param specification {object} The specification object. Only the Rules description is neded
   * @param table {object} The decision table model
   * @param fieldData {object} The field data from the specification model
   * @param fieldRules {object} All the rules for this field
   * @return classes {object} The created equivalenceClasses for this field
   */
  _getClassesForRules(specification, table, fieldData, fieldRules) {
    // console.log('--------------------------');
    // console.log(JSON.stringify(fieldRules, null, 2));

    // These rules will be handled special
    const predefined = {
      PK: 1,
      TYPE: 1,
      C1: 1,
      C2: 1,
      C3: 1,
      C4: 1,
      C5: 1,
    }

    const classes = {
      valid: {
        'not null': {
          comment: ['Not Empty'],
        },
      },
      error: {},
    }

    if (fieldRules.C1 !== undefined) {
      // the field is mandatory
      classes.error.C1 = fieldRules.C1.severity
      classes.error.C1 = { comment: ['Mandatory Field'] }
    } else {
      // empty is also valid
      classes.valid['null'] = { comment: ['Empty'] }
    }

    if (fieldRules.C2 !== undefined) {
      classes.valid['exactly min'] = { comment: [] }
    }

    if (fieldRules.C3 !== undefined) {
      classes.valid['exactly max'] = { comment: [] }
    }

    if (fieldRules.C4 !== undefined) {
      // the field is an email
      classes.error.C4 = fieldRules.C4.severity
      classes.error.C4 = { comment: ['Must be valid email'] }
      classes.valid['not null'].comment.push('Valid Email')
    }

    if (fieldRules.C5 !== undefined) {
      // regex
      classes.error.C5 = fieldRules.C5.severity
      classes.error.C5 = { comment: ['Must match the given RegEx'] }
      classes.valid['not null'].comment.push('Matches RegEx')
    }

    if (fieldRules.TYPE !== undefined) {
      const lcType = fieldRules.TYPE.value.toLowerCase()

      // ---------------------------
      // String
      // ---------------------------
      if (lcType === 'string') {
        // if there is no regex and no email class defined
        // add some other valid strings
        if (fieldRules.C4 === undefined && fieldRules.C5 === undefined) {
          const validStrings = ['naughty strings', 'number', 'float', 'boolean']
          validStrings.forEach(name => {
            classes.valid[name] = { comment: ['name'] }
          })
        }

        if (fieldRules.C2 !== undefined) {
          // minimum string length
          classes.error.C2 = fieldRules.C2.severity
          classes.error.C2 = {
            comment: [`Fall below min ${fieldRules.C2.value} chars`],
          }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Min ${fieldRules.C2.value} chars`)
          })
        }

        if (fieldRules.C3 !== undefined) {
          // maximum string length
          classes.error.C3 = fieldRules.C2.severity
          classes.error.C3 = {
            comment: [`Exeeds max ${fieldRules.C3.value} chars`],
          }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Max ${fieldRules.C3.value} chars`)
          })
        }
      }

      // ---------------------------
      // Date
      // ---------------------------
      if (lcType === 'date') {
        if (fieldRules.C2 !== undefined) {
          // minimum date
          classes.error.C2 = fieldRules.C2.severity
          classes.error.C2 = {
            comment: [`Fall below min ${fieldRules.C2.value} date`],
          }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Min ${fieldRules.C2.value} date`)
          })
        }
        if (fieldRules.C3 !== undefined) {
          // maximum string length
          classes.error.C3 = fieldRules.C2.severity
          classes.error.C3 = {
            comment: [`Exeeds max ${fieldRules.C3.value} date`],
          }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Max ${fieldRules.C3.value} date`)
          })
        }
      }

      // ---------------------------
      // Integer or float
      // ---------------------------
      if (lcType === 'integer' || lcType === 'float') {
        if (fieldRules.C2 !== undefined) {
          // minimum date
          classes.error.C2 = fieldRules.C2.severity
          classes.error.C2 = {
            comment: [`Fall below min ${fieldRules.C2.value}`],
          }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Min ${fieldRules.C2.value}`)
          })
        }
        if (fieldRules.C3 !== undefined) {
          // maximum string length
          classes.error.C3 = fieldRules.C2.severity
          classes.error.C3 = { comment: [`Exeeds max ${fieldRules.C3.value}`] }
          Object.keys(classes.valid).forEach(name => {
            classes.valid[name].comment.push(`Max ${fieldRules.C3.value}`)
          })
        }
      }

      // ---------------------------
      // Boolean
      // ---------------------------
      if (lcType === 'boolean') {
        classes.error.boolean = fieldRules.TYPE.severity
        classes.error.boolean = { comment: ['Not a boolean value'] }
      }
    }

    // add all the custom rules
    Object.keys(fieldRules).forEach(ruleName => {
      if (predefined[ruleName] === undefined) {
        const comment = specification.rules[ruleName].shortDesc
        classes.error[ruleName] = { comment: [comment] }
      }
    })

    return classes
  }

  /**
   * Creates a multirow section which defines if a testcase should be executed or is testdata only
   * @param table {object} The decision table model
   */
  _createExecutionMultirowSection(table) {
    assert(table)

    const section = table.addNewMultiRowSection('Execute')

    const rowIdExe = section.createNewRow()
    const rowIdData = section.createNewRow()

    section.keys[rowIdExe] = 'Testcase'
    section.comments[rowIdExe] = 'This is a testcase which should be executed'

    section.keys[rowIdData] = 'Data only'
    section.comments[rowIdData] =
      'This is only data referenced from other testcases'
  }

  /**
   * Creates a multirow section for the serverities
   * @param specification {object} The specification object
   * @param table {object} The decision table model
   */
  _createSeveritySection(specification, table) {
    assert(specification)
    assert(table)

    const section = table.addNewMultiRowSection('Execute')

    specification.severities.forEach(name => {
      const rowId = section.createNewRow()
      section.keys[rowId] = name
    })
  }

  /**
   * Creates a secondary data section if the specification has a primary key rule.
   * Adds two fields to it
   * Returns an object of the following format:
   * rowIdObj = {
   *     valid : [rowIds]
   *     error : [rowIds]
   * }
   * @param specification {object} The specification object
   * @param table {object} The decision table model
   * @return rowIdObj {object} An object with the rowIds
   */
  _createSecondaryDataSection(specification, table) {
    assert(specification)
    assert(table)

    const rowIdObj = {
      valid: [],
      error: [],
    }

    if (specification.rules.PK !== undefined) {
      const section = table.addNewFieldSection('Secondary Data')
      const field1 = section.createNewField()
      field1.name = specification.name

      const rowIdExist = field1.createNewRow()
      const rowIdNew = field1.createNewRow()

      rowIdObj.valid.push(rowIdExist)
      rowIdObj.valid.push(rowIdNew)

      field1.equivalenceClasses[rowIdExist] = 'Record already exists'
      field1.comments[rowIdExist] =
        'There is already a record with the same primary key'

      field1.equivalenceClasses[rowIdNew] = 'Record is new'
      field1.comments[rowIdNew] = 'There is no record with this primary key'
    }

    return rowIdObj
  }

  /**
   * Creates the summary section for this table
   * @param table {object} The decision table model
   */
  _createSummarySection(table) {
    table.addNewSummarySection('Summary')
  }
}
