import { RuleConverter } from './RuleConverterInterface'

/**
 * Stores all the rule converter
 */
export class RuleConverterRegistry {
  /** Stores the ruleConverter function by a name */
  private registeredConverter: Record<string, RuleConverter> = {}

  addRuleConverter(ruleConverter: RuleConverter) {
    const name = ruleConverter.name
    if (this.registeredConverter[name] !== undefined) {
      throw new Error(
        `A rule Converter with the name '${name}' is already registered`
      )
    }
    this.registeredConverter[name] = ruleConverter
  }

  getConverter(name: string) {
    if (this.registeredConverter[name] === undefined) {
      throw new Error(
        `A rule Converter with the name '${name}' is not registered`
      )
    }
  }
}
