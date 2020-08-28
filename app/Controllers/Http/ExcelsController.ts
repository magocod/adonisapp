import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import ExcelJS from 'exceljs';
import XLSX from 'xlsx';

export async function ReadXlsx() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(Application.tmpPath('uploads/paso_2_modelos_telefono.xlsx'));
  // console.log(workbook)
  // const worksheet = workbook.getWorksheet('Hoja1')
  const worksheet = workbook.getWorksheet(1);

  const rowHeader = worksheet.getRow(1);
  console.log(rowHeader.values);
  rowHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    console.log('Cell ' + colNumber + ' = ' + cell.value, typeof cell.value);
  });

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
    console.log(row.values)
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      console.log('Cell ' + colNumber + ' = ' + cell.value, typeof cell.value);
    });
  });

}

export async function ReadXlsxV2() {
  const workbook = XLSX.readFile(Application.tmpPath('uploads/paso_2_modelos_telefono.xlsx'));
  const first_sheet_name = workbook.SheetNames[0];
  console.log(workbook)
  const worksheet = workbook.Sheets[first_sheet_name]
  // const arraySheet = XLSX.utils.sheet_to_json(worksheet)
  // console.log(arraySheet)
  console.log(worksheet)
}

export default class ExcelsController {

  /**
   * [test description]
   * @param {HttpContextContract} ctx [description]
   */
  public async test(ctx: HttpContextContract) {
    await ReadXlsx()
    // await ReadXlsxV2()
    return ctx.response.status(200)
  }

	/**
   * [readV1 description]
   * Read file xlsx
   */
  public async readV1(ctx: HttpContextContract) {

    const fileXlsx = ctx.request.file('file', {
      size: '500mb',
      extnames: ['xlsx'],
    })

    if (!fileXlsx) {
      return ctx.response.status(400).json({
        message: 'Please upload file',
        details: '',
        err_message: ''
      });
    }

    if (fileXlsx.hasErrors) {
      return fileXlsx.errors
    }

    await fileXlsx.move(Application.tmpPath('uploads'))

    return ctx.response.status(200).json({
      data: [],
      message: 'operacion exitosa'
    })
  }

}
