[**@tlink/file-processor**](../README.md)

***

[@tlink/file-processor](../globals.md) / ParserDecision

# Class: ParserDecision

Defined in: parser/ParserDecision.ts:46

The parser implementation to parse decision tables.

## Extends

- [`ParserBase`](ParserBase.md)

## Constructors

### new ParserDecision()

> **new ParserDecision**(`opts`): [`ParserDecision`](ParserDecision.md)

Defined in: parser/ParserBase.ts:47

#### Parameters

##### opts

`ParserBaseOptions`

The options as defined in

#### Returns

[`ParserDecision`](ParserDecision.md)

#### See

ParserBaseOptions

#### Inherited from

[`ParserBase`](ParserBase.md).[`constructor`](ParserBase.md#constructors)

## Properties

### endKey

> **endKey**: `string`

Defined in: parser/ParserBase.ts:39

The key string used to find the last column or row.

#### Inherited from

[`ParserBase`](ParserBase.md).[`endKey`](ParserBase.md#endkey)

***

### fieldNameSequence

> **fieldNameSequence**: `number` = `0`

Defined in: parser/ParserDecision.ts:48

This sequence is used to give each field a unique name.

***

### logger

> **logger**: `LoggerInterface`

Defined in: parser/ParserBase.ts:42

The logger used for this parser

#### Inherited from

[`ParserBase`](ParserBase.md).[`logger`](ParserBase.md#logger)

***

### sectionHandler

> **sectionHandler**: `Record`\<`string`, `SectionHandler`\>

Defined in: parser/ParserDecision.ts:50

***

### startColumn

> **startColumn**: `number`

Defined in: parser/ParserBase.ts:36

The column the parser will start reading.

#### Inherited from

[`ParserBase`](ParserBase.md).[`startColumn`](ParserBase.md#startcolumn)

***

### startRow

> **startRow**: `number`

Defined in: parser/ParserBase.ts:33

The row the parser will start reading.

#### Inherited from

[`ParserBase`](ParserBase.md).[`startRow`](ParserBase.md#startrow)

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

#### Inherited from

[`ParserBase`](ParserBase.md).[`getEndColumn`](ParserBase.md#getendcolumn)

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

#### Inherited from

[`ParserBase`](ParserBase.md).[`getEndRow`](ParserBase.md#getendrow)

***

### getFieldName()

> **getFieldName**(): `string`

Defined in: parser/ParserDecision.ts:163

Creates a unique field name.

#### Returns

`string`

the new generated fieldName

***

### getNextSection()

> **getNextSection**(`request`): `NextSectionResult`

Defined in: parser/ParserDecision.ts:709

Get the definition of the next section

#### Parameters

##### request

The parameter as defined

###### importer

`ImporterInterface`

The importer

###### sheetEndRow

`number`

The last row in this sheet

###### sheetName

`string`

The name of the sheet

###### startRow

`number`

The row where to start searching

#### Returns

`NextSectionResult`

The created table model for the sheet

***

### getNextSubSection()

> **getNextSubSection**(`request`): `NextSubSectionResult`

Defined in: parser/ParserDecision.ts:636

Get the definition of the next sub section

#### Parameters

##### request

The parameter as defined

###### importer

`ImporterInterface`

The importer

###### sectionEndRow

`number`

The last row in the parent section

###### sheetName

`string`

The name of the sheet

###### startRow

`number`

The row where to start searching

#### Returns

`NextSubSectionResult`

A definition/boundaries of this subSection { startRow, endRow, fieldName }

***

### handleExecuteSection()

> **handleExecuteSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:487

Adds a new ExecuteSection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleFieldSection()

> **handleFieldSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:528

Adds a new FieldSection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleFilterSection()

> **handleFilterSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:389

Adds a new TagSection to the table. Updates the data for all the test cases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleGeneratorSwitchSection()

> **handleGeneratorSwitchSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:432

Adds a new GeneratorSwitch to the table. Updates the data for all the test cases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleMultiplicitySection()

> **handleMultiplicitySection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:471

Adds a new SummarySection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleMultiRowSection()

> **handleMultiRowSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:318

Adds a new MultiRowSection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleNeverExecuteSection()

> **handleNeverExecuteSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:503

Adds a new NeverExecuteSection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleSummarySection()

> **handleSummarySection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:519

Adds a new SummarySection to the table. Updates the data for all the testcases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### handleTagSection()

> **handleTagSection**(`opts`): `void`

Defined in: parser/ParserDecision.ts:354

Adds a new TagSection to the table. Updates the data for all the test cases

#### Parameters

##### opts

`SectionHandlerOptions`

The parameter as defined in

#### Returns

`void`

#### See

SectionHandlerOptions

***

### parse()

> **parse**(`request`): `undefined` \| `TableInterface`

Defined in: parser/ParserDecision.ts:68

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

### parseForTestcases()

> **parseForTestcases**(`request`): `number`

Defined in: parser/ParserDecision.ts:175

Reads the first line until no testcase name found. This
column is the last column which will be read. By the way create emtpy testcases
and add them to the table.

#### Parameters

##### request

The parameter as defined

###### importer

`ImporterInterface`

The importer

###### sheetName

`string`

The name of the worksheet

###### startRow

`number`

The row in which the testcase names are defined

###### table

`TableDecision`

The table object. The new model

###### testCaseStartColumn

`number`

The coumn in which the testcases starts

#### Returns

`number`

The testcase end column
