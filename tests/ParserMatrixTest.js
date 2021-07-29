import path from 'path'

import { ImporterXlsx } from '@xhubiotable/importer-xlsx'
import { ParserMatrix } from '../src/index'
import { getLoggerMemory } from '@xhubiotable/logger'

const fixturesDir = path.join(__dirname, 'fixtures')
const filename = path.join(fixturesDir, 'matrix/action_on_person.xls')

const logger = getLoggerMemory()
logger.clear()
logger.writeConsole = false

test('Test action_on_person table: load ', async () => {
  const importer = new ImporterXlsx()
  importer.loadFile(filename)
  const parser = new ParserMatrix({ logger })
  const table = await parser.parse('Action on Person', importer)

  expect(table).toEqual({
    columns: [
      {
        description: undefined,
        execute: 'x',
        generator: 'gen::empty',
        name: 'KEINE',
        position: 1,
        shortName: undefined,
      },
      {
        description: undefined,
        execute: undefined,
        generator: undefined,
        name: undefined,
        position: undefined,
        shortName: undefined,
      },
      {
        description: undefined,
        execute: undefined,
        generator: undefined,
        name: 'add email',
        position: 3,
        shortName: undefined,
      },
      {
        description: undefined,
        execute: 'x',
        generator: 'Person:4',
        name: 'delete email',
        position: 4,
        shortName: undefined,
      },
      {
        description: undefined,
        execute: 'x',
        generator: undefined,
        name: 'change last name',
        position: 5,
        shortName: undefined,
      },
    ],
    data: [
      ['x', undefined, undefined, 'x', 'x'],
      ['x', undefined, 'x', undefined, 'x'],
    ],
    meta: {},
    name: 'Action on Person',
    rows: [
      {
        description: 'pers desc',
        execute: 'x',
        generator: 'gen::empty',
        name: 'Person',
        position: 1,
        shortName: 'psn',
      },
      {
        description: undefined,
        execute: undefined,
        generator: 'Person:3',
        name: 'Person without email',
        position: 2,
        shortName: undefined,
      },
    ],
  })
})
