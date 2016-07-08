package com.sapient.excel;
 
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.springframework.web.servlet.view.document.AbstractExcelView;

import com.sapient.repository.Winners;
 
/**
 * This class builds an Excel spreadsheet document using Apache POI library.
 * @author www.codejava.net
 *
 */
public class ExcelBuilder extends AbstractExcelView {
 
    @Override
    protected void buildExcelDocument(Map<String, Object> model,
            HSSFWorkbook workbook, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        // get data model which is passed by the Spring container
    	List<Winners> winners = (List<Winners>) model.get("recognitions");
         
        // create a new Excel sheet
        HSSFSheet sheet = workbook.createSheet("Java Books");
        sheet.setDefaultColumnWidth(30);
         
        // create style for header cells
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontName("Arial");
        style.setFillForegroundColor(HSSFColor.DARK_BLUE.index);
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        font.setColor(HSSFColor.WHITE.index);
        style.setFont(font);
         
        // create header row
        HSSFRow header = sheet.createRow(0);
         
        header.createCell(0).setCellValue("Category");
        header.getCell(0).setCellStyle(style);
         
        header.createCell(1).setCellValue("Nominator");
        header.getCell(1).setCellStyle(style);
         
        header.createCell(2).setCellValue("Nominee");
        header.getCell(2).setCellStyle(style);
         
        header.createCell(3).setCellValue("Published Date");
        header.getCell(3).setCellStyle(style);
         
        header.createCell(4).setCellValue("Citation");
        header.getCell(4).setCellStyle(style);
         
        // create data rows
        int rowCount = 1;
         
        for (Winners winner : winners) {
            HSSFRow aRow = sheet.createRow(rowCount++);
            aRow.createCell(0).setCellValue(winner.getNomination().getRecognitionCategory());
            aRow.createCell(1).setCellValue(winner.getNomination().getNominator().getName());
            aRow.createCell(2).setCellValue(winner.getNomination().getNominee().getName());
            
            HSSFRichTextString hssfRichTextString = new HSSFRichTextString(winner.getNomination().getCitation());
			Cell cell = aRow.createCell(3);
			cell.setCellValue(hssfRichTextString);
            
			//aRow.createCell(4).setCellValue(winner.getNomination().getRecognitionPeriod());
        }
    }
 
}