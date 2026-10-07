# =====================================================================
#  R-LAB Smart Sorting — Server Lokal (Reverse Proxy)
#  Fungsi:
#    1. Menyajikan file statis (index.html, guest.html, assets, logo)
#    2. /api/chat  -> Gemini primer, Groq + OpenRouter cadangan (kunci API TIDAK PERNAH ke browser)
#    3. /api/tts   -> Google Translate TTS (suara natural, ~1 detik)
#    4. /api/tts-neural -> Gemini TTS (suara paling natural, ~6 detik)
#
#  Keamanan:
#    - Kunci API disimpan di  _secrets\keys.json  (DI LUAR folder web)
#    - Server hanya bind ke 127.0.0.1 (tidak bisa diakses dari jaringan)
#    - Tidak ada endpoint yang mengembalikan kunci API
#
#  Jalankan:  powershell -ExecutionPolicy Bypass -File server.ps1
#  Buka:     http://localhost:8080/
# =====================================================================

$ErrorActionPreference = 'Stop'
$PORT      = 8080
$ROOT      = $PSScriptRoot
$SECRETS   = Join-Path (Split-Path -Parent $ROOT) '_secrets'
$KEYS_FILE = Join-Path $SECRETS 'keys.json'

if (-not (Test-Path -LiteralPath $KEYS_FILE)) {
  Write-Host "[FATAL] File kunci tidak ditemukan: $KEYS_FILE" -ForegroundColor Red
  Write-Host "Buat folder _secrets di luar folder web, lalu isi keys.json:" -ForegroundColor Yellow
  Write-Host '  { "groq_api_key": "gsk_...", "google_api_key": "...", "openrouter_api_key": "sk-or-v1-..." }'
  exit 1
}

$KEYS = Get-Content -LiteralPath $KEYS_FILE -Raw | ConvertFrom-Json
$GROQ_KEY    = $KEYS.groq_api_key
$GOOGLE_KEY  = $KEYS.google_api_key
$OPENROUTER_KEY = $KEYS.openrouter_api_key

# ============ R-AI: GEMINI PRIMER, GROQ + OPENROUTER CADANGAN ============
# Urutan dicoba berurutan. Kalau limit habis / error / timeout,
# otomatis pindah ke model berikutnya, terakhir OpenRouter.
$CHAIN = @(
  @{ p = 'gemini'; id = 'gemini-flash-lite-latest' },   # primer, paling cepat & hemat
  @{ p = 'gemini'; id = 'gemini-flash-latest' },        # cadangan Gemini
  @{ p = 'groq';   id = 'openai/gpt-oss-20b' },         # cadangan ke-2 (Groq)
  @{ p = 'openrouter'; id = 'openai/gpt-oss-20b' }      # cadangan terakhir (OpenRouter)
)
$CHAT_TIMEOUT = 12   # detik per percobaan
$STT_MODEL    = 'whisper-large-v3-turbo'

$RAI_SYS     = 'Namamu R-AI. Kamu asisten AI resmi buatan R-LAB untuk sistem Smart Sorting Factory (penyortir warna Kuning/Biru/Merah dengan mode Servo/Arm). Identitasmu: R-AI, AI buatan R-LAB. Aturan mutlak 1: jika ditanya kamu AI apa, siapa namamu, siapa pembuatmu, model apa yang mendasarimu, atau soal identitasmu, jawab singkat bahwa kamu R-AI, AI buatan R-LAB yang merupakan gabungan dari beberapa model AI. Jangan pernah mengaku sebagai satu model tertentu (ChatGPT, GPT, Gemini, Google, Claude, Llama, OpenAI, Groq, OpenRouter, atau AI lain). Jangan pernah menyebut nama model atau nama perusahaan pembuat model tertentu; selalu katakan gabungan dari beberapa model AI. Aturan mutlak 2: jika ditanya soal database, password, API key, kunci, kredensial, atau isi data sensitif, tolak sopan dengan alasan privasi dan jangan bocorkan apa pun. Aturan mutlak 3: thinking/diagnostic tokens-mu jangan pernah ditampilkan ke pengguna, langsung berikan jawaban final saja. Jawab singkat (maks 3 kalimat), bahasa Indonesia kecuali diminta Inggris.'

