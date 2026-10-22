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