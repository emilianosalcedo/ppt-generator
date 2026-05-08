@echo off
setlocal

if not exist "input" mkdir "input"
if not exist "output" mkdir "output"

:: Contar archivos .md en la carpeta input
set count=0
for %%A in (input\*.md) do set /a count+=1

if "%~1"=="" (
    if %count%==0 (
        echo ❌ Error: No se encontro ningun archivo Markdown ^(.md^) en la carpeta input\
        echo 💡 Por favor, agrega tu contenido alli o especifica el nombre del archivo: generar.bat archivo.md
        exit /b 1
    )
)

echo 🚀 Construyendo el contenedor y generando presentacion...

if "%~1"=="" (
    set DOCKER_BUILDKIT=1
    docker-compose run --build --rm ppt node index.js
) else (
    set DOCKER_BUILDKIT=1
    docker-compose run --build --rm ppt node index.js "%~1"
)

echo.
echo ✅ Proceso finalizado. Puedes encontrar tu archivo generado en la carpeta: .\output\
exit /b 0
