# Diseño: Hábitos y Cuenta regresiva

## 1. Inspección del repositorio (estado actual)
- React 18+ con Vite, Tailwind 3, JavaScript. Íconos: lucide-react. Sin librería de componentes ni de fechas.
- Autenticación: Supabase Auth (email y contraseña) con `AuthContext`. Hoy `App.jsx` elige entre `LoginPage` y `TasksPage` según la sesión; no hay router.
- Datos: tabla `tasks` (RLS por `auth.uid() = user_id`). Acceso solo mediante `src/services/*` devolviendo `{ data, error }`. Cliente único en `src/lib/supabase.js`.
- Hooks por dominio (`useTasks`). Componentes de menos de 150 líneas.
- No hay tablas que reutilizar para hábitos ni eventos (`tasks` es una lista de pendientes y no tiene fecha-evento, color ni tipo). Se crean tablas nuevas.
- `claude.md` exige: spec aprobado, ramas por funcionalidad, RLS en cada tabla, `react-router-dom` desde 2 páginas, `ProtectedRoute`, un título por página.

## 2. Decisiones técnicas
| Tema | Decisión | Razón |
|---|---|---|
| Rutas | Instalar `react-router-dom`. Rutas: `/` (Tareas), `/habitos`, `/cuentas-regresivas`, `/login`. `ProtectedRoute` redirige a `/login`. `vercel.json` ya tiene el rewrite. | Con 3 secciones el router es obligatorio y permite enlaces directos. |
| Fechas | Fechas como `date` en Postgres y como texto `YYYY-MM-DD` en JS. Diferencia de días con `Date.UTC(y, m-1, d)` de cada fecha dividido por 86 400 000 (ambos en UTC a medianoche, no hay horario de verano que cause desfase). "Hoy" = fecha local del navegador. | Evita errores por cambio de hora y por zona horaria. |
| Cambio de día | Hook `useToday()` que programa un temporizador hasta la próxima medianoche local y revisa la fecha al volver a la pestaña. | El contador se actualiza sin recargar ni editar. |
| Fechas futuras (hábitos) | Se bloquean en la interfaz y una restricción `check (log_date <= current_date + 1)` en la base. | Tolera la diferencia de zona (UTC del servidor frente al día local) sin dejar registrar el futuro real. |
| Registro de hábito | Una fila en `habit_logs` = día completado. Desmarcar borra la fila. | Más simple y evita duplicados con una clave única. |
| Meta diaria | Texto descriptivo (`daily_goal_label`), ej. "8 vasos". El clic marca el día como cumplido. | Registrar cantidades exige otra interfaz; se puede añadir después. |
| Meta mensual | Columna en `habits`. Cambiarla afecta cómo se ve el progreso de meses pasados; los registros no cambian. | Mantener historia exacta por mes exigiría una tabla de metas por mes; no se justifica ahora. |
| Eliminar hábito | `on delete cascade` sobre `habit_logs`, con confirmación explícita. | Registros sin hábito no tienen sentido; archivar es la vía para conservar historial. |
| Identidad del hábito | `id uuid` estable. El nombre, color e icono son editables sin tocar los registros. | |
| Orden | Columna `position int`. Subir/bajar intercambia posiciones en una sola llamada. | |
| Calendario | Componente propio (sin librería). | Menos dependencias; las necesidades son simples. |
| Guardado de celdas | Actualización optimista con reversión si falla y aviso "No se pudo guardar. Reintentar". | Respuesta inmediata y honestidad ante errores. |

## 3. Esquema SQL (migraciones numeradas)
Convenciones: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `user_id uuid not null default auth.uid() references auth.users(id) on delete cascade`, RLS activo con 4 políticas (`auth.uid() = user_id`).

### 003_create_habits.sql
`habits`: `name text not null (1–60)`, `description text`, `icon text not null default 'circle'`, `color text not null default '#F4C6D7'` (formato hex validado), `daily_goal_label text`, `monthly_goal int check (monthly_goal between 1 and 31)`, `position int not null default 0`, `is_archived boolean not null default false`, `updated_at timestamptz default now()` (trigger).
Índice: `(user_id, is_archived, position)`.

`habit_logs`: `habit_id uuid not null references habits(id) on delete cascade`, `user_id` (como arriba), `log_date date not null check (log_date <= current_date + 1)`.
Restricción: `unique (habit_id, log_date)`. Índice: `(user_id, log_date)`.
Política de inserción adicional: el `habit_id` debe pertenecer al mismo usuario (`exists (select 1 from habits h where h.id = habit_id and h.user_id = auth.uid())`), para que nadie registre sobre hábitos ajenos.

