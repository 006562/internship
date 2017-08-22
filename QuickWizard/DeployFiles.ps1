robocopy $PSScriptRoot E:\TSSWCFServices\QuickWizard\  /mir /XF *.pdb *.ps1 *.csproj* *.Debug.config *.Release.config /XD obj Properties App_Data

write-host "done!" -foregroundcolor Green