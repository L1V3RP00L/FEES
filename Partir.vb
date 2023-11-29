Sub DivideArchivoExcel()
    Dim wb As Workbook
    Dim ThisSheet As Worksheet
    Dim NumOfColumns As Integer
    Dim RangeToCopy As Range
    Dim RangeOfHeader As Range
    Dim workbookCounter As Integer
    Dim RowsInFile As Integer
    Dim p As Integer
    
    ' Inicialización de variables '
    Application.ScreenUpdating = False
    Set ThisSheet = ThisWorkbook.ActiveSheet
    NumOfColumns = ThisSheet.UsedRange.Columns.Count
    workbookCounter = 1
    
    ' Cantidad de filas por archivo '
    RowsInFile = 400
    
    ' Copia las cabeceras para mantenerlas en cada archivo '
    Set RangeOfHeader = ThisSheet.Range(ThisSheet.Cells(1, 1), ThisSheet.Cells(1, NumOfColumns))
    
    ' Partir la información en múltiples archivos '
    For p = 2 To ThisSheet.UsedRange.Rows.Count Step RowsInFile
        Set wb = Workbooks.Add
        RangeOfHeader.Copy wb.Sheets(1).Range("A1")
        Set RangeToCopy = ThisSheet.Range(ThisSheet.Cells(p, 1), ThisSheet.Cells(p + RowsInFile - 1, NumOfColumns))
        RangeToCopy.Copy wb.Sheets(1).Range("A2")
        
        ' Guarda el nuevo archivo '
        wb.SaveAs ThisWorkbook.Path & "\parte" & workbookCounter & ".xlsx"
        wb.Close
        ' Incrementa el contador '
        workbookCounter = workbookCounter + 1
    Next p
    
    Application.ScreenUpdating = True
    Set wb = Nothing
End Sub