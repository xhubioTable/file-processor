[**@xhubiotable/file-processor**](../README.md)

***

[@xhubiotable/file-processor](../globals.md) / ParserSpecification

# Class: ParserSpecification

Defined in: [parser/ParserSpecification.ts:23](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L23)

The parser implementation to parse specification tables.

## Extends

- [`ParserBase`](ParserBase.md)

## Constructors

### new ParserSpecification()

> **new ParserSpecification**(`opts`): [`ParserSpecification`](ParserSpecification.md)

Defined in: [parser/ParserBase.ts:47](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L47)

#### Parameters

##### opts

`ParserBaseOptions`

The options as defined in

#### Returns

[`ParserSpecification`](ParserSpecification.md)

#### See

ParserBaseOptions

#### Inherited from

[`ParserBase`](ParserBase.md).[`constructor`](ParserBase.md#constructors)

## Properties

### endKey

> **endKey**: `string`

Defined in: [parser/ParserBase.ts:39](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L39)

The key string used to find the last column or row.

#### Inherited from

[`ParserBase`](ParserBase.md).[`endKey`](ParserBase.md#endkey)

***

### hasParseErrors

> **hasParseErrors**: `boolean` = `false`

Defined in: [parser/ParserSpecification.ts:24](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L24)

***

### logger

> **logger**: `LoggerInterface`

Defined in: [parser/ParserBase.ts:42](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L42)

The logger used for this parser

#### Inherited from

[`ParserBase`](ParserBase.md).[`logger`](ParserBase.md#logger)

***

### startColumn

> **startColumn**: `number`

Defined in: [parser/ParserBase.ts:36](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L36)

The column the parser will start reading.

#### Inherited from

[`ParserBase`](ParserBase.md).[`startColumn`](ParserBase.md#startcolumn)

***

### startRow

> **startRow**: `number`

Defined in: [parser/ParserBase.ts:33](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L33)

The row the parser will start reading.

#### Inherited from

[`ParserBase`](ParserBase.md).[`startRow`](ParserBase.md#startrow)

## Methods

### checkForUnusedRules()

> **checkForUnusedRules**(`request`): `void`

Defined in: [parser/ParserSpecification.ts:480](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L480)

Each rule defined must be used. Unused rules should be deleted from the table

#### Parameters

##### request

The parameters as defined

###### importer

`ImporterInterface`

The importer

###### rules

`Record`\<`string`, `SpecificationRuleInterface`\>

The rules of the sheet

###### severityStartRow

`number`

The start row of the severities

###### sheetEndColumn

`number`

The last column of the sheet

###### sheetName

`string`

The name of the sheet

#### Returns

`void`

***

### checkSheetRows()

> **checkSheetRows**(`sheetName`, `importer`, `sheetEndRow`): `object`

Defined in: [parser/ParserSpecification.ts:550](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L550)

Checks that the specification contains all the needed sections

#### Parameters

##### sheetName

`string`

The name of the sheet

##### importer

`ImporterInterface`

The importer

##### sheetEndRow

`number`

The last row of the sheet

#### Returns

`object`

An Object with the following properties {severityStartRow, ruleStartRow}

##### ruleStartRow

> **ruleStartRow**: `number`

##### severityStartRow

> **severityStartRow**: `number`

***

### getEndColumn()

> **getEndColumn**(`importer`, `sheetName`): `number`

Defined in: [parser/ParserSpecification.ts:598](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L598)

Parses the sheet to get the last row of the table.

#### Parameters

##### importer

`ImporterInterface`

The importer

##### sheetName

`string`

The name of the sheet

#### Returns

`number`

The last row of the table

#### Overrides

[`ParserBase`](ParserBase.md).[`getEndColumn`](ParserBase.md#getendcolumn)

***

### getEndRow()

> **getEndRow**(`importer`, `sheetName`, `maxEmpty`): `number`

Defined in: [parser/ParserBase.ts:78](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L78)

Parses the sheet to get the last row of the imported table.

#### Parameters

##### importer

`ImporterInterface`

The importer object

##### sheetName

`string`

The name of the sheet to parse

##### maxEmpty

`number` = `MAX_EMPTY_LINES`

The maximum of empty lines which will be ignored

#### Returns

`number`

The index number of the last row of the table

#### Inherited from

[`ParserBase`](ParserBase.md).[`getEndRow`](ParserBase.md#getendrow)

***

### parse()

> **parse**(`request`): `undefined` \| `TableInterface`

Defined in: [parser/ParserSpecification.ts:32](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L32)

Parses the sheet with the given name und uses the given importer to access
the data.

#### Parameters

##### request

`ParserParseRequest`

The parameters as defined in

#### Returns

`undefined` \| `TableInterface`

The created table model

#### See

ParserParseRequest

#### See

ParserParseRequest

#### Overrides

[`ParserBase`](ParserBase.md).[`parse`](ParserBase.md#parse)

***

### parseFields()

> **parseFields**(`request`): `object`

Defined in: [parser/ParserSpecification.ts:144](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L144)

Parses the fields out of the Spreadsheet. This is the section where
the fields of the interface are defined

#### Parameters

##### request

The Parameters as defined

###### importer

`ImporterInterface`

The importer

###### ruleStartRow

`number`

The start row of the rules

###### severityStartRow

`number`

The start row of the severities

###### sheetEndColumn

`number`

The last column of the sheet

###### sheetName

`string`

The name of the sheet

#### Returns

`object`

An object with the fields and the fieldOrder

##### fieldOrder

> **fieldOrder**: `string`[]

##### fields

> **fields**: `Record`\<`string`, `SpecificationFieldInterface`\>

***

### parseRules()

> **parseRules**(`request`): `Record`\<`string`, `SpecificationRuleInterface`\>

Defined in: [parser/ParserSpecification.ts:303](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L303)

Load the rules defined in the rule section

#### Parameters

##### request

The parameters as defined

###### endRow

`number`

The end row of the rules

###### importer

`ImporterInterface`

The importer

###### ruleStartRow

`number`

The start row of the rules

###### sheetName

`string`

The name of the sheet

#### Returns

`Record`\<`string`, `SpecificationRuleInterface`\>

An object with the rules

***

### parseSeverities()

> **parseSeverities**(`request`): `Set`\<`string`\>

Defined in: [parser/ParserSpecification.ts:397](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L397)

Load the rules defined in the rule section

#### Parameters

##### request

The parameters as defined

###### importer

`ImporterInterface`

The importer

###### ruleStartRow

`number`

The start row of the rules

###### severityStartRow

`number`

The start row of the severities

###### sheetEndColumn

`number`

The last column of the sheet

###### sheetName

`string`

The name of the sheet

#### Returns

`Set`\<`string`\>

A set of the existing severities

***

### parseSpecification()

> **parseSpecification**(`sheetName`, `importer`): `undefined` \| `SpecificationModel`

Defined in: [parser/ParserSpecification.ts:71](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserSpecification.ts#L71)

Parses a single Spreadsheet

#### Parameters

##### sheetName

`string`

The name of the sheet

##### importer

`ImporterInterface`

The importer

#### Returns

`undefined` \| `SpecificationModel`

The created specification model for the sheet
