# Project bundle

Generated: 2026-10-22 16:22
Root: C:\Users\Lenovo\Downloads\event_mp\namylimsya-app\tools

## Tree

```
tools/
|-- bundle-project.ps1
\-- bundle-security-md.ps1
```

## Files

### `bundle-project.ps1`

``powershell
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
````

### `bundle-security-md.ps1`

``powershell
<#
.SYNOPSIS
  Собирает один Markdown-файл из выбранных файлов проекта для аудита агентом.
.DESCRIPTION
  - Оглавление с размерами и количеством строк
  - Дерево проекта
  - Содержимое каждого файла в code-блоке с указанием языка
  - .env.local маскируется (значения -> <REDACTED>, кроме NEXT_PUBLIC_*)
#>
param(
    [string]$Output = "security-bundle.md"
)

# ==== СПИСОК НУЖНЫХ ФАЙЛОВ ====
$include = @(
    # Root
    "next.config.ts",
    "package.json",
    "tsconfig.json",
    "proxy.ts",
    "eslint.config.mjs",
    ".gitignore",
    ".env.local",
    "AGENTS.md",
    "README.md",
    # App
    "app/layout.tsx",
    "app/page.tsx",
    "app/loading.tsx",
    "app/globals.css",
    "app/actions.ts",
    "app/event/[id]/page.tsx",
    "app/login/page.tsx",
    "app/my-events/page.tsx",
    "app/my-events/loading.tsx",
    "app/[username]/page.tsx",
    # Lib
    "lib/supabase.ts",
    "lib/supabase-server.ts",
    # Components
    "components/ApplicationActions.tsx",
    "components/AvatarPicker.tsx",
    "components/CategoryIcon.tsx",
    "components/Countdown.tsx",
    "components/CreateEventForm.tsx",
    "components/EventCard.tsx",
    "components/EventChat.tsx",
    "components/EventList.tsx",
    "components/Header.tsx",
    "components/MobileFilters.tsx",
    "components/NotificationsBell.tsx",
    "components/PageTransition.tsx",
    "components/Sidebar.tsx"
)

# ==== СБОР ФАЙЛОВ ====
$root = (Get-Location).Path
$files = $include | ForEach-Object {
    if (Test-Path $_) { Get-Item $_ }
} | Where-Object { -not $_.PSIsContainer } | Sort-Object FullName -Unique

if (-not $files) {
    Write-Host "Не найдено ни одного файла. Запустите из корня проекта." -ForegroundColor Red
    exit 1
}

# ==== МАСКИРОВАНИЕ .env ====
function Mask-EnvContent {
    param([string]$Path)
    $lines = Get-Content -LiteralPath $Path
    $result = foreach ($line in $lines) {
        # Комментарии и пустые строки — оставить как есть
        if ($line -match '^\s*#' -or $line.Trim() -eq '') { $line; continue }
        # KEY=VALUE
        if ($line -match '^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $key = $Matches[2]
            $val = $Matches[3]
            if ($key -like 'NEXT_PUBLIC_*') {
                # Публичные ключи — показываем, но помечаем
                "$key=$val   # ⚠️ PUBLIC: виден в браузере"
            } else {
                "$key=<REDACTED>"
            }
        } else {
            $line
        }
    }
    return ($result -join "`n")
}

# ==== ЯЗЫК ДЛЯ ПОДСВЕТКИ ====
$extToLang = @{
    '.tsx' = 'tsx'; '.ts' = 'ts'; '.jsx' = 'jsx'; '.js' = 'js'
    '.json' = 'json'; '.css' = 'css'; '.scss' = 'scss'; '.md' = 'md'
    '.html' = 'html'; '.ps1' = 'powershell'; '.mjs' = 'js'
    '.yml' = 'yaml'; '.yaml' = 'yaml'
}

# ==== СБОРКА MARKDOWN ====
$sb = [System.Text.StringBuilder]::new()

# Заголовок
[void]$sb.AppendLine("# Security & Improvements Audit Bundle")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("> **Для ИИ-агента.** Проанализируй проект на безопасность (OWASP Top 10, " +
    "Next.js App Router + Supabase, server actions, RLS, IDOR, XSS через user input, " +
    "утечки через Realtime) и предложи улучшения (архитектура, производительность, " +
    "читаемость, дублирование).")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("**Метаинформация**")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| Поле | Значение |")
[void]$sb.AppendLine("|---|---|")
[void]$sb.AppendLine("| Собрано | $(Get-Date -Format 'yyyy-MM-dd HH:mm') |")
[void]$sb.AppendLine("| Файлов | $($files.Count) |")
[void]$sb.AppendLine("| Проект | $((Split-Path $root -Leaf)) |")
[void]$sb.AppendLine("")

# Оглавление
[void]$sb.AppendLine("## Оглавление")
[void]$sb.AppendLine("")
$i = 1
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $lines = (Get-Content -LiteralPath $file.FullName).Count
    $sizeKb = [math]::Round($file.Length / 1KB, 1)
    $anchor = ($rel -replace '[^\w\- ]','').ToLower() -replace ' ','-'
    [void]$sb.AppendLine("$i. [$rel](#$anchor) — $lines строк, $sizeKb KB")
    $i++
}
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Дерево (плоский список, т.к. иерархия уже есть в оглавлении)
[void]$sb.AppendLine("## Структура (только включённые файлы)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine('```')
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    [void]$sb.AppendLine($rel)
}
[void]$sb.AppendLine('```')
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Содержимое
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $ext = $file.Extension.ToLower()
    $lang = if ($extToLang.ContainsKey($ext)) { $extToLang[$ext] } else { '' }

    [void]$sb.AppendLine("## $rel")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine('```' + $lang)

    if ($file.Name -eq '.env.local' -or $file.Name -like '.env*') {
        [void]$sb.AppendLine((Mask-EnvContent -Path $file.FullName))
    } else {
        [void]$sb.AppendLine((Get-Content -LiteralPath $file.FullName -Raw))
    }

    [void]$sb.AppendLine('```')
    [void]$sb.AppendLine("")
}

# Запись в UTF-8 без BOM
[System.IO.File]::WriteAllText(
    (Join-Path $root $Output),
    $sb.ToString(),
    [System.Text.UTF8Encoding]::new($false)
)

$sizeKb = [math]::Round((Get-Item $Output).Length / 1KB, 1)
Write-Host "Готово: $Output ($($files.Count) файлов, $sizeKb KB)" -ForegroundColor Green
````

