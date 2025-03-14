[**@xhubiotable/file-processor**](../README.md)

***

[@xhubiotable/file-processor](../globals.md) / FileProcessor

# Class: FileProcessor

Defined in: [FileProcessor.ts:52](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L52)

The file processor.

## Constructors

### new FileProcessor()

> **new FileProcessor**(`opts`): [`FileProcessor`](FileProcessor.md)

Defined in: [FileProcessor.ts:97](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L97)

#### Parameters

##### opts

`FileProcessorOptions` = `{}`

#### Returns

[`FileProcessor`](FileProcessor.md)

## Properties

### importerMap

> **importerMap**: `Map`\<`string`, `ImporterInterface`\>

Defined in: [FileProcessor.ts:57](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L57)

Stores importer for file extensions. So the extension of a file defines which importer is used.

***

### logger

> **logger**: `LoggerInterface`

Defined in: [FileProcessor.ts:54](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L54)

The logger for this file processor

***

### parserMap

> **parserMap**: `Map`\<`string`, [`ParserInterface`](../interfaces/ParserInterface.md)\>

Defined in: [FileProcessor.ts:67](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L67)

for every loaded file there may be different type of tables in one Spreadsheet.
This map has a parser for the different table types. The processor reads the value
in the first cell. This value is the table type. Then the processor looks up
if there is a parser registered for this table type.

***

### sheetDefinition

> **sheetDefinition**: `SheetDefinition` = `{}`

Defined in: [FileProcessor.ts:80](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L80)

Defines the start column and row per sheetName. Also which key is used
to find the end of a row or the last column.
This map stores the definition per sheet name.
The format of ths definition is:
{
  startRow: 0,
  startColumn: 0,
  endKey: '\<END\>',
}

***

### tableTypeKeys

> **tableTypeKeys**: `string`[]

Defined in: [FileProcessor.ts:88](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L88)

The importer will load only tables wich match the given keys
The key value must be in the first cell of the table defined by
start_row and start_column
The keys are not case sensitive

## Accessors

### tables

#### Get Signature

> **get** **tables**(): `TableInterface`[]

Defined in: [FileProcessor.ts:122](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L122)

Returns all the laoded table models

##### Returns

`TableInterface`[]

A list of tables

## Methods

### clearTables()

> **clearTables**(): `void`

Defined in: [FileProcessor.ts:129](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L129)

Delets all the loaded tables

#### Returns

`void`

***

### getImporter()

> **getImporter**(`fileName`): `ImporterInterface`

Defined in: [FileProcessor.ts:270](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L270)

Returns an instance of a step class

#### Parameters

##### fileName

`string`

The name of the file to import

#### Returns

`ImporterInterface`

The importer for this file or throws an exception

***

### getParser()

> **getParser**(`type`): [`ParserInterface`](../interfaces/ParserInterface.md)

Defined in: [FileProcessor.ts:319](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L319)

Returns an instance of a step class

#### Parameters

##### type

`string`

type of the table

#### Returns

[`ParserInterface`](../interfaces/ParserInterface.md)

The parser for this table type or undefined

***

### load()

> **load**(`fileNames`): `Promise`\<`void`\>

Defined in: [FileProcessor.ts:137](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L137)

Loads a list of files

#### Parameters

##### fileNames

The file(s) to open

`string` | `string`[]

#### Returns

`Promise`\<`void`\>

***

### registerImporter()

> **registerImporter**(`extension`, `importer`): `void`

Defined in: [FileProcessor.ts:255](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L255)

Registers an importer for a file extension. The extension are
not case sensitive

#### Parameters

##### extension

`string`

The file extension. For Example 'xlsx'

##### importer

`ImporterInterface`

An instance of an importer

#### Returns

`void`

***

### registerParser()

> **registerParser**(`type`, `parser`): `void`

Defined in: [FileProcessor.ts:304](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L304)

Registers a parser for a table type

#### Parameters

##### type

`string`

The table type

##### parser

[`ParserInterface`](../interfaces/ParserInterface.md)

The parser to use

#### Returns

`void`

***

### setSheetConfig()

> **setSheetConfig**(`sheetName`, `config`): `void`

Defined in: [FileProcessor.ts:332](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/FileProcessor.ts#L332)

Sets a config for a sheet name. Each sheet may have different configs

#### Parameters

##### sheetName

`string`

The name of the sheet

##### config

`SheetDefinitionEntry` = `...`

A config for the sheet.

#### Returns

`void`