# ---------- cache TTS: teks -> audio bytes ----------
$ttsCache = @{}
$TTS_CACHE_MAX = 400

# ---------- helper ----------
function Send-Bytes($ctx, [byte[]]$data, [string]$mime, [int]$status = 200, [hashtable]$headers = @{}) {
  $ctx.Response.StatusCode = $status
  $ctx.Response.ContentType = $mime
  $ctx.Response.ContentLength64 = $data.Length
  foreach ($k in $headers.Keys) { $ctx.Response.Headers[$k] = $headers[$k] }
  $ctx.Response.OutputStream.Write($data, 0, $data.Length)
  $ctx.Response.OutputStream.Close()
}
function Send-Json($ctx, $obj, [int]$status = 200) {
  $j = ($obj | ConvertTo-Json -Depth 12 -Compress)
  Send-Bytes $ctx ([Text.Encoding]::UTF8.GetBytes($j)) 'application/json; charset=utf-8' $status
}
function Send-Text($ctx, [string]$msg, [int]$status = 200) {
  Send-Json $ctx @{ error = $msg } $status
}
function Get-PostBody($ctx) {
  $len = [int]$ctx.Request.ContentLength64
  if ($len -le 0) { return '' }
  $sr = New-Object IO.StreamReader($ctx.Request.InputStream, [Text.Encoding]::UTF8)
  $b = $sr.ReadToEnd(); $sr.Close()
  return $b
}

# ---------- static file serving ----------
$MIME = @{
  '.html' = 'text/html; charset=utf-8'; '.js'  = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8';     '.json'= 'application/json; charset=utf-8'
  '.png'  = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'; '.ico' = 'image/x-icon'
  '.woff2'= 'font/woff2'; '.woff' = 'font/woff'; '.ttf' = 'font/ttf'
  '.txt'  = 'text/plain; charset=utf-8'; '.mp3' = 'audio/mpeg'; '.wav' = 'audio/wav'; '.csv' = 'text/csv; charset=utf-8'
}
$ALLOW_EXT = @('.html','.js','.css','.json','.png','.jpg','.jpeg','.svg','.ico','.woff2','.woff','.ttf','.txt','.mp3','.wav','.csv')
# nama file yang DILARANG untuk diserve (risiko bocor secret / script server)
$DENY = @('server.ps1','keys.json','secrets.json','.env','.git','.gitconfig','web.config')

function Serve-Static($ctx, [string]$urlPath) {
  $rel = [uri]::UnescapeDataString($urlPath.TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }

  # normalisasi + cegah path traversal
  $full = [IO.Path]::GetFullPath((Join-Path $ROOT $rel))
  if (-not $full.StartsWith([IO.Path]::GetFullPath($ROOT), [StringComparison]::OrdinalIgnoreCase)) {
    Send-Text $ctx 'Forbidden' 403; return
  }
  if (-not (Test-Path -LiteralPath $full)) { Send-Text $ctx 'Not found' 404; return }

  $leaf = Split-Path -Leaf $full
  foreach ($d in $DENY) { if ($leaf -like "*$d*") { Send-Text $ctx 'Forbidden' 403; return } }

  if ((Get-Item -LiteralPath $full).PSIsContainer) { $full = Join-Path $full 'index.html' }
  $ext = ([IO.Path]::GetExtension($full)).ToLower()
  if ($ALLOW_EXT -notcontains $ext) { Send-Text $ctx 'Forbidden' 403; return }
  if (-not (Test-Path -LiteralPath $full)) { Send-Text $ctx 'Not found' 404; return }

  $bytes = [IO.File]::ReadAllBytes($full)
  $mime  = if ($MIME.ContainsKey($ext)) { $MIME[$ext] } else { 'application/octet-stream' }
  Send-Bytes $ctx $bytes $mime 200 @{ 'Cache-Control' = 'no-store' }
}

