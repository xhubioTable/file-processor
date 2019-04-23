import path from 'path'
import { ImporterXlsx } from '@xhubiotable/importer-xlsx'

import { FileProcessor, ParserDecision } from '../lib/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

const parser = new ParserDecision({ logger })
const importer = new ImporterXlsx()

test('load file with tags and filter', async done => {
  const fileProcessor = new FileProcessor({ logger })
  await fileProcessor.registerImporter('xlsx', importer)
  await fileProcessor.registerImporter('xls', importer)
  await fileProcessor.registerParser('<DECISION_TABLE>', parser)

  const fileNames = getFilenames(['decision/tag_and_filter.xls'])

  await fileProcessor.load(fileNames)

  expect(logger.entries.error).toEqual([])
  expect(fileProcessor.tables[0].name).toEqual('Person')
  expect(fileProcessor.tables[1].name).toEqual('Address')

  const tablePerson = await parser.parse('Person', importer)
  const tableAddress = await parser.parse('Address', importer)

  expect(tablePerson).toBeDefined()
  expect(tableAddress).toBeDefined()

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
