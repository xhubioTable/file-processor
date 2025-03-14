import path from 'node:path'
import { DummyParser } from './DummyParser'
import { ImporterXlsx } from '@xhubiotable/importer-xlsx'
import { FileProcessor, ParserDecision } from '../src/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const FIXTURES = path.join(__dirname, 'fixtures')

const LOGGER = getLoggerMemory()
const parser = new DummyParser()
const importer = new ImporterXlsx()

test('load files', async () => {
  LOGGER.clear()

  const fileProcessor = new FileProcessor({ logger: LOGGER })
  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)
  fileProcessor.registerParser('<DECISION_TABLE>', parser)
  fileProcessor.registerParser('<MATRIX_TABLE>', parser)

  const fileNames = getFilenames([
    'matrix/action_on_person.xls',
    'matrix/matrix_table.xls'
  ])
  await fileProcessor.load(fileNames)

  expect(LOGGER.entries.error).toEqual([])

  expect(fileProcessor.tables).toEqual([
    {
      name: 'Action on Person',
      type: 'dummyModel',
      tableMeta: {
        fileName: path.join(FIXTURES, 'matrix', 'action_on_person.xls')
      }
    },
    {
      name: 'Action on Person invalid meta',
      type: 'dummyModel',
      tableMeta: {
        fileName: path.join(FIXTURES, 'matrix', 'action_on_person.xls')
      }
    },
    {
      name: 'Aktion auf Tour',
      type: 'dummyModel',
      tableMeta: {
        fileName: path.join(FIXTURES, 'matrix', 'matrix_table.xls')
      }
    }
  ])
})

test('load files: generator switch', async () => {
  LOGGER.clear()

  const fileProcessor = new FileProcessor({ logger: LOGGER })
  fileProcessor.registerImporter('xlsx', importer)
  fileProcessor.registerImporter('xls', importer)
  fileProcessor.registerParser(
    '<DECISION_TABLE>',
    new ParserDecision({ logger: LOGGER })
  )

  const fileNames = getFilenames(['decision/generator_switch.xls'])

  await fileProcessor.load(fileNames)

  expect(LOGGER.entries.error).toEqual([])
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