# ---------- /api/chat : GEMINI primer -> GROQ -> OPENROUTER cadangan ----------
function Ask-Gemini($model, $userMsg) {
  $parts = @(@{ text = $RAI_SYS }, @{ text = $userMsg })
  $payload = @{
    contents          = @(,@{ parts = $parts })
    generationConfig  = @{ temperature = 0.3; maxOutputTokens = 512 }
  } | ConvertTo-Json -Depth 10
  $r = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent" -Method Post `
       -Headers @{ 'X-goog-api-key' = $GOOGLE_KEY } -ContentType 'application/json' `
       -Body $payload -TimeoutSec $CHAT_TIMEOUT
  $cand = $r.candidates[0]
  if ($cand.finishReason -eq 'MAX_TOKENS') { throw 'terpotong' }
  $txt = ($cand.content.parts | ForEach-Object { $_.text }) -join ''
  if (-not $txt) { throw 'kosong' }
  return [string]$txt
}
function Ask-Groq($model, $userMsg) {
  $payload = @{
    model            = $model
    messages         = @(@{ role = 'system'; content = $RAI_SYS }, @{ role = 'user'; content = $userMsg })
    temperature      = 0.3
    max_tokens       = 512
    reasoning_effort = 'low'
  } | ConvertTo-Json -Depth 10
  $r = Invoke-RestMethod -Uri 'https://api.groq.com/openai/v1/chat/completions' -Method Post `
       -Headers @{ Authorization = "Bearer $GROQ_KEY" } -ContentType 'application/json' `
       -Body $payload -TimeoutSec $CHAT_TIMEOUT
  $txt = $r.choices[0].message.content
  if (-not $txt) { throw 'kosong' }
  return [string]$txt
}
function Ask-OpenRouter($model, $userMsg) {
  if (-not $OPENROUTER_KEY) { throw 'openrouter key kosong' }
  $payload = @{
    model            = $model
    messages         = @(@{ role = 'system'; content = $RAI_SYS }, @{ role = 'user'; content = $userMsg })
    temperature      = 0.3
    max_tokens       = 512
  } | ConvertTo-Json -Depth 10
  $r = Invoke-RestMethod -Uri 'https://openrouter.ai/api/v1/chat/completions' -Method Post `
       -Headers @{ Authorization = "Bearer $OPENROUTER_KEY"; 'HTTP-Referer' = 'http://localhost:8080/'; 'X-Title' = 'R-LAB R-AI' } `
       -ContentType 'application/json' -Body $payload -TimeoutSec $CHAT_TIMEOUT
  $txt = $r.choices[0].message.content
  if (-not $txt) { throw 'kosong' }
  return [string]$txt
}

function Handle-Chat($ctx) {
  $raw = Get-PostBody $ctx
  $req = $raw | ConvertFrom-Json
  $q   = [string]$req.q
  if ([string]::IsNullOrWhiteSpace($q)) { Send-Text $ctx 'q kosong' 400; return }
  if ($q.Length -gt 2000) { $q = $q.Substring(0, 2000) }

  $actionRule = "`nAturan aksi: jika pengguna MEMERINTAH aksi perangkat, akhiri jawaban dengan TEPAT SATU tag: [MODE:Arm] [MODE:Servo] [PAUSE] [RESUME] [TIMEOUT] [MISSORT] [EXPORT:pdf] [EXPORT:xlsx] [EXPORT:csv]. Jika hanya bertanya atau mengobrol, tanpa tag sama sekali."
  $ctxText = [string]$req.context
  $userMsg = if ($ctxText) { $ctxText + "`nPesan pengguna: " + $q + $actionRule } else { $q + $actionRule }

  $log = @()
  foreach ($step in $CHAIN) {
    try {
      if ($step.p -eq 'gemini') {
        $txt = Ask-Gemini $step.id $userMsg
      } elseif ($step.p -eq 'groq') {
        $txt = Ask-Groq $step.id $userMsg
      } elseif ($step.p -eq 'openrouter') {
        $txt = Ask-OpenRouter $step.id $userMsg
      } else {
        throw ('provider tak dikenal: ' + $step.p)
      }
      Send-Json $ctx @{ reply = $txt; provider = $step.p; model = $step.id; fallback = ($log.Count -gt 0); tried = $log }
      return
    } catch {
      $code = 'error'
      if ($_.Exception.Response) { $code = [string]$_.Exception.Response.StatusCode.value__ }
      $msg = $_.Exception.Message
      if ($msg.Length -gt 140) { $msg = $msg.Substring(0, 140) }
      $log += ('{0} ({1}) {2}' -f $step.id, $code, $msg)
      Write-Host ("  [chat] {0} GAGAL -> pindah cadangan" -f $step.id) -ForegroundColor DarkYellow
    }
  }
  Send-Text $ctx ('Semua AI gagal: ' + ($log -join ' | ')) 502
}

