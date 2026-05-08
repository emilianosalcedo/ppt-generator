# 📊 Markdown to PPT Generator

[![Docker Build](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Una herramienta ligera y portátil para generar presentaciones de PowerPoint (`.pptx`) a partir de archivos Markdown (`.md`). Diseñada para ser fácil de usar por usuarios no técnicos y construida sobre Docker para no requerir instalación de NodeJS ni dependencias locales.

> **💡 Nota sobre Pandoc:** Esta herramienta puede considerarse una alternativa simplificada y altamente enfocada frente a `pandoc`. Mientras que Pandoc es un conversor universal (y pesado) para múltiples formatos, este proyecto busca ofrecer una solución "llave en mano", súper liviana y específicamente diseñada para generar presentaciones modernas y vistosas en PPTX sin tener que lidiar con instalaciones de LaTeX, librerías complejas o configuraciones avanzadas.
>
> A modo de comparación, una conversión básica pura con Pandoc requeriría tenerlo instalado en el sistema operativo y ejecutar:
> ```bash
> pandoc input/presentacion.md -o output/presentacion.pptx
> ```
> A diferencia de ese enfoque crudo, esta herramienta (vía `index.js`) inyecta automáticamente estilos corporativos, procesa viñetas de manera enriquecida y estructura las diapositivas visualmente (portadas vs. divisores vs. contenido) de forma nativa.
## 🚀 Características
- **Sin Dependencias Locales**: Todo corre encapsulado en un contenedor de Docker liviano (Alpine).
- **Desacoplado**: El contenido vive en archivos Markdown fáciles de leer y editar.
- **Detección Automática**: Identifica archivos `.md` en la carpeta `input/` automáticamente.
- **Portabilidad**: Genera presentaciones nativas de PowerPoint listas para usar en Windows, Mac o cualquier suite ofimática.

## 📂 Estructura del Proyecto

```text
ppt-generator/
├── input/                  # 📥 Coloca aquí tus archivos .md
│   └── presentacion.md     # (Ejemplo incluido)
├── output/                 # 📤 Aquí aparecerán tus archivos .pptx generados
├── index.js                # Lógica principal del parser Markdown a PPTX
├── generar.sh              # Script principal para usuarios
├── .env.example            # Plantilla para variables de entorno (UID/GID)
├── docker-compose.yml      # Configuración del contenedor
├── Dockerfile              # Construcción de la imagen mínima (Node 20 Alpine)
└── package.json            # Dependencias del proyecto (solo pptxgenjs y marked)
```

## 📝 Formato del Markdown

El sistema procesa archivos `.md` de la siguiente manera:
- `---` : Separador que indica una **nueva diapositiva**.
- `# Título 1`: Crea portadas o títulos de divisor de sección.
- `## Título 2`: Título principal de una diapositiva normal.
- `### Título 3`: Subtítulos.
- `- Elementos`: Listas con viñetas.

> Revisa el archivo `input/presentacion.md` provisto como ejemplo para ver la estructura sugerida.

---

## 🛠️ Uso con Docker (Recomendado)

Esta es la forma recomendada ya que asegura un entorno limpio y portátil. **Solo necesitas tener Docker instalado.**

1. Coloca tu archivo `.md` dentro de la carpeta `input/`.
2. *(Opcional)* Si experimentas problemas de permisos con los archivos generados en Linux, puedes copiar el archivo `.env.example` a `.env` y ajustar tu `UID` y `GID`.
3. Otorga permisos de ejecución al script principal (solo la primera vez):
   ```bash
   chmod +x generar.sh
   ```
3. Ejecuta el generador:
   ```bash
   ./generar.sh
   ```
   *Si no pasas un parámetro, tomará automáticamente el primer archivo `.md` que encuentre en la carpeta `input/`.*
   
   **Para un archivo en específico:**
   ```bash
   ./generar.sh mi_archivo.md
   ```
4. ¡Listo! Recoge tu presentación lista en la carpeta `output/`.

---

## 💻 Uso Local (Desarrollo)

Si deseas modificar la herramienta o ejecutarla nativamente en tu máquina:

1. Asegúrate de tener **Node.js** (v20 o superior).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el conversor:
   ```bash
   node index.js
   ```
   O especificando el archivo:
   ```bash
   node index.js mi_archivo.md
   ```

## 🤖 CI / CD (GitHub Actions)

El repositorio incluye un *workflow* de GitHub Actions preconfigurado para validar que la imagen de Docker construya correctamente con cada `push` o `pull request` en la rama principal. Esto asegura que la herramienta se mantenga funcional sin importar los cambios de dependencias futuras.
