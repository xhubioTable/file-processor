import path from 'node:path'
import { ImporterXlsx } from '@tlink/importer-xlsx'
import { FileProcessor, ParserDecision } from '../src/index'
import { getLoggerMemory } from '@tlink/logger'

const FIXTURES = path.join(__dirname, 'fixtures')

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

const parser = new ParserDecision({ logger })
const importer = new ImporterXlsx()

test('load file with tags and filter', async () => {
  const fileProcessor = new FileProcessor({ logger })
  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)
  fileProcessor.registerParser('<DECISION_TABLE>', parser)

  const fileNames = getFilenames(['decision/tag_and_filter.xls'])

  await fileProcessor.load(fileNames)

  expect(logger.entries.error).toEqual([])
  expect(fileProcessor.tables[0].tableName).toEqual('Person')
  expect(fileProcessor.tables[1].tableName).toEqual('Address')

  const tablePerson = parser.parse({
    fileName: 'tag_and_filter.xls',
    importer,
    sheetName: 'Person'
  })
  const tableAddress = parser.parse({
    fileName: 'tag_and_filter.xls',
    sheetName: 'Address',
    importer
  })

  expect(tablePerson).toBeDefined()
  expect(tableAddress).toBeDefined()
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