# ---------- /api/stt : Groq Whisper (speech to text) ----------
function Handle-Stt($ctx) {
  $len = [int]$ctx.Request.ContentLength64
  if ($len -le 0) { Send-Text $ctx 'audio kosong' 400; return }
  if ($len -gt 12MB) { Send-Text $ctx 'audio terlalu besar' 413; return }

  $raw = New-Object byte[] $len
  $ms  = New-Object IO.MemoryStream
  $ctx.Request.InputStream.Read($raw, 0, $len) | Out-Null
  $ms.Write($raw, 0, $raw.Length)
  $bytes = $raw

  $ctype = [string]$ctx.Request.ContentType
  $ext = 'webm'
  if ($ctype -match 'ogg') { $ext = 'ogg' }
  elseif ($ctype -match 'mp4|m4a') { $ext = 'm4a' }
  elseif ($ctype -match 'wav') { $ext = 'wav' }
  elseif ($ctype -match 'mpeg|mp3') { $ext = 'mp3' }
  elseif ($ctype -match 'aac') { $ext = 'aac' }
  elseif ($ctype -match 'flac') { $ext = 'flac' }
  if (-not $ext) { $ext = 'webm' }

  Add-Type -AssemblyName System.Net.Http
  $h = New-Object System.Net.Http.HttpClient
  $h.Timeout = [TimeSpan]::FromSeconds(45)
  $h.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $GROQ_KEY)
  $multi = New-Object System.Net.Http.MultipartFormDataContent
  $fc = New-Object System.Net.Http.ByteArrayContent -ArgumentList (,$bytes)
  $fc.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("audio/$ext")
  $multi.Add($fc, 'file', "speech.$ext")
  $multi.Add((New-Object System.Net.Http.StringContent($STT_MODEL)), 'model')
  $multi.Add((New-Object System.Net.Http.StringContent('0')), 'temperature')
  try {
    $resp = $h.PostAsync('https://api.groq.com/openai/v1/audio/transcriptions', $multi).Result
    $txt = $resp.Content.ReadAsStringAsync().Result
    if (-not $resp.IsSuccessStatusCode) { Send-Text $ctx ("STT gagal: " + $txt.Substring(0, [Math]::Min(200, $txt.Length))) 502; return }
    $j = $txt | ConvertFrom-Json
    if (-not $j.text) { Send-Text $ctx 'STT kosong' 502; return }
    # Whisper sering salah menulis nama brand (R.AI / R.I. / R.Lab) -> rapikan
    $clean = [string]$j.text
    $clean = $clean -replace '(?i)\bR[\.\- ]?(A\.?I\.?|AI)\b', 'R-AI'
    $clean = $clean -replace '(?i)\bR[\.\- ]?(L\.?A\.?B|LAB)\b', 'R-LAB'
    $clean = $clean -replace '(?i)\b(Air[\.\- ]?Lab|AirLab)\b', 'R-LAB'
    $clean = $clean -replace '(?i)\bR[\.\- ]?I[\.\-]?\b', 'R-AI'
    $clean = $clean -replace '\s{2,}', ' '
    $clean = $clean.Trim()
    Send-Json $ctx @{ text = $clean }
  } catch {
    Send-Text $ctx ('STT error: ' + $_.Exception.GetBaseException().Message) 502
  } finally {
    $multi.Dispose(); $h.Dispose()
  }
}

