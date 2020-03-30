import path from 'path'
import { ImporterXlsx } from '@xhubiotable/importer-xlsx'

import { FileProcessor, ParserDecision } from '../src/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const LOGGER = getLoggerMemory()

const parser = new ParserDecision()
const importer = new ImporterXlsx()

test('load files', async (done) => {
  LOGGER.clear()

  const fileProcessor = new FileProcessor({ logger: LOGGER })
  await fileProcessor.registerImporter('xlsx', importer)
  await fileProcessor.registerImporter('xls', importer)
  await fileProcessor.registerParser('<DECISION_TABLE>', parser)

  const fileNames = getFilenames(['decision/decision_table_neverExecute.xls'])
  await fileProcessor.load(fileNames)

  expect(LOGGER.entries.error).toEqual([])

  let personTable
  // let masterTable
  for (const table of fileProcessor.tables) {
    if (table.name === 'CreatePerson_mini') {
      personTable = table
    }
    // if (table.name === 'Master') {
    //   masterTable = table
    // }
  }

  for (const tcKey of Object.keys(personTable.testcases)) {
    const tc = personTable.testcases[tcKey]
    if (tc.name === '1') {
      expect(tc.neverExecute).toEqual(true)
    }
    if (tc.name === '2') {
      expect(tc.neverExecute).toEqual(true)
    }
    if (tc.name === '3') {
      expect(tc.neverExecute).toEqual(false)
    }
  }

  done()
})

/**
 * Create a list of full path file names for a given list of names
 * @param names {array} A list of names
 */
function getFilenames(names) {
  const dir = path.join(__dirname, 'fixtures')
  const ret = []
  for (const file of names) {
    ret.push(path.join(dir, file))
  }
  return ret
}
