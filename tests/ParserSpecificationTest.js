import path from 'path'

import { ImporterXlsx } from '@xhubiotable/importer-xlsx'
import { ParserSpecification } from '../src/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const fixturesDir = path.join(__dirname, 'fixtures')
const filename = path.join(fixturesDir, 'specification/specification_table.xls')

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

let errors

const importer = new ImporterXlsx()
importer.loadFile(filename)
const parser = new ParserSpecification({ logger })

test('Specification sheet', async () => {
  logger.clear()
  await parser.parse('Specification', importer)
  errors = logger.entries.error
  expect(errors.length).toEqual(0)
})

test('Specification_mini sheet', async () => {
  logger.clear()
  const model = await parser.parseSpecification('Specification_mini', importer)
  expect(model).toEqual(MINI_SPEC)
})

test('missing_severity_section sheet', async () => {
  logger.clear()
  await parser.parse('missing_severity_section', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'checkSheetRows',
      level: 'error',
      message: `The 'Severity' section could not be found`,
      sheet: 'missing_severity_section',
    },
  ])
})

test('missing_rule_section sheet', async () => {
  logger.clear()
  await parser.parse('missing_rule_section', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'checkSheetRows',
      level: 'error',
      message: `The 'Rule' section could not be found`,
      sheet: 'missing_rule_section',
    },
  ])
})

test('rule_without_severity sheet', async () => {
  logger.clear()
  await parser.parse('rule_without_severity', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseFields/getSeverity',
      level: 'error',
      message: `The rule in column '10' has no severity asigned`,
      sheet: 'rule_without_severity',
    },
  ])
})

test('rule_with_more_severity sheet', async () => {
  logger.clear()
  await parser.parse('rule_with_more_severity', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseFields/getSeverity',
      level: 'error',
      message: `The rule in column '10' has more than one severity asigned`,
      row: 15,
      sheet: 'rule_with_more_severity',
    },
  ])
})

test('unused_severity sheet', async () => {
  logger.clear()
  await parser.parse('unused_severity', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseSeverities',
      level: 'error',
      message: `The severity 'Error' is not used`,
      row: 15,
      sheet: 'unused_severity',
    },
  ])
})

test('double_severity sheet', async () => {
  logger.clear()
  await parser.parse('double_severity', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseSeverities',
      level: 'error',
      message: `The severity 'Warning' is double defined`,
      row: 16,
      sheet: 'double_severity',
    },
  ])
})

test('empty_row_1 sheet', async () => {
  logger.clear()
  await parser.parse('empty_row_1', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseFields.getField',
      level: 'error',
      message: `In the row '8' there is no field name defined`,
      row: 8,
      sheet: 'empty_row_1',
    },
  ])
})

test('empty_row_2 sheet', async () => {
  logger.clear()
  await parser.parse('empty_row_2', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseSeverities',
      level: 'error',
      message: `In the row '15' is no severity name defined`,
      row: 15,
      sheet: 'empty_row_2',
    },
  ])
})

test('empty_row_3 sheet', async () => {
  logger.clear()
  await parser.parse('empty_row_3', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(2)
  delete errors[0].time
  delete errors[1].time
  /* eslint-disable indent */
  expect(errors).toEqual([
    {
      function: 'parseRules',
      level: 'error',
      message: `The short description for the rule 'undefined' is not defined`,
      row: 23,
      sheet: 'empty_row_3',
    },
    {
      function: 'parseRules',
      level: 'error',
      message: 'The rule name is not defined',
      row: 23,
      sheet: 'empty_row_3',
    },
  ])
  /* eslint-enable indent */
})

test('rule_does_not_exists sheet', async () => {
  logger.clear()
  await parser.parse('rule_does_not_exists', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'checkForUnusedRules',
      level: 'error',
      message: `The rule '5' does not exists in the rule section`,
      sheet: 'rule_does_not_exists',
    },
  ])
})

