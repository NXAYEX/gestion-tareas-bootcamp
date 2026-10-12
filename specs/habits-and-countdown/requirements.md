# Requisitos: Hábitos y Cuenta regresiva

Estado: aprobado por el usuario (2026-10-12). Orden: Cuenta regresiva primero. Paleta nueva en toda la app.

## Reglas comunes
- Todo dato vive en Supabase y pertenece a un usuario (RLS). Sin localStorage como fuente de datos.
- Todo el texto de la interfaz va en español.
- "Hoy" es la fecha de calendario del navegador del usuario (año-mes-día local). Las fechas se guardan como `date`, sin hora ni zona horaria.
- Toda pantalla que lee datos tiene estados: cargando, vacío y error con botón "Reintentar".
- Los colores pastel son acentos. El texto siempre es oscuro sobre superficies claras (contraste AA).

## A. Hábitos

### A.1 Gestión
- A.1.1 Crear un hábito con nombre (obligatorio, máx. 60), descripción opcional, icono (de una lista fija de lucide), color (de una paleta pastel fija) y meta diaria como texto opcional (ej. "8 vasos").
- A.1.2 Editar esos campos. Editar nunca modifica ni borra registros.
- A.1.3 Archivar y reactivar. Un hábito archivado sale de la cuadrícula pero conserva su historial.
- A.1.4 Reordenar con botones subir/bajar (el orden se guarda).
- A.1.5 Eliminar con confirmación que avisa: "Se borrará también su historial".
- A.1.6 Botón opcional "Agregar hábitos de ejemplo" (beber agua, ejercicio, leer, estudiar, dormir temprano, ahorrar). Solo aparece con la lista vacía. No hay hábitos fijos.
- A.1.7 Meta mensual opcional por hábito (1–31 días). Vacía = sin meta.

### A.2 Registro diario
- A.2.1 Cuadrícula: hábitos en filas, días del mes en columnas. Los días del mes se calculan según mes y año (bisiestos incluidos).
- A.2.2 Un clic marca o desmarca un día. Nunca se marca nada automáticamente.
- A.2.3 No se puede marcar un día futuro (celda deshabilitada y explicada con tooltip).
- A.2.4 Un hábito y una fecha tienen como máximo un registro (restricción única en la base de datos).
- A.2.5 Cada cambio muestra su estado: guardando, guardado, error con reintento. Si falla, la celda vuelve a su estado anterior.
- A.2.6 El día de hoy se distingue en el encabezado y en la columna.
- A.2.7 Navegar al mes anterior y siguiente, y botón "Hoy". Meses pasados son editables. No se navega más allá del mes actual.
- A.2.8 Escritorio: tabla con scroll horizontal, columna de hábitos y encabezado de días fijos. Móvil: vista de una semana a la vez con días grandes y tocables, con las mismas acciones.

### A.3 Metas y progreso
- A.3.1 Por hábito: "12/20 días" si hay meta mensual, o "12 días" si no. Con porcentaje cuando hay meta.
- A.3.2 Cumplimiento mensual general: días marcados ÷ días posibles, solo hábitos activos. Los días posibles llegan hasta hoy en el mes en curso (no cuentan días futuros) y hasta el último día en meses pasados.
- A.3.3 Cada hábito se identifica con su icono y color.

### A.4 Resumen
- Hábitos completados hoy (ej. 3 de 6).
- Porcentaje del mes (A.3.2).
- Hábito con mayor cumplimiento del mes (si hay empate, el primero por orden; sin registros, no se muestra).
- Racha. Definición:
  - **Racha de un hábito**: días de calendario consecutivos con registro, contando hacia atrás desde hoy. Si hoy aún no está marcado, la racha cuenta desde ayer (hoy todavía no la rompe). Un día sin registro anterior a hoy la termina.
  - **Racha general**: días consecutivos en que se completó al menos un hábito activo, con la misma regla de hoy.
  - La racha se calcula con los registros reales, incluyendo meses anteriores, no solo el mes visible.
- Un resumen visual simple: barra de progreso mensual con gatito que cambia según el porcentaje.

## B. Cuenta regresiva

