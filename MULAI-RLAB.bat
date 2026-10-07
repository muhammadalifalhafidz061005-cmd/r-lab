@echo off
REM ==========================================================
REM  R-LAB Smart Sorting - Penjalan otomatis
REM  Klik file ini untuk menyalakan server + membuka dashboard
REM  PENTING: harus lewat file ini, JANGAN buka index.html langsung,
REM  karena API key hanya dibaca server.ps1 (browser tidak boleh punya key).
REM ==========================================================
title R-LAB Server

echo.
echo   ============================================
echo    R-LAB Smart Sorting - Server Lokal
echo   ============================================
echo.
echo   Menyiapkan server, browser akan terbuka otomatis.
echo   JANGAN tutup jendela ini selama demo berlangsung.
echo.

REM Tunggu server siap (maks 30 detik), baru buka browser.
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0buka-dashboard.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"

echo.
echo   Server dihentikan.
pause
