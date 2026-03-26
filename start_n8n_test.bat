@echo off
setlocal

echo Starting isolated n8n test instance with BugSmash custom extensions...
echo.

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

set "N8N_USER_FOLDER=%USERPROFILE%\.n8n_bugsmash_test"
call "%ROOT_DIR%\prepare_selfhost_test.bat"
set "N8N_CUSTOM_EXTENSIONS=%ROOT_DIR%\custom_ext_bugsmash_clean"
set "N8N_DIAGNOSTICS_ENABLED=false"
set "N8N_VERSION_NOTIFICATIONS_ENABLED=false"
set "N8N_DISABLE_VERSION_CHECK=true"
set "N8N_USER_MANAGEMENT_DISABLED=true"
set "NODES_EXCLUDE=n8n-nodes-base.langchain"
set "DEBUG=n8n:*"

echo Using custom extensions from:
echo %N8N_CUSTOM_EXTENSIONS%
echo.

npx n8n start --port 5680
