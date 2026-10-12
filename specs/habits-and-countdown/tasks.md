# Tareas: Hábitos y Cuenta regresiva

Cada tarea se completa y se verifica por separado, en su propia rama, con URL de preview. Una pantalla por iteración.

- [x] **0. Base común** (rama `feature/base-visual`)
  - Instalar `react-router-dom`, definir rutas, `ProtectedRoute`, `AppShell` con navegación (Tareas, Hábitos, Cuentas regresivas) y títulos de pestaña.
  - Nueva paleta y tipografías en `tailwind.config.js` e `index.html`. Componente `Cat` con 4 variantes.
  - Verificar: la pantalla de Tareas sigue funcionando y se ve coherente; recargar en `/habitos` no da 404 en Vercel.
- [x] **1. Lógica de fechas y cuenta regresiva** (rama `feature/cuentas-regresivas`)
  - `dates.js`, `countdown.js`, `useToday`, con pruebas de: fin de mes, bisiesto, cambio de horario, vencido, hoy, 1 día.
- [ ] **2. Tabla `events`** (`002_create_events.sql`): ejecutar en Supabase, probar RLS con 2 usuarios.
- [x] **3. Servicio y hook de eventos, formulario y tarjetas**: crear, editar, eliminar, cambiar estado, próximo evento destacado, estados cargando/vacío/error.
- [x] **4. Filtros y búsqueda.**
- [x] **5. Calendario mensual** (con filtros, detalle y creación desde un día).
- [x] **6. Resumen de 7 días y urgentes.**
- [ ] **7. Tablas `habits` y `habit_logs`** (`003_create_habits.sql`): ejecutar y probar RLS con 2 usuarios, incluido registrar sobre un hábito ajeno (debe fallar) y duplicados (deben fallar).
- [ ] **8. Lógica de hábitos** (`habitStats.js`, con pruebas de rachas: hoy sin marcar, hueco de un día, cruce de mes, sin registros).
- [ ] **9. Gestión de hábitos**: crear, editar, archivar, reordenar, eliminar, hábitos de ejemplo.
- [ ] **10. Cuadrícula mensual de escritorio**: marcar, estado de guardado, hoy resaltado, navegación de meses, bloqueo de futuro.
- [ ] **11. Vista semanal móvil.**
- [ ] **12. Metas y resumen** (progreso por hábito, % mensual, mejor hábito, racha, gatito de ánimo).
- [ ] **13. Revisión final**: lista de 10 puntos de `claude.md`, 375/768/1280 px, accesibilidad (foco, contraste), fusión a `main`.

Orden propuesto: 0 → 1–6 (Cuenta regresiva) → 7–12 (Hábitos) → 13, porque dijiste que la cuenta regresiva es la más importante para planificar tu estudio.
