# Estrategia QA — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay) · SPEC-004 (Admin, Dashboard, Niveles, Sugerencias)
> **Fecha:** 2026-04-18
> **Autor:** QA Agent (ASDD)

---

## 1. Alcance

| Feature | Spec | HUs cubiertas | Prioridad |
|---------|------|---------------|-----------|
| Autenticación JWT | SPEC-002 | HU-01 (Registro), HU-02 (Login), HU-03 (Invitado) | Alta |
| Mecánica de Juego | SPEC-003 | HU-01 (Partida), HU-02 (Score), HU-03 (Guardar), HU-04 (Leaderboard), HU-05 (Reiniciar) | Alta |
| Roles y Admin | SPEC-004 | HU-01 (Rol Admin), HU-02 (Ban), HU-03 (Términos), HU-07 (Dashboard Admin), HU-08 (Settings) | Alta |
| Dashboard y Progresión | SPEC-004 | HU-04 (Dashboard Usuario), HU-05 (XP/Niveles), HU-06 (Sugerencias) | Alta |

**Fuera de alcance:** rate limiting avanzado, internacionalización, analytics, notificaciones push.

---

## 2. Niveles de Prueba y Distribución

```
┌─────────────────────────────────────────────┐
│              E2E (~10%)                      │
│        Serenity BDD + WebDriver              │
│   Flujos críticos cross-feature              │
├─────────────────────────────────────────────┤
│          Integración (~20%)                  │
│   Jest (backend) · Vitest (frontend)         │
│   API endpoints · Hooks + Services           │
├─────────────────────────────────────────────┤
│           Unitarias (~70%)                   │
│   Jest (backend) · Vitest (frontend)         │
│   Services · Repositories · Componentes      │
└─────────────────────────────────────────────┘
```

| Nivel | % Objetivo | Herramienta | Scope |
|-------|-----------|-------------|-------|
| Unitarias | ~70% | Jest (BE), Vitest (FE) | Funciones puras, services, repositories, modelos, hooks, componentes aislados |
| Integración | ~20% | Jest + supertest (BE), Vitest + MSW (FE) | Endpoints API completos, hooks con services mockeados, flujos de componentes |
| E2E | ~10% | Serenity BDD + WebDriver | Registro → Login → Jugar → Guardar → Leaderboard |

---

## 3. Herramientas

| Herramienta | Uso | Ambiente |
|-------------|-----|----------|
| **Jest** | Tests unitarios e integración backend | Local + CI |
| **Vitest** | Tests unitarios e integración frontend | Local + CI |
| **supertest** | Tests de endpoints HTTP backend | Local + CI |
| **MSW (Mock Service Worker)** | Mock de API en tests frontend | Local + CI |
| **Serenity BDD + WebDriver** | Tests E2E cross-browser | CI |
| **ESLint + eslint-plugin-security** | SAST estático | Local + CI |
| **GitHub Actions** | Pipeline CI/CD | CI |

---

## 4. Quality Gates

| Gate | Criterio | Bloqueante |
|------|----------|------------|
| Cobertura de código | ≥ 80% líneas (backend + frontend) | ✅ Sí |
| Bugs críticos | 0 bugs severidad Alta/Crítica abiertos | ✅ Sí |
| SAST clean | 0 vulnerabilidades High/Critical en linter de seguridad | ✅ Sí |
| Tests unitarios | 100% passing | ✅ Sí |
| Tests integración | 100% passing | ✅ Sí |
| Tests E2E smoke | 100% passing en flujos `@critico` | ✅ Sí |
| Revisión de código | Al menos 1 aprobación en PR | ✅ Sí |

---

## 5. Ambientes

| Ambiente | Propósito | Base de datos | Configuración |
|----------|-----------|---------------|---------------|
| **Local** | Desarrollo + tests unitarios/integración | PostgreSQL local o SQLite en memoria | `.env.local` |
| **CI (GitHub Actions)** | Pipeline automatizado: lint → test → build | PostgreSQL service container | `.env.ci` / secrets |

---

## 6. Criterios de Entrada (DoR) y Salida (DoD)

### Definition of Ready (DoR)
- [ ] Spec aprobada (`status: APPROVED`) en `.github/specs/`
- [ ] Criterios de aceptación definidos en formato Gherkin
- [ ] Datos de prueba identificados
- [ ] Dependencias técnicas resueltas (DB migrations, seeds)
- [ ] Ambiente de pruebas disponible y estable

### Definition of Done (DoD)
- [ ] Código implementado y revisado (PR aprobado)
- [ ] Tests unitarios escritos y passing (cobertura ≥ 80%)
- [ ] Tests de integración escritos y passing
- [ ] Escenarios Gherkin `@critico` validados manualmente o via E2E
- [ ] 0 bugs críticos abiertos
- [ ] SAST sin vulnerabilidades High/Critical
- [ ] Documentación actualizada si aplica

---

## 7. Matriz de Trazabilidad HU → Test Cases

### SPEC-002: Autenticación