### B.1 Eventos
- Campos: nombre (obligatorio, máx. 120), tipo (certamen, examen, tarea, entrega, proyecto, presentación, práctica, otro), fecha (obligatoria), color (paleta fija de 8 pasteles con texto legible), descripción opcional, prioridad (baja, media, alta; por defecto media), asignatura opcional (texto libre, con sugerencias de las ya usadas), estado (pendiente, completado, cancelado; por defecto pendiente).
- Crear, editar, eliminar (con confirmación) y cambiar estado desde la tarjeta con un clic.
- Validación con mensajes claros junto al campo.

### B.2 Contador
- Se calcula siempre desde la fecha de hoy y la fecha del evento, contando días de calendario (nunca milisegundos ÷ 24 h). No se guarda en la base.
- Textos: "Faltan N días", "Falta 1 día", "¡Es hoy!", "Venció hace N días" / "Venció ayer", "Completado", "Cancelado".
- Vencido = pendiente con fecha anterior a hoy. Es distinto de completado.
- Se actualiza solo al cambiar el día (al pasar la medianoche o al volver a la pestaña).

### B.3 Calendario con cuenta regresiva en las celdas (concepto central)
- Vista mensual con navegación entre meses, conectada a Supabase y que respeta los filtros activos.
- Cada evento **pendiente** dibuja una etiqueta cuadrada de su color en cada día desde **hoy** hasta el día anterior a su fecha. El número de la etiqueta son los días que faltan (fecha del evento − fecha de la celda, en días de calendario).
  - Ejemplo: hoy 12 oct, certamen el 20 oct, azul → el 12 muestra 8, el 13 muestra 7 … el 19 muestra 1.
- El día del evento muestra un indicador especial (icono de bandera) con el mismo color, nunca un 0.
- Días anteriores a hoy: sin etiquetas de cuenta regresiva. Sin números negativos. Un evento vencido y pendiente solo conserva su indicador en su fecha.
- Completado o cancelado: deja de dibujar etiquetas de cuenta regresiva; en su fecha queda un indicador atenuado.
- Los números nunca se guardan: se calculan al dibujar, así que cambian solos cada día y al editar la fecha.
- Varios eventos: etiquetas independientes, cada una con su color, en una fila compacta dentro de la celda, junto al número del día (que va en otra esquina). Si no caben, se muestran las que caben y "+N".
- Seleccionar un día abre debajo la lista de todos sus eventos con sus contadores. Desde ahí se edita, se cambia el estado y se crea un evento nuevo con esa fecha.
- Móvil: etiquetas más pequeñas pero con número legible; la lista del día seleccionado completa la información.
- Cada etiqueta lleva texto accesible (por ejemplo "Certamen de Computación Científica: faltan 8 días").

### B.4 Tarjetas
- Orden: pendientes por fecha más cercana (vencidos primero, destacados), luego completados y cancelados en una sección plegada y atenuada.
- Cada tarjeta: nombre, tipo, asignatura, fecha, contador destacado, color, prioridad y estado.
- Arriba: "Próximo evento" grande con su contador.

### B.5 Filtros
- Tipo, asignatura, prioridad, estado (pendientes, completados, cancelados, vencidos), búsqueda por nombre.
- "Ver un evento individual": seleccionar un evento lo abre en detalle.
- Los filtros se combinan (Y lógico) y se mantienen al alternar entre Tarjetas y Calendario.

### B.6 Preparación
- Resumen de los próximos 7 días (hoy incluido).
- Sección "Urgentes": pendientes que vencen en 0–3 días o están vencidos, o con prioridad alta dentro de 7 días.
- Prioridad visible con texto, no solo con color.

## C. Fuera de alcance
Planificación de sesiones de estudio, notificaciones, correos, modo sin conexión, compartir con otros usuarios.

## D. Criterios de aceptación generales
- Dos usuarios distintos no ven ni modifican los datos del otro (probado).
- Se ve bien en 375, 768 y 1280 px.
- Los estados cargando, vacío y error existen en cada pantalla.
- Febrero de un año bisiesto muestra 29 días.
- La diferencia en días es correcta a través de un cambio de horario.
