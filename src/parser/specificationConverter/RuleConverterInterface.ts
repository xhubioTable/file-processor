import { SpecificationFieldRuleInterface } from '../SpecificationInterface'

/**
 * Defines the function to convert the values of a rule
 */
export interface RuleConverter {
  /** The name is used to register the converter */
  name: string

  /** The function to convert the rule */
  convert: (fieldRule: SpecificationFieldRuleInterface) => EquivalenceClasses
}

export type FieldRules = Record<string, SpecificationFieldRuleInterface>

/** All EquivalenceClasses of all the fields */
export interface EquivalenceClasses {
  valid: Record<string, { comment: string[] }>
  error: Record<
    string,
    {
      /** The comment is one Equivalenzclass of the field */
      comment: string[]
      /** The severity/result for the fail */
      severity: string[]
    }
  >
}
