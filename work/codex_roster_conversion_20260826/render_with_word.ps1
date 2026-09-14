$ErrorActionPreference = 'Stop'

$inputDocx = 'D:\codewithshreya\outputs\Lord Krishna Residency RWA - Updated Committee List.docx'
$outputPdf = 'D:\codewithshreya\work\codex_roster_conversion_20260826\render_word\roster.pdf'
$outputDir = Split-Path -Parent $outputPdf
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$word = $null
$document = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $document = $word.Documents.Open($inputDocx, $false, $true)
    $document.ExportAsFixedFormat($outputPdf, 17)
    $document.Close(0)
    $document = $null
}
finally {
    if ($document -ne $null) {
        $document.Close(0)
    }
    if ($word -ne $null) {
        $word.Quit()
    }
}

Write-Output $outputPdf