| HU | Criterio | Tipo Test | ID Test Case | Descripción |
|----|----------|-----------|--------------|-------------|
| HU-01 | CRITERIO-1.1 | Unit + Integ | TC-AUTH-001 | Registro exitoso con credenciales válidas |
| HU-01 | CRITERIO-1.2 | Unit + Integ | TC-AUTH-002 | Registro rechazado por username duplicado (409) |
| HU-01 | CRITERIO-1.3 | Unit + Integ | TC-AUTH-003 | Registro rechazado por contraseña débil (400) |
| HU-01 | CRITERIO-1.4 | Unit + Integ | TC-AUTH-004 | Registro rechazado por campo faltante (400) |
| HU-01 | CRITERIO-1.5 | Unit | TC-AUTH-005 | Username con caracteres especiales permitidos |
| HU-02 | CRITERIO-2.1 | Unit + Integ + E2E | TC-AUTH-006 | Login exitoso con credenciales válidas |
| HU-02 | CRITERIO-2.2 | Unit + Integ | TC-AUTH-007 | Login rechazado por username inexistente (401) |
| HU-02 | CRITERIO-2.3 | Unit + Integ | TC-AUTH-008 | Login rechazado por contraseña incorrecta (401) |
| HU-02 | CRITERIO-2.4 | Unit + Integ | TC-AUTH-009 | Login rechazado por campo faltante (400) |
| HU-03 | CRITERIO-3.1 | Integ + E2E | TC-AUTH-010 | Acceso como invitado a /game sin token |
| HU-03 | CRITERIO-3.2 | Integ + E2E | TC-AUTH-011 | Invitado redirigido al acceder a ruta protegida |

### SPEC-003: Gameplay

| HU | Criterio | Tipo Test | ID Test Case | Descripción |
|----|----------|-----------|--------------|-------------|
| HU-01 | CRITERIO-1.1 | Unit + Integ | TC-GAME-001 | Iniciar partida y cargar primer término |
| HU-01 | CRITERIO-1.2 | Unit | TC-GAME-002 | Respuesta correcta incrementa aciertos |
| HU-01 | CRITERIO-1.3 | Unit | TC-GAME-003 | Respuesta incorrecta muestra feedback y respuesta correcta |
| HU-01 | CRITERIO-1.4 | Integ + E2E | TC-GAME-004 | Finalizar partida navega a resultado |
| HU-02 | CRITERIO-2.1 | Unit | TC-GAME-005 | Cálculo correcto de porcentaje |
| HU-02 | CRITERIO-2.2 | Unit | TC-GAME-006 | Victoria cuando porcentaje > 51% |
| HU-02 | CRITERIO-2.3 | Unit | TC-GAME-007 | Derrota cuando porcentaje ≤ 51% |
| HU-02 | CRITERIO-2.4 | Unit | TC-GAME-008 | Cálculo con diferentes totales de preguntas |
| HU-03 | CRITERIO-3.1 | Integ | TC-GAME-009 | Usuario autenticado ve botón guardar tras ganar |
| HU-03 | CRITERIO-3.2 | Integ + E2E | TC-GAME-010 | Guardar puntaje en backend exitosamente |
| HU-03 | CRITERIO-3.3 | Unit + Integ | TC-GAME-011 | Backend rechaza score < 51% |
| HU-03 | CRITERIO-3.4 | Unit + Integ | TC-GAME-012 | Prevención de puntaje duplicado |
| HU-04 | CRITERIO-4.1 | Integ | TC-GAME-013 | Leaderboard carga top 50 ordenado |
| HU-04 | CRITERIO-4.2 | Unit + Integ | TC-GAME-014 | Tabla renderiza filas con ranking correcto |
| HU-04 | CRITERIO-4.3 | Integ | TC-GAME-015 | Leaderboard accesible sin autenticación |
| HU-04 | CRITERIO-4.4 | Integ | TC-GAME-016 | Refresco de leaderboard |
| HU-05 | CRITERIO-5.1 | Integ + E2E | TC-GAME-017 | Reiniciar partida desde resultado |
| HU-05 | CRITERIO-5.2 | Integ | TC-GAME-018 | Volver al inicio sin guardar datos |
| HU-05 | CRITERIO-5.3 | Integ + E2E | TC-GAME-019 | Invitado ganador redirigido a registro |

### Flujos E2E Críticos (Smoke)

| ID E2E | Flujo | Tags |
|--------|-------|------|
| E2E-001 | Registro → Login → Jugar partida → Ganar → Guardar score → Ver leaderboard | `@smoke @critico` |
| E2E-002 | Invitado → Jugar partida → Ganar → Crear cuenta → Guardar score | `@smoke @critico` |
| E2E-003 | Login → Jugar → Perder → Reintentar → Ganar | `@smoke` |
| E2E-004 | Login admin → Acceder panel admin → Banear usuario → Verificar ban | `@smoke @critico` |
| E2E-005 | Login → Jugar → Ganar → Ganar XP → Subir nivel → Ver dashboard actualizado | `@smoke @critico` |
| E2E-006 | Login (nivel 10+) → Sugerir término → Admin aprueba → Término disponible | `@smoke` |

### SPEC-004: Admin, Dashboard, Niveles, Sugerencias

