import * as invariant from 'invariant'
import { Section, Qualifier, AttributeQualifier } from './interfaces'
import { msg } from './check'

/** 根据sections构造标准的CSS selector */
export function makeNormalCssSelector(sections: Section[]) {
  const result: string[] = []
  for (const sec of sections) {
    result.push(sec.combinator)
    result.push(sec.element)
    for (const qualifier of sec.qualifiers) {
      if (qualifier.type === 'id-qualifier') {
        result.push('#' + qualifier.id)
      } else if (qualifier.type === 'class-qulifier') {
        result.push('.' + qualifier.className)
      } else if (qualifier.type === 'attribute-qualifier') {
        const { attribute, operator, value } = qualifier
        if (operator == null && value == null) { // existence
          result.push(`[${attribute}]`)
        } else if (typeof value === 'object') { // capture
          invariant(operator === '=', msg.valueCaptureWithOtherOperator())
        } else { // normal qualifier
          result.push(`[${attribute}${operator}"${value}"]`)
        }
      } else { // pseudo-qualifier
        throw new Error(msg.hasPseudoQualifier())
      }
    }
  }
  return result.join('').trim()
}

export function isEmptyObject(x: any) {
  return typeof x === 'object'
    && Object.getPrototypeOf(x) === Object.prototype
    && Object.keys(x).length === 0
}

export function isCheerioStatic(arg: CheerioStatic | CheerioElement): arg is CheerioStatic {
  return typeof (<CheerioStatic>arg).root === 'function'
}

export function isAttributeQualifier(qualifier: Qualifier): qualifier is AttributeQualifier {
  return qualifier.type === 'attribute-qualifier'
}