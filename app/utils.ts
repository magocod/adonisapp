import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { KnexCount } from 'adonis/app'

/**
 * unsafe
 * @param model
 */
export async function count_model(model: typeof BaseModel) {
  const count = await model.query().knexQuery.count('* as total')
  // console.log(count)
  return {
    total: parseInt(count[0].total),
  } as KnexCount
}
