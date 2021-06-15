import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class FilesController {
  /**
   *
   * @param response
   * @param params
   */
  public async download({ response, params }: HttpContextContract) {
    const filePath = Application.tmpPath(`uploads/${params.name}`)
    return response.download(filePath)
  }
}
