# tools/bundle-project.ps1  (ASCII-only, safe in any encoding)
param(
    [string]$OutputFile = "project-bundle.md",
    [string]$Root = (Get-Location).Path
)

Set-Location $Root
$Root = (Get-Location).Path

$excludeDirs = @(
    'node_modules', '.next', '.git', 'dist', 'build', 'coverage',
    '.turbo', '.vercel', 'out', '.idea', '.vscode', '.cache'
)

$excludeFileGlobs = @(
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'next-env.d.ts',
    'tree.txt', 'tree-security.txt',
    'project-bundle.md', 'security-bundle.md',
    '*.log',
    'public/**/*.png', 'public/**/*.jpg', 'public/**/*.jpeg',
    'public/**/*.svg', 'public/**/*.gif', 'public/**/*.webp',
    'public/**/*.ico',
    '**/*.map'
)

$binaryExt = @('.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip',
               '.woff','.woff2','.ttf','.otf','.mp4','.mp3','.lock')

# --- custom recursive walk that PRUNES excluded dirs (no descent) ---
$allFiles = New-Object System.Collections.Generic.List[object]

function Walk {
    param([string]$Dir, [string]$RelPrefix)

    Get-ChildItem -LiteralPath $Dir -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $item = $_

        # skip symlinks / junctions to avoid loops
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }

        $rel = if ($RelPrefix) { "$RelPrefix/$($item.Name)" } else { $item.Name }

        if ($item.PSIsContainer) {
            if ($excludeDirs -contains $item.Name) { return }   # prune
            Walk -Dir $item.FullName -RelPrefix $rel
        } else {
            foreach ($glob in $excludeFileGlobs) {
                if ($rel -like $glob) { return }
            }
            $allFiles.Add([pscustomobject]@{
                Full = $item.FullName
                Rel  = $rel
                Ext  = $item.Extension.ToLower()
            })
        }
    }
}

Walk -Dir $Root -RelPrefix ''

$allFiles = $allFiles | Sort-Object Rel

# --- build tree (ASCII) ---
$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add((Split-Path $Root -Leaf) + '/')

$tree = @{}
foreach ($f in $allFiles) {
    $parts = $f.Rel -split '/'
    $node = $tree
    for ($i=0; $i -lt $parts.Count; $i++) {
        $p = $parts[$i]
        $isFile = ($i -eq $parts.Count - 1)
        if ($isFile) { $node[$p] = $null }
        else {
            if (-not $node.ContainsKey($p)) { $node[$p] = @{} }
            $node = $node[$p]
        }
    }
}

function Render-Tree {
    param($Node, [string]$Prefix)
    $keys = $Node.Keys | Sort-Object {
        if ($Node[$_] -eq $null) { 1 } else { 0 }
    }, { $_ }
    for ($i=0; $i -lt $keys.Count; $i++) {
        $k = $keys[$i]
        $isLast = ($i -eq $keys.Count - 1)
        $conn = if ($isLast) { '\-- ' } else { '|-- ' }
        $suffix = if ($Node[$k] -eq $null) { '' } else { '/' }
        $script:treeLines.Add("$Prefix$conn$k$suffix")
        if ($Node[$k] -ne $null) {
            $newPrefix = $Prefix + $(if ($isLast) { '    ' } else { '|   ' })
            Render-Tree -Node $Node[$k] -Prefix $newPrefix
        }
    }
}
Render-Tree -Node $tree -Prefix ''

function Get-Lang {
    param([string]$Ext)
    switch ($Ext) {
        '.ts'   { 'ts' }   '.tsx' { 'tsx' }  '.js'  { 'js' }
        '.jsx'  { 'jsx' }  '.mjs' { 'js' }   '.cjs' { 'js' }
        '.json' { 'json' } '.css' { 'css' }  '.scss'{ 'scss' }
        '.html' { 'html' } '.md'  { 'md' }
        '.yml'  { 'yaml' } '.yaml'{ 'yaml' }
        '.ps1'  { 'powershell' }
        '.sql'  { 'sql' }
        '.env'  { 'bash' }
        default { '' }
    }
}

# --- stream output directly to file (no StringBuilder) ---
$outPath = Join-Path $Root $OutputFile
$utf8 = New-Object System.Text.UTF8Encoding($false)  # no BOM
$sw = New-Object System.IO.StreamWriter($outPath, $false, $utf8)

try {
    $sw.WriteLine("# Project bundle")
    $sw.WriteLine()
    $sw.WriteLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
    $sw.WriteLine("Root: $Root")
    $sw.WriteLine()
    $sw.WriteLine("## Tree")
    $sw.WriteLine()
    $sw.WriteLine('```')
    foreach ($line in $treeLines) { $sw.WriteLine($line) }
    $sw.WriteLine('```')
    $sw.WriteLine()
    $sw.WriteLine("## Files")
    $sw.WriteLine()

    foreach ($f in $allFiles) {
        $rel = $f.Rel
        $isEnv = (Split-Path $rel -Leaf) -like '.env*'

        if ($binaryExt -contains $f.Ext) {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_binary file, content skipped_")
            $sw.WriteLine()
            continue
        }

        $content = $null
        try {
            $content = Get-Content -LiteralPath $f.Full -Raw -Encoding utf8 -ErrorAction Stop
        } catch {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_read error: $($_.Exception.Message)_")
            $sw.WriteLine()
            continue
        }
        if ($null -eq $content) { $content = '' }

        $lang = Get-Lang $f.Ext

        if ($isEnv) {
            $content = ($content -split "`r?`n" | ForEach-Object {
                if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$') {
                    "$($Matches[1])=***REDACTED***"
                } else { $_ }
            }) -join "`n"
            $lang = 'bash'
        }

        $sw.WriteLine("### ``$rel``")
        $sw.WriteLine()
        $sw.WriteLine("````$lang")
        $sw.WriteLine($content)
        $sw.WriteLine('````')
        $sw.WriteLine()
    }
}
finally {
    $sw.Flush()
    $sw.Close()
}

$sizeKb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
Write-Host "OK: $outPath"
Write-Host "   Files: $($allFiles.Count)"
Write-Host "   Size:  $sizeKb KB"