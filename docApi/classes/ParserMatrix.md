[**@xhubiotable/file-processor**](../README.md)

***

[@xhubiotable/file-processor](../globals.md) / ParserMatrix

# Class: ParserMatrix

Defined in: [parser/ParserMatrix.ts:48](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L48)

The parser for the matrix tables.

## Extends

- [`ParserBase`](ParserBase.md)

## Constructors

### new ParserMatrix()

> **new ParserMatrix**(`opts`): [`ParserMatrix`](ParserMatrix.md)

Defined in: [parser/ParserBase.ts:47](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L47)

#### Parameters

##### opts

`ParserBaseOptions`

The options as defined in

#### Returns

[`ParserMatrix`](ParserMatrix.md)

#### See

ParserBaseOptions

#### Inherited from

[`ParserBase`](ParserBase.md).[`constructor`](ParserBase.md#constructors)

## Properties

### emptyColumns

> **emptyColumns**: `Set`\<`number`\>

Defined in: [parser/ParserMatrix.ts:53](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L53)

If a complete column is empty, it must not be parsed

***

### emptyRows

> **emptyRows**: `Set`\<`number`\>

Defined in: [parser/ParserMatrix.ts:55](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L55)

If a complete row is empty, it must not be parsed

***

### endKey

> **endKey**: `string`

Defined in: [parser/ParserBase.ts:39](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L39)

The key string used to find the last column or row.

#### Inherited from

[`ParserBase`](ParserBase.md).[`endKey`](ParserBase.md#endkey)

***

### fieldNameSequence

> **fieldNameSequence**: `number` = `0`

Defined in: [parser/ParserMatrix.ts:50](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L50)

This sequence is used to give each field a unique name.

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

### getEndColumn()

> **getEndColumn**(`importer`, `sheetName`, `maxEmpty`): `number`

Defined in: [parser/ParserBase.ts:120](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserBase.ts#L120)

Parses the sheet to get the last column of the decision table.

#### Parameters

##### importer

`ImporterInterface`

The importer object

##### sheetName

`string`

The name of the sheet to parse

##### maxEmpty

`number` = `20`

The maximum of empty columns which will be ignored

#### Returns

`number`

- The index number of the last column of the table

#### Inherited from

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

### getFieldName()

> **getFieldName**(): `string`

Defined in: [parser/ParserMatrix.ts:116](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L116)

Creates a unique field name.

#### Returns

`string`

The new generated fieldName

***

### parse()

> **parse**(`request`): `undefined` \| `TableInterface`

Defined in: [parser/ParserMatrix.ts:63](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L63)

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

### parseMetaDataColumn()

> **parseMetaDataColumn**(`request`): `void`

Defined in: [parser/ParserMatrix.ts:208](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserMatrix.ts#L208)

Reads the meta data information of each column and stores it in the
table object

#### Parameters

##### request

The parameter as defined

###### importer

`ImporterInterface`

The importer

###### sheetEndColumn

`number`

The last column of the sheed (Exclusive)

###### sheetEndRow

`number`

The last row of the sheet (Exclusive)

###### sheetName

`string`

The name of the sheet

###### table

`TableMatrix`

The table to store the current sheet data

#### Returns

`void`
