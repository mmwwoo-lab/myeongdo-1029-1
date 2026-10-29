$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$index = Join-Path $root 'index.html'
if (-not (Test-Path -LiteralPath $index)) { throw 'index.html was not found in this folder.' }
$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)
$ids = @('cosmos','contemporary','mountain','persimmon','portrait','seal')
$images = @()
foreach ($id in $ids) {
  $path = Join-Path $root "assets/images/$id.webp"
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing image: $path" }
  $uri = 'data:image/webp;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes($path))
  $images += "'$id':'$uri'"
  $html = $html.Replace(('src="assets/images/' + $id + '.webp"'), ('src="' + $uri + '"'))
}
$music = @()
foreach ($id in @('cosmos','contemporary','mountain','persimmon')) {
  $path = Join-Path $root "assets/music/$id.mp3"
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing music: $path" }
  $uri = 'data:audio/mpeg;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes($path))
  $music += "'$id':'$uri'"
}
$html = $html.Replace('src="assets/images/${esc(w.id)}.webp"', 'src="${offlineImage(w.id)}"')
$html = $html.Replace('src="assets/music/${esc(w.id)}.mp3"', 'src="${offlineMusic(w.id)}"')
$js = 'const __offlineImages={' + ($images -join ',') + '};const __offlineMusic={' + ($music -join ',') + '};function offlineImage(id){return __offlineImages[id]||"";}function offlineMusic(id){return __offlineMusic[id]||"";}'
$html = $html.Replace('<script>', '<script>' + $js)
$out = Join-Path $root 'myeongdo-chrome-offline.html'
[IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Chrome offline homepage created: $out"