test('empty_rule_name sheet', async () => {
  logger.clear()
  await parser.parse('empty_rule_name', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  delete errors[0].stack

  expect(errors).toEqual([
    {
      function: 'parse',
      level: 'error',
      message: `The specification sheet 'empty_rule_name' contains empty rule columns`,
      sheet: 'empty_rule_name',
    },
  ])
})

test('unused_rule_1 sheet', async () => {
  logger.clear()
  await parser.parse('unused_rule_1', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'checkForUnusedRules',
      level: 'error',
      message: `The rule '3' is not used`,
      sheet: 'unused_rule_1',
    },
  ])
})

test('unused_rule_2 sheet', async () => {
  logger.clear()
  await parser.parse('unused_rule_2', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'checkForUnusedRules',
      level: 'error',
      message: `The defined rule '5' in the rule section is not used`,
      sheet: 'unused_rule_2',
    },
  ])
})

test('double_rule sheet', async () => {
  logger.clear()
  await parser.parse('double_rule', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseRules',
      level: 'error',
      message: `The rule '4' is double defined`,
      row: 28,
      sheet: 'double_rule',
    },
  ])
})

test('row_without_rule sheet', async () => {
  logger.clear()
  await parser.parse('row_without_rule', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  expect(errors).toEqual([
    {
      function: 'parseFields.getField',
      level: 'error',
      message: `No rules defined for the field 'email'`,
      row: 4,
      sheet: 'row_without_rule',
    },
  ])
})

test('no_end_row sheet', async () => {
  logger.clear()
  await parser.parse('no_end_row', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  delete errors[0].stack
  expect(errors).toEqual([
    {
      function: 'parse',
      level: 'error',
      message: `SheetEndRow: Could not find the end sheet identifier '<END>' in the sheet 'no_end_row' in column '0'`,
      sheet: 'no_end_row',
    },
  ])
})

test('no_rule sheet', async () => {
  logger.clear()
  await parser.parse('no_rule', importer)
  errors = logger.entries.error

  expect(errors.length).toEqual(1)
  delete errors[0].time
  delete errors[0].stack
  expect(errors).toEqual([
    {
      function: 'parse',
      level: 'error',
      message: `The specification sheet 'no_rule' does not contain any rule`,
      sheet: 'no_rule',
    },
  ])
})

// test('Test the instance name', async done => {
//   const specification = importer.specifications['Specification'];
//   logger.clear();
//   // -----------------------------
//   // Print the table json
//   // -----------------------------
//   // eslint-disable-next-line no-sync
//   jsonfile.writeFileSync('./tests/volatile/specification.json', specification, { spaces: 2 });
//   assert.equal(1, 1);
// });

const MINI_SPEC = {
  fieldOrder: ['first-name', 'last-name'],
  fields: {
    'first-name': {
      fieldNameInternal: 'first-name',
      name: 'first-name',
      rules: [
        {
          ruleName: 'PK',
          severity: 'Abort',
          value: 'x',
        },
        {
          ruleName: 'Type',
          severity: 'Warning',
          value: 'String',
        },
        {
          ruleName: 'C1',
          severity: 'Abort',
          value: 'x',
        },
      ],
    },
    'last-name': {
      fieldNameInternal: 'last-name',
      name: 'last-name',
      rules: [
        {
          ruleName: 'PK',
          severity: 'Abort',
          value: 'x',
        },
        {
          ruleName: 'Type',
          severity: 'Warning',
          value: 'String',
        },
        {
          ruleName: 'C1',
          severity: 'Abort',
          value: 'x',
        },
      ],
    },
  },
  name: 'Specification_mini',
  rules: {
    C1: {
      longDesc: 'This is a mandatory field. It must be provided',
      ruleName: 'C1',
      shortDesc: 'mandatory',
    },
    PK: {
      longDesc:
        'This field is part of the object identiy. This is not a kind of primary key like it is used in a database',
      ruleName: 'PK',
      shortDesc: 'Primary key',
    },
    Type: {
      longDesc:
        'The type of this field. {String, Integer, Float, Date, Boolean)',
      ruleName: 'Type',
      shortDesc: 'Field Type',
    },
  },
  severities: ['Abort', 'Warning'],
}