### 002_create_events.sql
`events`: `title text not null (1–120)`, `type text not null check in ('certamen','examen','tarea','entrega','proyecto','presentacion','practica','otro')`, `event_date date not null`, `color text not null` (hex), `description text`, `priority text not null default 'medium' check in ('low','medium','high')`, `subject text`, `status text not null default 'pending' check in ('pending','completed','cancelled')`, `updated_at timestamptz default now()` (trigger).
Índices: `(user_id, event_date)`, `(user_id, status)`.
No existe columna de días restantes.

## 4. Estructura de archivos
```
src/
  lib/dates.js            Ampliar: parseISO, daysBetween, daysInMonth, addMonths, monthGrid
  lib/habitStats.js       Cálculos: progreso, % mensual, mejor hábito, rachas (funciones puras)
  lib/countdown.js        Texto del contador, estado vencido, urgentes, próximos 7 días (funciones puras)
  lib/palette.js          Colores permitidos y color de texto legible por fondo
  services/habits.js      CRUD de hábitos + logs (devuelven { data, error })
  services/events.js      CRUD de eventos
  hooks/useToday.js, useHabits.js, useHabitLogs.js, useEvents.js
  context/ (AuthContext existente)
  components/layout/      AppShell.jsx, NavBar.jsx (con gatito en cabecera)
  components/cats/        Cat.jsx (variantes: feliz, durmiendo, animando, curioso) — SVG propios
  components/habits/      HabitGrid, HabitRow, HabitCell, WeekView, HabitForm, HabitManager, HabitSummary, MonthNav
  components/countdown/   EventCard, NextEventHero, EventForm, EventDetail, CalendarMonth, CalendarDay, EventFilters, UpcomingWeek, UrgentList, CountdownBadge
  pages/HabitsPage.jsx, CountdownPage.jsx
```
Cada componente por debajo de 150 líneas. Las pruebas de la lógica pura (fechas, rachas, contador) se escriben con `node --test` sin instalar dependencias.

## 5. Sistema visual
- Paleta (acentos suaves, texto oscuro): fondo crema `#FBF7F2`, superficie `#FFFFFF`, texto `#2B2630`, texto secundario `#6B6473`, borde `#E8DFD6`, acento principal lavanda `#7B6BC9` (botones, foco; contraste AA sobre blanco), y pasteles para los hábitos y eventos: rosa `#F6C9D8`, lavanda `#D9D0F2`, salvia `#CFE3CF`, azul `#CBE0F4`, durazno `#F8DCC4`, amarillo `#F5E8B8`, menta `#C6E8E0`, gris `#E3DFE6`. Los pasteles se usan como relleno; el texto sobre ellos siempre es `#2B2630`.
- Tipografía: Fredoka (títulos, redondeada y con carácter) y Nunito (cuerpo). Se cargan desde Google Fonts.
- Formas: esquinas de 12–16 px, sombras suaves y casi imperceptibles, bordes finos.
- Gatitos: componente `Cat` con SVG propio y variantes. Aparecen en la cabecera, estados vacíos, resumen de progreso y mensajes de ánimo. Tamaño pequeño, `aria-hidden`, nunca sobre información.
- Movimiento: un solo momento con intención (el gatito del resumen cambia de pose al subir el porcentaje y el check de la celda aparece con un pequeño rebote). Respeta `prefers-reduced-motion`.
- Escala tipográfica: 14, 16, 20, 28, 40 (ya definida en Tailwind).
- Iconos: lucide-react, sin emojis.

## 6. Flujos de datos
- Cuadrícula: `useHabitLogs(month)` pide los registros del mes con un solo rango `log_date between inicio and fin`. Marcar → inserta o borra, con reversión si falla. La racha pide los registros de los últimos 400 días una vez y la recalcula en el cliente.
- Contador: `useEvents()` carga todos los eventos del usuario. Los filtros se aplican en el cliente y se guardan en el estado de `CountdownPage` para que no se pierdan al alternar vista.

## 7. Seguridad
- Solo clave `anon/publishable`. RLS en las 3 tablas. Prueba con dos usuarios antes de dar cada tabla por terminada.
- `habit_logs` verifica que el hábito sea del mismo usuario.
