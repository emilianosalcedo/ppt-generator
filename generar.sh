#!/bin/sh

mkdir -p input output

# Validar que exista al menos un .md si no se pasa argumento
count=$(ls -1q input/*.md 2>/dev/null | wc -l)

if [ -z "${1}" ] && [ "${count}" -eq 0 ]; then
    printf "❌ Error: No se encontró ningún archivo Markdown (.md) en la carpeta input/\n"
    printf "💡 Por favor, agrega tu contenido allí o especifica el nombre del archivo: ./generar.sh archivo.md\n"
    exit 1
fi

printf "🚀 Construyendo el contenedor y generando presentación...\n"

if [ -n "$1" ]; then
    DOCKER_BUILDKIT=1 docker-compose run --build --rm ppt node index.js "${1}"
else
    DOCKER_BUILDKIT=1 docker-compose run --build --rm ppt node index.js
fi

printf "\n✅ Proceso finalizado. Puedes encontrar tu archivo generado en la carpeta: ./output/\n"
