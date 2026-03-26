@echo off
setlocal

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

set "TARGET_DIR=%ROOT_DIR%\custom_ext_bugsmash_clean\node_modules\n8n-nodes-bugsmash"

echo Preparing clean self-hosted test package...

if exist "%TARGET_DIR%" rmdir /S /Q "%TARGET_DIR%"

mkdir "%TARGET_DIR%"
mkdir "%TARGET_DIR%\dist"

copy /Y "%ROOT_DIR%\package.json" "%TARGET_DIR%\package.json" >nul
copy /Y "%ROOT_DIR%\README.md" "%TARGET_DIR%\README.md" >nul
copy /Y "%ROOT_DIR%\LICENSE.md" "%TARGET_DIR%\LICENSE.md" >nul
xcopy "%ROOT_DIR%\dist" "%TARGET_DIR%\dist" /E /I /Y >nul

echo Clean test package ready at:
echo %TARGET_DIR%
