import ExcelJS from 'exceljs';

/**
 * [ReadXlsx description]
 */
export async function ReadXlsx() {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile('brand.xlsx');
	console.log(workbook)
}
