import { validator, ParsedTypedSchema, TypedSchema, ApiErrorNode } from '@ioc:Adonis/Core/Validator'

interface ValidationMessage {
  errors: ApiErrorNode[]
}

/**
 *
 * @param schema
 * @param values
 */
export async function validate_form(schema: ParsedTypedSchema<TypedSchema>, values: unknown) {
  try {
    await validator.validate({
      schema,
      reporter: validator.reporters.api,
      data: values,
    })
    return {
      errors: [],
    } as ValidationMessage
  } catch (error) {
    return error.messages as ValidationMessage
  }
}
