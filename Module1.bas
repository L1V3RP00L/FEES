Attribute VB_Name = "Module1"
Sub Test()
    
    'declarar variables
    Dim wb As Workbook
    Dim ThisSheet As Worksheet
    Dim NumOfColumns As Integer
    Dim RangeToCopy As Range
    Dim RangeOfHeader As Range
    Dim WorkbookCounter As Integer
    Dim RowsInFile

    'inicializar variables
    Application.ScreenUpdating = False
    Set ThisSheet = ThisWorkbook.ActiveSheet
    NumOfColumns = ThisSheet.UsedRange.Columns.Count
    WorkbookCounter = 1
    
    'cantidad de filas por archivo
    RowsInFile = 70

    'copiar las cabeceras para mantenerlas en cada archivo
    Set RangeOfHeader = ThisSheet.Range(ThisSheet.Cells(1, 1), ThisSheet.Cells(1, NumOfColumns))

    'partir la informacion en multiples archivos
    For p = 2 To ThisSheet.UsedRange.Rows.Count Step RowsInFile - 1
        
        Set wb = Workbooks.Add
        RangeOfHeader.Copy wb.Sheets(1).Range("A1")
        Set RangeToCopy = ThisSheet.Range(ThisSheet.Cells(p, 1), ThisSheet.Cells(p + RowsInFile - 2, NumOfColumns))
        RangeToCopy.Copy wb.Sheets(1).Range("A2")

        'Guardar el nuevo archivo
        wb.SaveAs ThisWorkbook.Path & "\parte" & WorkbookCounter
        wb.Close
    
        'Incrementar el contador
        WorkbookCounter = WorkbookCounter + 1
    Next p

    Application.ScreenUpdating = True
    Set wb = Nothing
End Sub