# ---------- /api/tts : Google Translate TTS (cepat ~1s) ----------
function Handle-Tts($ctx) {
  $raw = Get-PostBody $ctx
  $req = $raw | ConvertFrom-Json
  $txt = [string]$req.text
  $lang = if ($req.lang -eq 'en') { 'en' } else { 'id' }
  if ([string]::IsNullOrWhiteSpace($txt)) { Send-Text $ctx 'text kosong' 400; return }
  if ($txt.Length -gt 480) { $txt = $txt.Substring(0, 480) }

  $ck = "$lang|$txt"
  if ($ttsCache.ContainsKey($ck)) {
    Send-Bytes $ctx $ttsCache[$ck] 'audio/mpeg' 200 @{ 'X-TTS-Cache' = 'HIT' }
    return
  }

  $enc = [uri]::EscapeDataString($txt)
  $url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=$lang&ttsspeed=1&q=$enc"
  try {
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36')
    $bytes = $wc.DownloadData($url)
    $wc.Dispose()
    if (-not $bytes -or $bytes.Length -lt 900) { Send-Text $ctx 'TTS kosong' 502; return }
    if ($ttsCache.Count -ge $TTS_CACHE_MAX) { $ttsCache.Clear() }
    $ttsCache[$ck] = $bytes
    Send-Bytes $ctx $bytes 'audio/mpeg' 200 @{ 'Cache-Control' = 'no-store' }
  } catch {
    Send-Text $ctx ("TTS gagal: $($_.Exception.Message)") 502
  }
}

# ---------- /api/tts-neural : Gemini TTS (suara paling natural, kuota 10/hari gratis) ----------
# Circuit breaker: begitu kena 429 (RESOURCE_EXHAUSTED), engine ini dilewati
# selama $TTS_NEURAL_COOLDOWN menit supaya tidak membuang kuota & tidak
# memperlambat TTS utama.
$script:TtsNeuralUntil = [datetime]::MinValue
$TTS_NEURAL_COOLDOWN = 45

function Write-Log($m) { Write-Host ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $m) }

