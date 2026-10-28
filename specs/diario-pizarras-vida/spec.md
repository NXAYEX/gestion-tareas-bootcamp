# Spec: Diario, Pizarras y Vida en semanas

Estado: aprobado por el usuario (2026-10-27). Orden: Diario → Pizarras → Vida en semanas. Una rama, una migración y una preview por sección.

## Reglas comunes
- Datos en Supabase con RLS por usuario; fotos en Storage (bucket privado, carpeta = id del usuario).
- Misma paleta, Fredoka y Nunito. Tercera fuente solo para texto manuscrito (Caveat) en post-its y diario.
- Fechas de calendario como texto `YYYY-MM-DD`; "hoy" es la fecha local del navegador.
- Cada pantalla: estados cargando, vacío y error; responsive 375/768/1280.

## 1. Diario (`/diario`, rama `feature/diario`, migración 004)
- Frase: "¿Y si escribir cada día fuera una forma de cuidar nuestra mente? De entendernos a nosotr@s mism@s".
- Una entrada por día (única por usuario y fecha): título opcional, texto, nota corta (post-it), ánimo (carita de gatito) y una foto opcional.
- No se escribe en días futuros. Guardado automático con estado "Guardando… / Guardado / Error con reintento". Si una entrada queda vacía, se elimina.
- Cuaderno de dos páginas con anillos, renglones, polaroid con cinta washi, post-it, flores y nubes (cottagecore). En móvil las páginas se apilan.
- Navegación: día anterior/siguiente, "Hoy", selector de fecha y lista "Mis páginas" por mes.
- Privacidad: RLS estricta y bucket privado con URLs firmadas. No hay cifrado de extremo a extremo.
- Fotos: se reducen a 1200 px (JPEG) antes de subir.

## 2. Pizarras (`/pizarras`, rama `feature/pizarras`, migración 005)
- Pestañas: Corcho (decorativa) y Pizarra blanca (de clases).
- Ambas: post-its de colores con texto, imágenes (con cinta/chincheta), texto suelto; todo se arrastra, gira y se ordena (traer al frente). Corcho también con stickers de gatitos.
- Pizarra blanca: dibujo a mano alzada (colores, grosores), borrador, deshacer, limpiar con confirmación. Trazos guardados como vectores.
- Coordenadas en un espacio virtual fijo y escalado a la pantalla.

## 3. Vida en semanas (`/vida`, rama `feature/vida-en-semanas`, migración 006)
- 52 círculos por fila (un año); filas hasta la esperanza de vida elegida (80 por defecto). Edad en el eje cada 10 años.
- Se ingresa la edad (decimales permitidos) o la fecha de nacimiento (se actualiza sola). Con fecha de nacimiento: filas = años cumplidos; semanas de la fila actual = días desde el último cumpleaños ÷ 7 (máx. 51).
- Semana actual con contorno; al tocar un círculo, edad y fechas de esa semana.
- Frase de Séneca con gatito y reloj. Ajustes guardados en una fila por usuario.
