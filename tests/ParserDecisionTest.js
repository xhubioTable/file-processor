import path from 'path'

import { ParserDecision } from '../lib/index'
import { getLoggerMemory } from '@xhubioTable/logger'

const fixturesDir = path.join(__dirname, 'fixtures')
const dataFile = path.join(fixturesDir, 'decision/descision_table.xls')
const dataFileSingleRow = path.join(
  fixturesDir,
  'decision/descission_table_singleRow.xls'
)
const dataFileSingleRowSections = path.join(
  fixturesDir,
  'decision/descission_table_mini_singleRowSection.xls'
)

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

describe('Importer Methods Tests', () => {
  const importer = new ParserDecision()

  const valuesNum = [
    ['', 1],
    ['dd3', 1],
    ['4', 4],
    ['-3', 1],
    ['  3', 3],
    ['""', 1],
    ['3.45', 3],
  ]
  for (const testValue of valuesNum) {
    test(`_getMultiplicityFromValue for '${testValue[0]}'`, () => {
      const res = importer._getMultiplicityFromValue(testValue[0])
      expect(res).toBe(testValue[1])
    })
  }

  const valuesBool = [
    ['1', true],
    ['t', true],
    ['true', true],
    ['T', true],
    ['JA', true],
    ['OK', true],
    ['Yes', true],
    ['y', true],
    ['', false],
    [undefined, false],
    ['A', false],
    ['F', false],
    ['No', false],
    ['111', false],
    ['2', false],
    [' ', false],
  ]
  for (const testValue of valuesBool) {
    test(`_getBoolean for '${testValue[0]}'`, () => {
      const res = importer._getBoolean(testValue[0])
      expect(res).toEqual(testValue[1])
    })
  }
})

describe('Import decision table Tests', () => {
  test('Test the instance name', () => {
    const importer = new ParserDecision()
    importer.load(dataFile)

    const table = importer.tables['CreatePerson']
    logger.clear()

    // update the calculation
    table.calculate()

    // Print the table json
    // eslint-disable-next-line no-sync
    // jsonfile.writeFileSync('./tests/volatile/table_createPerson.json', table, { spaces: 2 });

    // validation test
    logger.clear()
    const issues = table.validate()

    issues.forEach(issue => {
      delete issue.section
      delete issue.testcase
    })

    // console.log('###################################');
    // console.log(JSON.stringify(issues, null, 2))
    // console.log('###################################');

    expect(1).toEqual(1)
  })
})

describe('Import decision table with single row sections', () => {
  test('xxxx', () => {
    logger.clear()
    const importer = new ParserDecision()

    try {
      importer.load(dataFileSingleRow)
    } catch (e) {
      console.log(e)
      console.log(logger.entries)
    }
    const table = importer.tables['CreatePerson_mini']

    // update the calculation
    table.calculate()
    // Print the table json
    // eslint-disable-next-line no-sync
    // jsonfile.writeFileSync('./tests/table_createPersonSingleRow.json', table, {
    //   spaces: 2,
    // })

    // validation test
    logger.clear()
    const issues = table.validate()

    issues.forEach(issue => {
      delete issue.section
      delete issue.testcase
    })

    // console.log('###################################');
    // console.log(JSON.stringify(issues, null, 2))
    // console.log('###################################');

    expect(1).toEqual(1)
  })
})

test.only('import single row sections', () => {
  logger.clear()
  const importer = new ParserDecision()

  try {
    importer.load(dataFileSingleRowSections)
  } catch (e) {
    console.log(e)
    console.log(logger.entries)
  }
  const table = importer.tables['CreatePerson_mini']
  debugger
  // update the calculation
  table.calculate()
  // Print the table json
  // eslint-disable-next-line no-sync
  // jsonfile.writeFileSync(
  //   './tests/volatile/descission_table_singleRow.json',
  //   table,
  //   {
  //     spaces: 2,
  //   }
  // )

  // validation test
  logger.clear()

  expect(1).toEqual(1)
})
