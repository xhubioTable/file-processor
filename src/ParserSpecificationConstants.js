import { START_COLUMN } from './ParserConstants'

/** Defines all the defaulzt rules of the specification table. @enum {object} */
export const RULE = {
  PK: 'Primary Key',
  TYPE: 'Field Type',
  C1: 'Mandatory',
  C2: 'Minimum',
  C3: 'Maximum',
  C4: 'Email',
  C5: 'Regular Expression',
}

/** The column the rules starts. @enum {number} */
export const START_COLUMN_RULE = START_COLUMN + 2
/** The key string to identifiy the severity rows. @enum {string} */
export const KEY_SEVERITY = 'Severity'
/** The key string to identifiy the rule rows. @enum {string} */
export const KEY_RULE = 'Rule'
