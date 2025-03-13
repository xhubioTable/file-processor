import {
  ParserInterface,
  ParserParseRequest
} from '../src/parser/ParserInterface'
import { TableInterface } from '@tlink/model'
import { LoggerInterface, LoggerMemory } from '@tlink/logger'

export class DummyParser implements ParserInterface {
  /** The row to start reading */
  startRow: number = 0

  /** The column to start reading */
  startColumn: number = 0

  /** A string identifying the last row to read */
  endKey: string = '<END>'

  /** The logger to use */
  logger: LoggerInterface = new LoggerMemory()

  /**
   * Parses the sheet with the given name und uses the given importer to access
   * the data.
   * @param request - The parameters as defined in @see ParserParseRequest
   * @returns The created table model
   */
  parse(request: ParserParseRequest): TableInterface | undefined {
    const { sheetName, fileName } = request
    return {
      name: sheetName,
      type: 'dummyModel',
      tableMeta: { fileName }
    } as unknown as TableInterface
  }
}