function Handle-TtsNeural($ctx) {
  if ([datetime]::UtcNow -lt $script:TtsNeuralUntil) {
    Send-Text $ctx 'Gemini TTS sedang cooldown (kuota harian habis)' 503
    return
  }
  $raw = Get-PostBody $ctx
  $req = $raw | ConvertFrom-Json
  $txt = [string]$req.text
  $voice = if ($req.voice) { [string]$req.voice } else { 'Kore' }
  if ([string]::IsNullOrWhiteSpace($txt)) { Send-Text $ctx 'text kosong' 400; return }
  if ($txt.Length -gt 480) { $txt = $txt.Substring(0, 480) }

  $ck = "N|$voice|$txt"
  if ($ttsCache.ContainsKey($ck)) {
    Send-Bytes $ctx $ttsCache[$ck] 'audio/wav' 200 @{ 'X-TTS-Cache' = 'HIT' }
    return
  }

  $payload = @{
    contents = @(@{ parts = @(@{ text = $txt }) })
    generationConfig = @{
      responseModalities = @('AUDIO')
      speechConfig = @{ voiceConfig = @{ prebuiltVoiceConfig = @{ voiceName = $voice } } }
    }
  } | ConvertTo-Json -Depth 10

  try {
    $r = Invoke-RestMethod -Uri 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent' `
         -Method Post -Headers @{ 'X-goog-api-key' = $GOOGLE_KEY } -ContentType 'application/json' `
         -Body $payload -TimeoutSec 45
    $cd = $r.candidates[0].content.parts[0].inlineData
    if (-not $cd) { Send-Text $ctx 'Tidak ada audio dari Gemini' 502; return }
    $pcm = [Convert]::FromBase64String($cd.data)

    # Bungkus PCM 16-bit mono 24000 Hz menjadi WAV (44 byte header) supaya bisa diputar browser.
    # BinaryWriter menulis little-endian persis seperti format WAV.
    $mstream = New-Object IO.MemoryStream
    $bw = New-Object IO.BinaryWriter($mstream)
    $bw.Write([Text.Encoding]::ASCII.GetBytes('RIFF'));  $bw.Write([int](36 + $pcm.Length))
    $bw.Write([Text.Encoding]::ASCII.GetBytes('WAVE'))
    $bw.Write([Text.Encoding]::ASCII.GetBytes('fmt '));   $bw.Write([int]16)
    $bw.Write([int16]1)      # AudioFormat = PCM
    $bw.Write([int16]1)      # NumChannels = mono
    $bw.Write([int]24000)    # SampleRate
    $bw.Write([int]48000)    # ByteRate = SampleRate * Channels * BytesPerSample
    $bw.Write([int16]2)      # BlockAlign = Channels * BytesPerSample
    $bw.Write([int16]16)     # BitsPerSample
    $bw.Write([Text.Encoding]::ASCII.GetBytes('data'));  $bw.Write([int]$pcm.Length)
    $bw.Write($pcm, 0, $pcm.Length)
    $bw.Flush()
    $wav = $mstream.ToArray()
    $bw.Dispose(); $mstream.Dispose()

    if ($wav.Length -ne (44 + $pcm.Length)) { Send-Text $ctx "WAV rusak ($($wav.Length) byte)" 500; return }
    if ($ttsCache.Count -ge $TTS_CACHE_MAX) { $ttsCache.Clear() }
    $ttsCache[$ck] = $wav
    Send-Bytes $ctx $wav 'audio/wav' 200 @{ 'Cache-Control' = 'no-store' }
  } catch {
    $msg = $_.Exception.Message
    if ($_.Exception.Response) { $msg = "HTTP $($_.Exception.Response.StatusCode.value__)" }
    # 429 = kuota harian habis -> nyalakan cooldown supaya request berikutnya
    # langsung dilepas (503) tanpa memanggil Google lagi.
    if ($msg -match '429') {
      $script:TtsNeuralUntil = [datetime]::UtcNow.AddMinutes($TTS_NEURAL_COOLDOWN)
      Write-Log "Gemini TTS kena kuota (429) -> cooldown $TTS_NEURAL_COOLDOWN menit"
    }
    Send-Text $ctx ("Gemini TTS gagal: $msg") 502
  }
}

# ---------- /api/health ----------
function Handle-Health($ctx) {
  Send-Json $ctx @{
    ok = $true
    chain = @($CHAIN | ForEach-Object { "$($_.p):$($_.id)" })
    stt = $STT_MODEL
    tts = @('translate', 'gemini-neural')
    ts = (Get-Date).ToString('o')
  }
}

# ---------- start ----------
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$PORT/")
$listener.Prefixes.Add("http://127.0.0.1:$PORT/")
try {
  $listener.Start()
} catch {
  Write-Host "[FATAL] Gagal bind port $PORT. Coba tutup Live Server / aplikasi lain, atau edit `$PORT di script ini." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor DarkRed
  exit 1
}

Write-Host ''
Write-Host '  ============================================================' -ForegroundColor Cyan
Write-Host '   R-LAB Smart Sorting - Server Lokal' -ForegroundColor Cyan
Write-Host '  ============================================================' -ForegroundColor Cyan
Write-Host ("   Buka        : http://localhost:$PORT/") -ForegroundColor Green
Write-Host ("   Admin       : http://localhost:$PORT/index.html") -ForegroundColor Green
Write-Host ("   Guest       : http://localhost:$PORT/guest.html") -ForegroundColor Green
Write-Host ("   AI (primer) : " + (($CHAIN | ForEach-Object { $_.id }) -join '  ->  ')) -ForegroundColor Gray
Write-Host ("   STT         : $STT_MODEL (Groq Whisper)") -ForegroundColor Gray
Write-Host ("   Kunci API   : tersimpan di $KEYS_FILE") -ForegroundColor Gray
Write-Host ("                  (TIDAK pernah dikirim ke browser)") -ForegroundColor DarkGray
Write-Host '   Tekan Ctrl+C untuk stop' -ForegroundColor DarkGray
Write-Host '  ============================================================' -ForegroundColor Cyan
Write-Host ''

while ($listener.IsListening) {
  $ctx = $null
  try {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.AbsolutePath
    $meth = $ctx.Request.HttpMethod

    if ($path -eq '/api/health' -and $meth -eq 'GET')        { Handle-Health $ctx }
    elseif ($path -eq '/api/chat' -and $meth -eq 'POST')     { Handle-Chat $ctx }
    elseif ($path -eq '/api/stt' -and $meth -eq 'POST')      { Handle-Stt $ctx }
    elseif ($path -eq '/api/tts' -and $meth -eq 'POST')      { Handle-Tts $ctx }
    elseif ($path -eq '/api/tts-neural' -and $meth -eq 'POST'){ Handle-TtsNeural $ctx }
    elseif ($path -eq '/favicon.ico')                        { Send-Text $ctx 'no favicon' 404 }
    else { Serve-Static $ctx $path }

    $ctx.Response.KeepAlive = $true
  } catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor DarkYellow
    if ($ctx -and $ctx.Response) { try { $ctx.Response.Abort() } catch {} }
  }
}
