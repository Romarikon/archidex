@echo off
echo ============================
echo   SUBIR PROYECTO A GITHUB
echo ============================

:: Mensaje de commit
set /p mensaje=Escribe el mensaje del commit: 

:: Rama (por defecto main)
set rama=main

echo.
echo Añadiendo cambios...
git add .

echo.
echo Haciendo commit...
git commit -m "%mensaje%"

echo.
echo Subiendo a GitHub...
git push origin %rama%

echo.
echo ============================
echo   PROCESO COMPLETADO
echo ============================

pause