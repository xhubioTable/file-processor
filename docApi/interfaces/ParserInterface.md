[**@xhubiotable/file-processor**](../README.md)

***

[@xhubiotable/file-processor](../globals.md) / ParserInterface

# Interface: ParserInterface

Defined in: [parser/ParserInterface.ts:14](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L14)

The interface definition for all the table parser.

## Properties

### endKey

> **endKey**: `string`

Defined in: [parser/ParserInterface.ts:22](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L22)

A string identifying the last row to read

***

### logger

> **logger**: `LoggerInterface`

Defined in: [parser/ParserInterface.ts:25](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L25)

The logger to use

***

### parse()

> **parse**: (`request`) => `undefined` \| `TableInterface`

Defined in: [parser/ParserInterface.ts:33](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L33)

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

***

### startColumn

> **startColumn**: `number`

Defined in: [parser/ParserInterface.ts:19](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L19)

The column to start reading

***

### startRow

> **startRow**: `number`

Defined in: [parser/ParserInterface.ts:16](https://github.com/xhubioTable/file-processor/blob/2976a44538615081e1254047688a86b993a0ae7f/src/parser/ParserInterface.ts#L16)

The row to start reading
