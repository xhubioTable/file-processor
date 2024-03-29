import path from 'path'
import DummyParser from './DummyParser'
import { ImporterXlsx } from '@xhubiotable/importer-xlsx'

import { FileProcessor } from '../src/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const LOGGER = getLoggerMemory()

const parser = new DummyParser()
const importer = new ImporterXlsx()

const FIXTURES = path.join(__dirname, 'fixtures')

test('load files', async () => {
  LOGGER.clear()

  const fileProcessor = new FileProcessor({ logger: LOGGER })
  await fileProcessor.registerImporter('xlsx', importer)
  await fileProcessor.registerImporter('xls', importer)
  await fileProcessor.registerParser('<DECISION_TABLE>', parser)
  await fileProcessor.registerParser('<MATRIX_TABLE>', parser)

  const fileNames = getFilenames([
    'matrix/action_on_person.xls',
    'matrix/matrix_table.xls',
  ])
  await fileProcessor.load(fileNames)

  expect(LOGGER.entries.error).toEqual([])
  expect(fileProcessor.tables).toEqual([
    {
      name: 'Action on Person',
      type: 'dummyModel',
      meta: {
        fileName: path.join(FIXTURES, 'matrix', 'action_on_person.xls'),
      },
    },
    {
      name: 'Aktion auf Tour',
      type: 'dummyModel',
      meta: {
        fileName: path.join(FIXTURES, 'matrix', 'matrix_table.xls'),
      },
    },
  ])
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