| HU | Criterio | Tipo Test | ID Test Case | Descripción |
|----|----------|-----------|--------------|-------------|
| HU-01 | CRITERIO-1.1 | Unit + Integ | TC-ADMIN-001 | Admin promueve usuario a admin (200) |
| HU-01 | CRITERIO-1.2 | Unit + Integ | TC-ADMIN-002 | Usuario sin permisos intenta promover (403) |
| HU-01 | CRITERIO-1.3 | Unit + Integ | TC-ADMIN-003 | Admin intenta promover usuario inexistente (404) |
| HU-01 | Edge | Unit + Integ | TC-ADMIN-004 | Admin intenta cambiar su propio rol (403) |
| HU-02 | CRITERIO-2.1 | Unit + Integ + E2E | TC-ADMIN-005 | Admin banea usuario exitosamente (200) |
| HU-02 | CRITERIO-2.2 | Unit + Integ | TC-ADMIN-006 | Admin desbanea usuario exitosamente (200) |
| HU-02 | CRITERIO-2.3 | Unit + Integ | TC-BAN-001 | Usuario baneado no puede hacer login (403) |
| HU-02 | Edge | Unit + Integ | TC-BAN-002 | Usuario baneado rechazado en endpoints protegidos (403) |
| HU-02 | Edge | Unit | TC-ADMIN-007 | Admin intenta banearse a sí mismo (403) |
| HU-03 | CRITERIO-3.1 | Unit + Integ | TC-ADMIN-008 | Admin agrega nuevo término (201) |
| HU-03 | CRITERIO-3.2 | Unit + Integ | TC-ADMIN-009 | Admin elimina término (204) |
| HU-03 | CRITERIO-3.3 | Unit + Integ | TC-ADMIN-010 | Admin intenta agregar término duplicado (409) |
| HU-03 | Edge | Unit | TC-ADMIN-011 | Categoría inválida rechazada (400) |
| HU-04 | CRITERIO-4.1 | Integ + E2E | TC-DASH-001 | Dashboard muestra nombre, nivel, XP, puntajes |
| HU-04 | CRITERIO-4.2 | Integ | TC-DASH-002 | Botón comenzar partida navega a /game |
| HU-04 | CRITERIO-4.3 | Unit + Integ | TC-DASH-003 | usuario nivel 10+ ve sección sugerencias |
| HU-04 | CRITERIO-4.4 | Unit + Integ | TC-DASH-004 | Usuario nivel < umbral no ve sección sugerencias |
| HU-05 | CRITERIO-5.1 | Unit + Integ | TC-XP-001 | XP ganado al guardar score (score_percentage = XP) |
| HU-05 | CRITERIO-5.2 | Unit | TC-XP-002 | Fórmula XP: percentage → XP |
| HU-05 | CRITERIO-5.3 | Unit | TC-XP-003 | Fórmula nivel: floor(xp/100) |
| HU-05 | CRITERIO-5.4 | Integ | TC-XP-004 | Invitado no acumula XP |
| HU-05 | Edge | Unit | TC-XP-005 | Frontera de nivel: 99→100 XP sube de nivel |
| HU-06 | CRITERIO-6.1 | Unit + Integ | TC-SUGG-001 | Usuario nivel 10+ crea sugerencia (201) |
| HU-06 | CRITERIO-6.2 | Unit + Integ | TC-ADMIN-012 | Admin aprueba sugerencia → crea término (200) |
| HU-06 | CRITERIO-6.3 | Unit + Integ | TC-ADMIN-013 | Admin rechaza sugerencia con nota (200) |
| HU-06 | CRITERIO-6.4 | Unit + Integ | TC-SUGG-002 | Usuario nivel insuficiente rechazado (403) |
| HU-06 | CRITERIO-6.5 | Unit + Integ | TC-SUGG-003 | Sugerencia de término existente rechazada (409) |
| HU-06 | Edge | Unit + Integ | TC-SUGG-004 | Límite 5 sugerencias pendientes (400) |
| HU-06 | Edge | Integ | TC-SUGG-005 | Aprobar sugerencia cuyo término ya existe (409) |
| HU-07 | CRITERIO-7.1 | Integ + E2E | TC-ADMINDASH-001 | Admin ve panel con 3 secciones |
| HU-07 | CRITERIO-7.2 | Integ | TC-ADMINDASH-002 | Tabla de usuarios con columnas correctas |
| HU-07 | CRITERIO-7.3 | Integ | TC-ADMINDASH-003 | Sugerencias pendientes con acciones |
| HU-07 | CRITERIO-7.4 | Integ + E2E | TC-ADMINDASH-004 | Usuario normal redirigido desde /admin (403) |
| HU-08 | CRITERIO-8.1 | Unit + Integ | TC-SETTINGS-001 | Admin actualiza umbral (200) |
| HU-08 | Edge | Unit + Integ | TC-SETTINGS-002 | Umbral fuera de rango rechazado (400) |
| HU-08 | Edge | Integ | TC-SETTINGS-003 | Cambio de umbral afecta elegibilidad inmediatamente |

---

**Versión:** 2.0
**Generado por:** QA Agent (ASDD)
