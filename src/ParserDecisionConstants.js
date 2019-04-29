import { START_COLUMN } from './ParserConstants'

/** The column the test cases starts. @enum {number} */
export const START_COLUMN_TESTCASE = START_COLUMN + 5

/** The column the section type  is located. @enum {number} */
export const COLUMN_TYPE = START_COLUMN + 1

/** The column the name of the Equivalence class is located. @enum {number} */
export const COLUMN_FIELD_EQ_CLASS = START_COLUMN + 2
/** The column the name of the generator calls are located. @enum {number} */
export const COLUMN_FIELD_TDG = START_COLUMN + 3
/** The column the comment is located. @enum {number} */
export const COLUMN_FIELD_COMMENT = START_COLUMN + 4

/** MURO=MultiRow. The column where the 'key' value is located. @enum {number} */
export const COLUMN_MURO_KEY = START_COLUMN + 2
/** MURO=MultiRow. The column where the 'other' value is located. @enum {number} */
export const COLUMN_MURO_OTHER = START_COLUMN + 3
/** MURO=MultiRow. The column where the 'comment' value is located. @enum {number} */
export const COLUMN_MURO_COMMENT = START_COLUMN + 4

/** The identifier for the decision table. @enum {string} */
export const KEY_TABLE_START = '<DECISION_TABLE>'

/** The identifier for the 'execute section'. @enum {string} */
export const EXECUTE_SECTION = 'ExecuteSection'
/** The identifier for the 'never execute section'. @enum {string} */
export const NEVER_EXECUTE_SECTION = 'NeverExecuteSection'
/** The identifier for the 'multiplicity section'. @enum {string} */
export const MULTIPLICITY_SECTION = 'MultiplicitySection'
