import { START_ROW, START_COLUMN } from './ParserConstants'

let idx = 0

/** The column the name is located. @enum {number} */
export const COLUMN_NAME = START_COLUMN + idx
/** The row the name is located. @enum {number} */
export const ROW_NAME = START_ROW + idx
idx++

/** The column the short name is located. @enum {number} */
export const COLUMN_SHORT_NAME = START_COLUMN + idx
/** The row the short name is located. @enum {number} */
export const ROW_SHORT_NAME = START_ROW + idx
idx++

/** The column the position is located. @enum {number} */
export const COLUMN_POSITION_NAME = START_COLUMN + idx
/** The row the position is located. @enum {number} */
export const ROW_POSITION_NAME = START_ROW + idx
idx++

/** The column the execute value is located. @enum {number} */
export const COLUMN_EXECUTE = START_COLUMN + idx
/** The row the execute value is located. @enum {number} */
export const ROW_EXECUTE = START_ROW + idx
idx++

/** The column the generator command is located. @enum {number} */
export const COLUMN_GENERATOR = START_COLUMN + idx
/** The row the generator command is located. @enum {number} */
export const ROW_GENERATOR = START_ROW + idx
idx++

/** The column the description is located. @enum {number} */
export const COLUMN_DESCRIPTION = START_COLUMN + idx
/** The row the description is located. @enum {number} */
export const ROW_DESCRIPTION = START_ROW + idx
idx++
idx++

/** The column the data matrix starts. @enum {number} */
export const START_COLUMN_DATA = START_COLUMN + idx
/** The row the data matrix starts. @enum {number} */
export const START_ROW_DATA = START_ROW + idx

/** The identifier for the matrix table. @enum {string} */
export const KEY_TABLE_START = '<MATRIX_TABLE>'
