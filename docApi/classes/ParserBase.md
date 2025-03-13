[**@tlink/file-processor**](../README.md)

***

[@tlink/file-processor](../globals.md) / ParserBase

# Class: `abstract` ParserBase

Defined in: parser/ParserBase.ts:31

For each different type of table an own parser is needed. This is the
base implementation of the parser used by different parser types.

## Extended by

- [`ParserMatrix`](ParserMatrix.md)
- [`ParserDecision`](ParserDecision.md)
- [`ParserSpecification`](ParserSpecification.md)

## Implements

- [`ParserInterface`](../interfaces/ParserInterface.md)

## Constructors

### new ParserBase()

> **new ParserBase**(`opts`): [`ParserBase`](ParserBase.md)

Defined in: parser/ParserBase.ts:47

#### Parameters

##### opts

`ParserBaseOptions`

The options as defined in

#### Returns

[`ParserBase`](ParserBase.md)

#### See

ParserBaseOptions

## Properties

### endKey

> **endKey**: `string`

Defined in: parser/ParserBase.ts:39

The key string used to find the last column or row.

#### Implementation of

[`ParserInterface`](../interfaces/ParserInterface.md).[`endKey`](../interfaces/ParserInterface.md#endkey)

***

### logger

> **logger**: `LoggerInterface`

Defined in: parser/ParserBase.ts:42

The logger used for this parser

#### Implementation of

[`ParserInterface`](../interfaces/ParserInterface.md).[`logger`](../interfaces/ParserInterface.md#logger)

***

### startColumn

> **startColumn**: `number`

Defined in: parser/ParserBase.ts:36

The column the parser will start reading.

#### Implementation of

[`ParserInterface`](../interfaces/ParserInterface.md).[`startColumn`](../interfaces/ParserInterface.md#startcolumn)

***

### startRow

> **startRow**: `number`

Defined in: parser/ParserBase.ts:33

The row the parser will start reading.

#### Implementation of

[`ParserInterface`](../interfaces/ParserInterface.md).[`startRow`](../interfaces/ParserInterface.md#startrow)

## Methods

### getEndColumn()

> **getEndColumn**(`importer`, `sheetName`, `maxEmpty`): `number`

Defined in: parser/ParserBase.ts:120

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

***

### getEndRow()

> **getEndRow**(`importer`, `sheetName`, `maxEmpty`): `number`

Defined in: parser/ParserBase.ts:78

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

***

### parse()

> `abstract` **parse**(`request`): `undefined` \| `TableInterface`

Defined in: parser/ParserBase.ts:69

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

#### Implementation of

[`ParserInterface`](../interfaces/ParserInterface.md).[`parse`](../interfaces/ParserInterface.md#parse)
