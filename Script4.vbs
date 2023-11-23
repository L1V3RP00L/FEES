If Not IsObject(application) Then
   Set SapGuiAuto  = GetObject("SAPGUI")
   Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
   Set connection = application.Children(0)
End If
If Not IsObject(session) Then
   Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
   WScript.ConnectObject session,     "on"
   WScript.ConnectObject application, "on"
End If
session.findById("wnd[0]").maximize
session.findById("wnd[0]/usr/txtRSYST-BNAME").text = "VESOTELOB"
session.findById("wnd[0]/usr/pwdRSYST-BCODE").text = "V180bonilla"
session.findById("wnd[0]/usr/txtRSYST-LANGU").text = "ES"
session.findById("wnd[0]/usr/txtRSYST-LANGU").setFocus
session.findById("wnd[0]/usr/txtRSYST-LANGU").caretPosition = 2
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/tbar[0]/okcd").text = "ZVK12"
session.findById("wnd[0]").sendVKey 0

Dim objExcel
Dim objSheet, intRow, i

Set objExcel = GetObject(,"Excel.Application")
Set objSheet = objExcel.ActiveWorkbook.ActiveSheet

For i = 2 to objSheet.UsedRange.Rows.Count
   cOL1 = Trim(CStr(objSheet.Cells(i,1).Value))
   session.findById("wnd[0]/usr/ctxtP_VTWEG").text = "SC" 
   session.findById("wnd[0]/usr/ctxtP_FILE").text = cOL1
   
   session.findById("wnd[0]/usr/ctxtP_VTWEG").setFocus
   session.findById("wnd[0]/usr/ctxtP_VTWEG").caretPosition = 2
   session.findById("wnd[0]/tbar[1]/btn[8]").press
   session.findById("wnd[0]/tbar[0]/btn[3]").press
   objExcel.Cells(i,6).Value = "SC"

   session.findById("wnd[0]/usr/ctxtP_VTWEG").text = "10"      
   session.findById("wnd[0]/usr/ctxtP_VTWEG").setFocus
   session.findById("wnd[0]/usr/ctxtP_VTWEG").caretPosition = 2
   session.findById("wnd[0]/tbar[1]/btn[8]").press
   session.findById("wnd[0]/tbar[0]/btn[3]").press
   objExcel.Cells(i,7).Value = "10"

   session.findById("wnd[0]/usr/ctxtP_VTWEG").text = "30"      
   session.findById("wnd[0]/usr/ctxtP_VTWEG").setFocus
   session.findById("wnd[0]/usr/ctxtP_VTWEG").caretPosition = 2
   session.findById("wnd[0]/tbar[1]/btn[8]").press
   session.findById("wnd[0]/tbar[0]/btn[3]").press
   objExcel.Cells(i,8).Value = "30"
  
next
msgbox "Perfecto"
