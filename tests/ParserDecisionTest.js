import path from 'path'

import { ImporterXlsx } from '@xhubiotable/importer-xlsx'
import { ParserDecision } from '../lib/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const fixturesDir = path.join(__dirname, 'fixtures')
const dataFile = path.join(fixturesDir, 'decision/decision_table.xls')
const dataFileDoubleField = path.join(fixturesDir, 'decision/double_field.xlsx')
// const dataFileMini = path.join(fixturesDir, 'decision/decision_table_mini.xls')
const dataFileSingleRow = path.join(
  fixturesDir,
  'decision/decision_table_singleRow.xls'
)
const dataFileSingleRowSections = path.join(
  fixturesDir,
  'decision/decision_table_mini_singleRowSection.xls'
)

const dataFileMissingSectionType = path.join(
  fixturesDir,
  'decision',
  'table_missing_section.xlsx'
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
  test('Test the table content', async done => {
    // just test some content elements

    logger.clear()

    const importer = new ImporterXlsx()
    importer.loadFile(dataFile)
    const parser = new ParserDecision({ logger })
    const table = await parser.parse('CreatePerson', importer)

    expect(table.name).toEqual('CreatePerson')
    expect(table.sectionOrder.length).toBe(7)
    const sectionId0 = table.sectionOrder[0]
    const sectionId1 = table.sectionOrder[1]
    const sectionId2 = table.sectionOrder[2]
    // const sectionId3 = table.sectionOrder[3]
    // const sectionId4 = table.sectionOrder[4]
    // const sectionId5 = table.sectionOrder[5]
    // const sectionId6 = table.sectionOrder[6]

    expect(table.sections[sectionId0]).toMatchObject({
      comments: {},
      mandatory: false,
      multiInstancesAllowed: true,
      multiple: true,
      name: 'Execute',
      others: {},
      sectionType: 'MultiRowSection',
    })

    expect(table.sections[sectionId1]).toMatchObject({
      comments: {},
      mandatory: false,
      multiInstancesAllowed: true,
      multiple: true,
      name: 'Group',
      others: {},
      sectionType: 'MultiRowSection',
    })

    const section2 = table.sections[sectionId2]
    const se2DataRow1 = section2.dataRows[0]
    const se2HeaderRow = section2.headerRow

    expect(section2).toMatchObject({
      mandatory: true,
      multiInstancesAllowed: true,
      multiple: true,
      name: 'Secondary data',
      sectionType: 'FieldSection',
      tdgMandatory: false,
    })

    const subSection = section2.subSections[se2DataRow1]
    expect(subSection.dataRows.length).toBe(2)
    subSection.dataRows = []
    expect(Object.keys(subSection.equivalenceClasses).length).toBe(2)
    subSection.equivalenceClasses = {}
    expect(subSection).toMatchObject({
      comments: {},
      dataRows: [],
      equivalenceClasses: {},
      headerRow: se2DataRow1,
      mandatory: true,
      multiInstancesAllowed: true,
      multiple: true,
      name: 'person',
      parent: se2HeaderRow,
      sectionType: 'FieldSubSection',
      tdgMandatory: false,
      tdgs: {},
    })

    done()
  })

  test('Test double field name', async done => {
    logger.clear()

    const importer = new ImporterXlsx()
    importer.loadFile(dataFileDoubleField)
    const parser = new ParserDecision({ logger })
    await parser.parse('sheet1', importer)

    const logs = logger.entries.error
    delete logs[0].time
    expect(logs).toEqual([
      {
        column: 1,
        function: 'handleFieldSection',
        level: 'error',
        message:
          "Double FieldSubSection name 'friend email' in section 'Primary data' in table 'sheet1'",
        row: 14,
      },
    ])

    done()
  })
})

test('Import decision table with single row sections', async done => {
  logger.clear()

  const importer = new ImporterXlsx()
  importer.loadFile(dataFileSingleRow)
  const parser = new ParserDecision({ logger })
  const table = await parser.parse('CreatePerson_mini', importer)

  // update the calculation
  table.calculate()
  // Print the table json
  // eslint-disable-next-line no-sync
  // jsonfile.writeFileSync('./tests/table_createPersonSingleRow.json', table, {
  //   spaces: 2,
  // })

  expect(logger.entries.error).toEqual([])

  const issues = table.validate()
  expect(issues).toEqual([])
  done()
})

test('import single row sections', async done => {
  logger.clear()

  const importer = new ImporterXlsx()
  importer.loadFile(dataFileSingleRowSections)
  const parser = new ParserDecision({ logger })
  const table = await parser.parse('CreatePerson_mini', importer)

  // update the calculation
  table.calculate()

  expect(logger.entries.error).toEqual([])
  done()
})

test('import table with missing section type', async done => {
  logger.clear()

  const importer = new ImporterXlsx()
  importer.loadFile(dataFileMissingSectionType)
  const parser = new ParserDecision({ logger })

  try {
    await parser.parse('table_missing_sectionType', importer)
  } catch (e) {
    expect(e.message).toEqual(
      'Could not parse the sheet beacause of the found errors!'
    )
  }

  for (const err of logger.entries.error) {
    delete err.time
  }

  expect(logger.entries.error).toEqual([
    {
      level: 'error',
      message:
        "If a name is entered in column '0' a sectionType must be probvided in column '1'",
      function: 'getNextSection',
      row: 50,
      column: 0,
    },
    {
      level: 'error',
      message:
        "If a name is entered in column '0' a sectionType must be probvided in column '1'",
      function: 'getNextSection',
      row: 51,
      column: 0,
    },
  ])
  done()
})

test('import table with missing subSection type', async done => {
  logger.clear()

  const importer = new ImporterXlsx()
  importer.loadFile(dataFileMissingSectionType)
  const parser = new ParserDecision({ logger })

  try {
    await parser.parse('table_missing_subSectionType', importer)
  } catch (e) {
    expect(e.message).toEqual(
      'Could not parse the sheet beacause of the found errors!'
    )
  }

  for (const err of logger.entries.error) {
    delete err.time
  }

  expect(logger.entries.error).toEqual([
    {
      level: 'error',
      message:
        "If a name is entered in column '0' a sectionType must be probvided in column '1'",
      function: 'getNextSection',
      row: 35,
      column: 0,
    },
  ])
  done()
})
