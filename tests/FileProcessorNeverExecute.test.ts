import path from 'node:path'
import { ImporterXlsx } from '@tlink/importer-xlsx'
import { FileProcessor, ParserDecision } from '../src/index'
import { getLoggerMemory } from '@tlink/logger'
import { TableDecisionInterface } from '@tlink/model-decision'

const FIXTURES = path.join(__dirname, 'fixtures')

const LOGGER = getLoggerMemory()
const parser = new ParserDecision({ logger: LOGGER })
const importer = new ImporterXlsx()

test('load files', async () => {
  LOGGER.clear()

  const fileProcessor = new FileProcessor({ logger: LOGGER })
  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)
  fileProcessor.registerParser('<DECISION_TABLE>', parser)

  const fileNames = getFilenames(['decision/decision_table_neverExecute.xls'])
  await fileProcessor.load(fileNames)

  expect(LOGGER.entries.error).toEqual([])

  let personTable: TableDecisionInterface | undefined
  // let masterTable
  for (const table of fileProcessor.tables) {
    if (table.tableName === 'CreatePerson_mini') {
      personTable = table as TableDecisionInterface
    }
    // if (table.name === 'Master') {
    //   masterTable = table
    // }
  }
  expect(personTable).toBeDefined()
  if (personTable !== undefined) {
    for (const tcKey of Object.keys(personTable.testcases)) {
      const tc = personTable.testcases[tcKey]
      if (tc.testcaseName === '1') {
        expect(tc.neverExecute).toEqual(true)
      }
      if (tc.testcaseName === '2') {
        expect(tc.neverExecute).toEqual(true)
      }
      if (tc.testcaseName === '3') {
        expect(tc.neverExecute).toEqual(false)
      }
    }
  }
})

/**
 * Create a list of full path file names for a given list of names
 * @param names - A list of file names
 */
function getFilenames(names: string[]): string[] {
  const dir = FIXTURES
  const ret: string[] = []
  for (const file of names) {
    ret.push(path.join(dir, file))
  }
  return ret
}
