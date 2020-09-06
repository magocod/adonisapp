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

interface CellError {
  cell_number: number;
  value: any;
  message: string;
}

interface RowError {
  row_number: number;
  cells: CellError[]
}

interface ReadRule {
  name: string;
  type: string;
  message: string;
}

interface ReadConfig {
  path: string;
  rules: ReadRule[];
}

interface ReadResult {
  status: boolean;
  result: any[];
  errors: RowError[]
}

function FakeDBQuery(rows: string | string[], ruleType: string, exists: boolean) {
  // example relation db
  const queryArray = [
    { name: 'A', id: 1 },
    { name: 'B', id: 2 },
    { name: 'C', id: 3 }
  ]
  const queryArrayNames = queryArray.map((value) => {
    return value.name;
  })

  if (ruleType === 'array') {
    const arr = queryArray.filter((value) => {
      if (exists) {
        return rows.includes(value.name)
      } else {
        return !rows.includes(value.name)
      }
    })

    if (exists) {
      return arr.map((value) => {
        return value.id
      })
    }

    if (Array.isArray(rows)) {
      return rows.filter((value) => {
        return !queryArrayNames.includes(value)
      })
    }
  }

  const queryRelation = [
    { name: 'N1', id: 1 },
    { name: 'N2', id: 2 },
  ]

  const found = queryRelation.find((value) => {
    if (exists) {
      return value.name === rows
    } else {
      return value.name !== rows
    }
  })

  if (found === undefined) {
    return undefined
  }

  if (exists) {
    return found.id
  }

  return found.name

}

export async function readFile(config: ReadConfig): Promise<ReadResult> {

  const cellLength = config.rules.length;

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(config.path);
  // console.log(workbook)
  // const worksheet = workbook.getWorksheet('Hoja1')
  const worksheet = workbook.getWorksheet(1);

  const rowHeader = worksheet.getRow(1);
  // console.log(rowHeader.values);

  const headerError: RowError = {
    row_number: 1,
    cells: []
  };

  console.log('length cell read', cellLength)

  rowHeader.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    console.log('Cell ' + colNumber + ' = ' + cell.value, typeof cell.value);
    if (colNumber <= cellLength) {
      if (cell.value !== config.rules[colNumber - 1].name) {
        headerError.cells.push({
          cell_number: colNumber,
          value: cell.value,
          message: 'Valor de cabecera invalido, debe ser una cadena de caracteres'
        })
      } 
    }
  });

  if (headerError.cells.length > 0) {
    return {
      status: false,
      result: [],
      errors: [headerError]
    } 
  }

  const results: any[] = [];
  const rowErrors: RowError[] = [];

  const moldObject = {
    row_number: 0
  }
  for (const rule of config.rules) {
    moldObject[rule.name] = null
  }

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }
    console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));

    const resultRow = {...moldObject};
    resultRow.row_number = rowNumber;

    const rowError: RowError = {
      row_number: rowNumber,
      cells: []
    }
    // console.log(row.values)
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      console.log('Cell ' + colNumber + ' = ' + cell.value, typeof cell.value, config.rules[colNumber - 1]);
      if (colNumber <= cellLength) {
        const rule = config.rules[colNumber - 1];

        // array
        if (rule.type === 'array') {
          if (typeof cell.value !== 'string') {
            const error = {
              cell_number: colNumber,
              value: cell.value,
              message: rule.message
            }
            console.log(error)
            rowError.cells.push(error)
            return
          }
          const arr = cell.value.split(',');
          // query exist db
          const exists = FakeDBQuery(arr, rule.type, true);
          // query not exist
          if (Array.isArray(exists)) {
            if (exists.length !== arr.length) {
              const notExists = FakeDBQuery(arr, rule.type, false);
              const error = {
                cell_number: colNumber,
                value: notExists,
                message: 'No se encuentran registrado en base de datos'
              }
              console.log(error)
              rowError.cells.push(error)
              return;
            }
          }
          resultRow[rule.name] = exists
          return
        }

        // relation
        if (rule.type === 'relation') {
          console.log('relation', cell.value)
          if (typeof cell.value === null) {
            const error = {
              cell_number: colNumber,
              value: cell.value,
              message: rule.message
            }
            console.log(error)
            rowError.cells.push(error)
            return
          }
          // query exist db
          const exist = FakeDBQuery(cell.value as string, rule.type, true);
          console.log(exist)
          // query not exist
          if (exist === undefined) {
            const notExist = FakeDBQuery(cell.value as string, rule.type, false);
            const error = {
              cell_number: colNumber,
              value: notExist,
              message: 'No se encuentra registrado en base de datos'
            }
            console.log(error)
            rowError.cells.push(error)
            return;
          }
          
          resultRow[rule.name] = exist
          return
        }

        if (typeof cell.value !== rule.type) {
          const error = {
            cell_number: colNumber,
            value: cell.value,
            message: rule.message
          }
          console.log(error)
          rowError.cells.push(error)
          return
        }

        resultRow[rule.name] = cell.value;
      }
    });

    if (rowError.cells.length > 0) {
      rowErrors.push(rowError);
    } else {
      console.log('result', resultRow);
      // validate
      results.push(resultRow)
    }

  });

  return {
    status: true,
    result: results,
    errors: rowErrors
  }

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

    // const fileRules: ReadRule[] = [
    //   {
    //     name: 'text',
    //     type: 'string',
    //   },
    //   {
    //     name: 'Type',
    //     type: 'string',
    //   }
    // ]

    const fileRules: ReadRule[] = [
      {
        name: 'text',
        type: 'string',
        message: 'La celda debe ser una cadena de caracteres'
      },
      {
        name: 'Brand',
        type: 'string',
        message: 'La celda debe ser una cadena de caracteres'
      },
      {
        name: 'Price',
        type: 'number',
        message: 'La celda debe ser una cadena de numero (entero o flotante)'
      },
      {
        name: 'Tags',
        type: 'array',
        message: 'La celda debe ser una cadena de caracteres, separadas por coma'
      },
      {
        name: 'Category',
        type: 'relation',
        message: 'La celda debe ser una cadena de caracteres, registrada en base de datos'
      }
    ]

    const fileName = `${new Date().getTime()}.${fileXlsx.extname}`;
    await fileXlsx.move(Application.tmpPath('uploads'), {
      name: fileName,
    })
    const filePath = Application.tmpPath(`uploads/${fileName}`)

    // read results
    const result = await readFile({
      path: filePath,
      rules: fileRules
    })

    // save database
    // ...

    return ctx.response.status(200).json({
      data: result,
      message: 'operacion exitosa'
    })
  }

}
