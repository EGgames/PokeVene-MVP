# Escenarios Gherkin — PokeVene-MVP

> **Specs cubiertas:** SPEC-002 (Auth) · SPEC-003 (Gameplay) · SPEC-004 (Admin, Dashboard, Niveles, Sugerencias)
> **Fecha:** 2026-04-18
> **Autor:** QA Agent (ASDD)
> **Datos de prueba:** ver `docs/output/qa/test-data.md`

---

## SPEC-002: Autenticación de Usuarios

### Feature: Registro de Usuarios (HU-01)

```gherkin
#language: es

Característica: Registro de Usuarios
  Como usuario interesado en el juego
  Quiero poder crear una cuenta con mi nombre de usuario y contraseña
  Para guardar mis puntajes y aparecer en la tabla general de clasificación

  Antecedentes:
    Dado que el usuario se encuentra en la pantalla de registro

  @happy-path @critico @smoke
  Escenario: CRITERIO-1.1 — Registro exitoso con credenciales válidas
    Dado que no existe un usuario con nombre "caraquenio_gamer"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema crea la cuenta exitosamente
    Y retorna un código de estado 201
    Y retorna un token de sesión válido
    Y el usuario es redirigido a la pantalla del juego
    Y el token queda almacenado en el navegador

  @error-path @seguridad
  Escenario: CRITERIO-1.2 — Username duplicado rechazado
    Dado que ya existe un usuario registrado con nombre "pokefan_vzla"
    Cuando otro usuario intenta registrarse con el nombre "pokefan_vzla"
    Y ingresa la contraseña "Contr4sena_Valida!"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 409
    Y muestra el mensaje "El nombre de usuario ya existe"
    Y la cuenta no es creada

  @error-path
  Escenario: CRITERIO-1.3 — Contraseña débil rechazada
    Dado que no existe un usuario con nombre "nuevo_jugador"
    Cuando el usuario ingresa el nombre "nuevo_jugador"
    Y ingresa la contraseña "corta"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje "La contraseña debe tener al menos 8 caracteres"
    Y la cuenta no es creada

  @error-path
  Escenario: CRITERIO-1.4 — Campo requerido faltante
    Cuando el usuario deja el campo de nombre de usuario vacío
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje indicando que el campo "username" es requerido
    Y la cuenta no es creada

  @edge-case
  Escenario: CRITERIO-1.5 — Username con caracteres especiales permitidos
    Dado que no existe un usuario con nombre "poke_fan-123"
    Cuando el usuario ingresa el nombre "poke_fan-123"
    Y ingresa la contraseña "Gu4r0_Seguro99"
    Y presiona el botón "Crear Cuenta"
    Entonces el sistema acepta el nombre de usuario con guiones y guiones bajos
    Y crea la cuenta exitosamente
    Y retorna un código de estado 201
```

---

### Feature: Inicio de Sesión (HU-02)

```gherkin
#language: es

Característica: Inicio de Sesión
  Como usuario registrado
  Quiero poder iniciar sesión con mi nombre de usuario y contraseña
  Para acceder a la aplicación y recuperar mis puntajes previos

  Antecedentes:
    Dado que el usuario se encuentra en la pantalla de inicio de sesión

  @happy-path @critico @smoke
  Escenario: CRITERIO-2.1 — Login exitoso con credenciales válidas
    Dado que existe un usuario registrado con nombre "caraquenio_gamer" y contraseña "M4racucho#2026"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "M4racucho#2026"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 200
    Y retorna un token de sesión válido con expiración de 7 días
    Y retorna los datos del usuario autenticado
    Y el token queda almacenado en el navegador
    Y el usuario es redirigido a la pantalla del juego

  @error-path @seguridad
  Escenario: CRITERIO-2.2 — Username no encontrado
    Dado que no existe un usuario registrado con nombre "fantasma_inexistente"
    Cuando el usuario ingresa el nombre "fantasma_inexistente"
    Y ingresa la contraseña "CualquierPass123"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 401
    Y muestra el mensaje "Usuario o contraseña incorrectos"
    Y no revela si el nombre de usuario existe o no

  @error-path @seguridad
  Escenario: CRITERIO-2.3 — Contraseña incorrecta
    Dado que existe un usuario registrado con nombre "caraquenio_gamer"
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y ingresa la contraseña "ContrasenaMal999"
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 401
    Y muestra el mensaje "Usuario o contraseña incorrectos"
    Y no revela que la contraseña es el campo incorrecto

  @error-path
  Escenario: CRITERIO-2.4 — Campo requerido faltante en login
    Cuando el usuario ingresa el nombre "caraquenio_gamer"
    Y deja el campo de contraseña vacío
    Y presiona el botón "Iniciar Sesión"
    Entonces el sistema retorna un código de estado 400
    Y muestra el mensaje indicando que el campo "password" es requerido
```

---

### Feature: Jugar como Invitado (HU-03)

```gherkin
#language: es

Característica: Jugar como Invitado
  Como usuario nuevo sin cuenta
  Quiero poder jugar sin necesidad de registrarme inmediatamente
  Para probar el juego antes de decidir si crearme una cuenta

  @happy-path @critico
  Escenario: CRITERIO-3.1 — Acceso como invitado al juego
    Dado que el usuario no ha iniciado sesión
    Cuando accede a la pantalla del juego
    Entonces puede ver el primer término de la partida
    Y puede interactuar con los botones "Pokémon" y "Venezolano"
    Y puede completar una partida de 10 preguntas
    Y al finalizar, ve la opción "Crear una cuenta para guardar tu puntaje"
    Y puede elegir reiniciar otra partida sin registrarse

  @error-path @seguridad
  Escenario: CRITERIO-3.2 — Invitado sin acceso a paneles protegidos
    Dado que el usuario está jugando como invitado sin sesión iniciada
    Cuando intenta acceder a la tabla de posiciones o al perfil
    Entonces el sistema lo redirige a la pantalla de inicio de sesión
    Y muestra el mensaje "Debes iniciar sesión para acceder aquí"
```

---

## SPEC-003: Mecánica de Juego y Rankings

### Feature: Mecánica de Juego (HU-01)

```gherkin
#language: es

Característica: Mecánica de Juego — Pokémon o Venezolano
  Como usuario autenticado o invitado
  Quiero responder preguntas identificando términos como Pokémon o Venezolano
  Para entrenarme y acumular una puntuación en la partida

  @happy-path @critico @smoke
  Escenario: CRITERIO-1.1 — Iniciar partida y ver primer término
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Entonces ve un término en el centro de la pantalla como "Charmander"
    Y ve dos botones lado a lado: "Pokémon" y "Venezolano"
    Y ve un contador que indica "Pregunta 1 de 10"
    Y ve una barra de progreso en su estado inicial

  @happy-path @critico
  Escenario: CRITERIO-1.2 — Responder correctamente a un término
    Dado que el usuario ve el término "Charmander" en la partida
    Y la categoría correcta del término es "Pokémon"
    Cuando presiona el botón "Pokémon"
    Entonces el sistema muestra el mensaje "¡Correcto!" con fondo verde
    Y el contador de aciertos se incrementa en 1
    Y después de un breve instante se carga automáticamente el siguiente término
    Y el contador avanza a "Pregunta 2 de 10"

  @error-path
  Escenario: CRITERIO-1.3 — Responder incorrectamente a un término
    Dado que el usuario ve el término "Arepa" en la partida
    Y la categoría correcta del término es "Venezolano"
    Cuando presiona el botón "Pokémon"
    Entonces el sistema muestra el mensaje "Incorrecto" con fondo rojo
    Y muestra la respuesta correcta: "La respuesta era: Venezolano"
    Y el contador de errores se incrementa en 1
    Y después de un breve instante se carga el siguiente término

  @happy-path @critico
  Escenario: CRITERIO-1.4 — Finalizar partida tras 10 preguntas
    Dado que el usuario ha respondido 9 preguntas de la partida
    Y tiene 7 aciertos y 2 errores
    Cuando responde la pregunta número 10
    Entonces el sistema navega automáticamente a la pantalla de resultados
    Y muestra los aciertos, errores, porcentaje y el estado de la partida
```

---

### Feature: Cálculo de Score (HU-02)

```gherkin
#language: es

Característica: Cálculo de Score y Determinación de Victoria
  Como usuario
  Quiero que el sistema calcule mi porcentaje de aciertos
  Para saber si gané la partida y poder guardar mi puntaje

  @happy-path @critico
  Escenario: CRITERIO-2.1 — Cálculo de porcentaje correcto
    Dado que el usuario respondió 10 preguntas en la partida
    Y acertó 7 respuestas y falló 3
    Cuando finaliza la partida
    Entonces el sistema calcula el porcentaje como 70%
    Y muestra en pantalla "70% de acierto"

  @happy-path @critico
  Escenario: CRITERIO-2.2 — Victoria cuando el porcentaje supera el umbral
    Dado que el porcentaje de acierto del usuario es 70%
    Y el umbral de victoria para 10 preguntas es 60% (6 aciertos mínimo)
    Cuando el sistema evalúa la condición de victoria
    Entonces muestra el mensaje "¡GANASTE!" con énfasis visual
    Y si el usuario está autenticado, ofrece el botón "Guardar Puntaje"

  @error-path
  Escenario: CRITERIO-2.3 — Derrota cuando el porcentaje no supera el umbral
    Dado que el porcentaje de acierto del usuario es 50%
    Y acertó exactamente 5 de 10 preguntas
    Cuando el sistema evalúa la condición de victoria
    Entonces muestra el mensaje "Perdiste, intenta de nuevo"
    Y ofrece el botón "Reintentar"
    Y no ofrece la opción de guardar puntaje

  @edge-case
  Escenario: CRITERIO-2.4 — Cálculo correcto con diferentes totales de preguntas
    Dado que el juego tiene un total de <total> preguntas
    Y el usuario acertó <aciertos> respuestas
    Cuando el sistema evalúa la condición de victoria
    Entonces el porcentaje calculado es <porcentaje>%
    Y el resultado es "<resultado>"

    Ejemplos:
      | total | aciertos | porcentaje | resultado |
      | 5     | 3        | 60         | Victoria  |
      | 5     | 2        | 40         | Derrota   |
      | 10    | 6        | 60         | Victoria  |
      | 10    | 5        | 50         | Derrota   |
      | 15    | 8        | 53         | Victoria  |
      | 15    | 7        | 47         | Derrota   |
      | 20    | 11       | 55         | Victoria  |
      | 20    | 10       | 50         | Derrota   |
```

---

### Feature: Guardar Puntaje (HU-03)

```gherkin
#language: es

Característica: Guardar Puntaje en la Tabla General
  Como usuario autenticado que ganó la partida
  Quiero poder guardar mi puntaje en la tabla general
  Para competir con otros jugadores y verificar mi posición

  @happy-path @critico
  Escenario: CRITERIO-3.1 — Usuario autenticado ve opción de guardar tras ganar
    Dado que el usuario "caraquenio_gamer" está autenticado
    Y ganó la partida con un porcentaje de 80%
    Cuando llega a la pantalla de resultados
    Entonces ve el botón "Compartir en Tabla General" habilitado
    Y el botón es interactuable

  @happy-path @critico @smoke
  Escenario: CRITERIO-3.2 — Guardar puntaje exitosamente en el backend
    Dado que el usuario "caraquenio_gamer" está autenticado con un token válido
    Y ganó la partida con 8 aciertos de 10 preguntas (80%)
    Cuando presiona el botón "Compartir en Tabla General"
    Entonces el sistema envía el puntaje al backend con el token de sesión
    Y el backend valida el token y el porcentaje >= 51%
    Y crea el registro del puntaje exitosamente
    Y retorna un código de estado 201
    Y muestra el mensaje "¡Puntaje guardado exitosamente!"
    Y ofrece el botón "Ver en Tabla de Posiciones"

  @error-path @seguridad
  Escenario: CRITERIO-3.3 — Backend rechaza puntaje perdedor
    Dado que el usuario "caraquenio_gamer" está autenticado con un token válido
    Y perdió la partida con 4 aciertos de 10 preguntas (40%)
    Cuando intenta enviar el puntaje al backend directamente
    Entonces el backend retorna un código de estado 400
    Y muestra el mensaje "No puedes guardar un puntaje con menos de 51%"
    Y el puntaje no es almacenado

  @edge-case
  Escenario: CRITERIO-3.4 — Prevención de puntaje duplicado en la misma partida
    Dado que el usuario "caraquenio_gamer" ya guardó el puntaje de la partida actual
    Cuando presiona el botón de guardar nuevamente
    Entonces el botón está deshabilitado
    Y muestra el mensaje "Este puntaje ya fue guardado"
    Y no se crea un registro duplicado en el backend
```

---

### Feature: Leaderboard (HU-04)

```gherkin
#language: es

Característica: Tabla de Clasificación General (Leaderboard)
  Como cualquier usuario autenticado o invitado
  Quiero ver la tabla con los puntajes más altos de otros jugadores
  Para comparar mi desempeño y saber cómo me ubico en la comunidad

  @happy-path @critico @smoke
  Escenario: CRITERIO-4.1 — Acceder a la tabla de posiciones
    Dado que existen puntajes guardados de múltiples usuarios
    Cuando el usuario accede a la pantalla de la tabla de posiciones
    Entonces ve una tabla con las columnas "Posición", "Nombre de Usuario", "Puntaje" y "Fecha"
    Y los puntajes están ordenados de mayor a menor
    Y se muestran hasta 50 registros por defecto

  @happy-path
  Escenario: CRITERIO-4.2 — Tabla muestra ranking numérico correcto
    Dado que existen los siguientes puntajes guardados:
      | usuario          | puntaje |
      | pokefan_vzla     | 95%     |
      | margariteno_pro  | 90%     |
      | caraquenio_gamer | 80%     |
    Cuando el usuario consulta la tabla de posiciones
    Entonces "pokefan_vzla" aparece en la posición 1 con 95%
    Y "margariteno_pro" aparece en la posición 2 con 90%
    Y "caraquenio_gamer" aparece en la posición 3 con 80%
    Y muestra "Cargando..." mientras se obtienen los datos

  @happy-path @seguridad
  Escenario: CRITERIO-4.3 — Tabla accesible sin autenticación
    Dado que el usuario es un invitado sin sesión iniciada
    Cuando accede a la pantalla de la tabla de posiciones
    Entonces puede ver la tabla completa con todos los puntajes
    Y no se le solicita iniciar sesión
    Y el endpoint público no requiere token de autenticación

  @edge-case
  Escenario: CRITERIO-4.4 — Tabla se refresca con datos actualizados
    Dado que el usuario está viendo la tabla de posiciones
    Y otro jugador acaba de guardar un nuevo puntaje alto
    Cuando el usuario presiona el botón "Recargar" o espera 30 segundos
    Entonces la tabla muestra los datos más recientes
    Y el nuevo puntaje aparece en la posición correspondiente
```

---

### Feature: Reiniciar Partida (HU-05)

```gherkin
#language: es

Característica: Reiniciar Partida o Volver al Inicio
  Como usuario invitado que perdió o ganó
  Quiero poder jugar otra partida sin registrar el puntaje anterior
  Para seguir practicando sin fricción

  @happy-path @critico
  Escenario: CRITERIO-5.1 — Reintentar partida desde pantalla de resultado
    Dado que el usuario invitado terminó una partida
    Y se encuentra en la pantalla de resultados
    Cuando presiona el botón "Jugar de Nuevo"
    Entonces navega a la pantalla del juego
    Y se inicia una nueva partida con términos aleatorios diferentes
    Y los contadores de aciertos y errores se reinician a cero

  @happy-path
  Escenario: CRITERIO-5.2 — Volver al inicio sin guardar datos
    Dado que el usuario invitado se encuentra en la pantalla del juego o de resultados
    Cuando presiona el botón "Volver al Inicio"
    Entonces navega a la página de inicio
    Y no se guarda ningún dato de la partida en el sistema
    Y el estado del juego se limpia completamente

  @error-path @seguridad
  Escenario: CRITERIO-5.3 — Invitado ganador redirigido a registro para guardar
    Dado que el usuario invitado ganó la partida con 70% de acierto
    Cuando llega a la pantalla de resultados
    Entonces no ve el botón "Guardar Puntaje"
    Y ve el botón "Crear Cuenta para Guardar Este Puntaje"
    Cuando presiona dicho botón
    Entonces es redirigido a la pantalla de registro
    Y el porcentaje de la partida se preserva para guardarlo tras el registro
```

---

---

## SPEC-004: Sistema de Administración, Dashboard, Niveles y Sugerencias

### Feature: Rol de Administrador y Promoción (HU-01)

```gherkin
#language: es

Característica: Rol de Administrador y Promoción
  Como administrador de la plataforma
  Quiero poder asignar el rol de administrador a otros usuarios
  Para delegar la gestión de la plataforma

  @happy-path @critico @smoke
  Escenario: CRITERIO-1.1 — Admin promueve usuario a administrador
    Dado que el usuario autenticado tiene rol "administrador"
    Y existe un usuario "pokefan_vzla" con rol "usuario"
    Cuando el administrador cambia el rol de "pokefan_vzla" a "administrador"
    Entonces el sistema actualiza el rol del usuario exitosamente
    Y el usuario "pokefan_vzla" ahora tiene rol "administrador"
    Y el sistema confirma la operación con un código 200

  @error-path @seguridad
  Escenario: CRITERIO-1.2 — Usuario sin permisos intenta promover
    Dado que el usuario autenticado tiene rol "usuario"
    Cuando intenta cambiar el rol de otro usuario a "administrador"
    Entonces el sistema rechaza la solicitud
    Y muestra el mensaje "No tienes permisos de administrador"
    Y el rol del usuario objetivo no cambia

  @error-path
  Escenario: CRITERIO-1.3 — Admin intenta promover usuario inexistente
    Dado que el usuario autenticado tiene rol "administrador"
    Cuando intenta cambiar el rol de un usuario que no existe en el sistema
    Entonces el sistema retorna el mensaje "Usuario no encontrado"
    Y ningún dato es modificado

  @edge-case @seguridad
  Escenario: Admin intenta cambiar su propio rol
    Dado que el usuario autenticado tiene rol "administrador"
    Cuando intenta cambiar su propio rol a "usuario"
    Entonces el sistema rechaza la solicitud
    Y muestra un mensaje indicando que no puede modificar su propio rol
    Y su rol permanece como "administrador"
```

---

### Feature: Banear Usuarios (HU-02)

```gherkin
#language: es

Característica: Banear Usuarios
  Como administrador de la plataforma
  Quiero poder banear usuarios que incumplan las reglas
  Para mantener la integridad de la comunidad

  @happy-path @critico @smoke
  Escenario: CRITERIO-2.1 — Admin banea un usuario
    Dado que el usuario autenticado es administrador
    Y existe un usuario activo "infractor_123"
    Cuando el administrador banea al usuario "infractor_123"
    Entonces el sistema marca al usuario como baneado
    Y muestra el mensaje "Usuario baneado exitosamente"
    Y el usuario baneado no puede iniciar sesión

  @happy-path @critico
  Escenario: CRITERIO-2.2 — Admin desbanea un usuario
    Dado que el usuario autenticado es administrador
    Y el usuario "infractor_123" está baneado
    Cuando el administrador desbanea al usuario "infractor_123"
    Entonces el sistema restablece el acceso del usuario
    Y muestra el mensaje "Usuario desbaneado exitosamente"
    Y el usuario puede volver a iniciar sesión

  @error-path @seguridad
  Escenario: CRITERIO-2.3 — Usuario baneado intenta iniciar sesión
    Dado que el usuario "infractor_123" fue baneado por un administrador
    Cuando intenta iniciar sesión con credenciales válidas
    Entonces el sistema rechaza el acceso
    Y muestra el mensaje "Tu cuenta ha sido suspendida"

  @edge-case @seguridad
  Escenario: Admin intenta banearse a sí mismo
    Dado que el usuario autenticado es administrador
    Cuando intenta banearse a sí mismo
    Entonces el sistema rechaza la solicitud
    Y muestra un mensaje indicando que no puede auto-banearse
    Y su cuenta permanece activa
```

---

### Feature: Gestión de Términos por Admin (HU-03)

```gherkin
#language: es

Característica: Gestión de Términos por el Administrador
  Como administrador de la plataforma
  Quiero poder agregar y eliminar términos del juego
  Para mantener el contenido fresco y variado

  @happy-path @critico @smoke
  Escenario: CRITERIO-3.1 — Admin agrega un nuevo término
    Dado que el usuario autenticado es administrador
    Y no existe un término con el texto "Totodile"
    Cuando agrega el término "Totodile" con categoría "Pokémon"
    Entonces el sistema crea el término exitosamente
    Y el término queda disponible para futuras partidas

  @happy-path @critico
  Escenario: CRITERIO-3.2 — Admin elimina un término existente
    Dado que el usuario autenticado es administrador
    Y existe el término "Snorlax" en la lista de términos
    Cuando elimina el término "Snorlax"
    Entonces el sistema elimina el término exitosamente
    Y el término ya no aparece en futuras partidas

  @error-path
  Escenario: CRITERIO-3.3 — Admin intenta agregar término duplicado
    Dado que el usuario autenticado es administrador
    Y ya existe un término con el texto "Pikachu"
    Cuando intenta agregar el término "Pikachu" con categoría "Pokémon"
    Entonces el sistema rechaza la solicitud
    Y muestra el mensaje "El término ya existe"
    Y no se crea un registro duplicado

  @edge-case
  Escenario: Admin intenta agregar término con categoría inválida
    Dado que el usuario autenticado es administrador
    Cuando intenta agregar el término "TestTerm" con categoría "comida"
    Entonces el sistema rechaza la solicitud
    Y muestra un mensaje indicando que la categoría solo puede ser "Pokémon" o "Venezolano"
```

---

### Feature: Dashboard de Usuario (HU-04)

```gherkin
#language: es

Característica: Dashboard de Usuario
  Como usuario autenticado
  Quiero tener un dashboard personal donde pueda iniciar partidas y ver mi progreso
  Para tener una experiencia centralizada y personalizada

  @happy-path @critico @smoke
  Escenario: CRITERIO-4.1 — Usuario ve su dashboard tras iniciar sesión
    Dado que el usuario "caraquenio_gamer" ha iniciado sesión exitosamente
    Y tiene nivel 5 con 520 puntos de experiencia
    Cuando accede al panel de usuario
    Entonces ve su nombre de usuario "caraquenio_gamer"
    Y ve su nivel actual como "Nivel 5"
    Y ve su experiencia acumulada "520 XP"
    Y ve un botón "Comenzar Partida"
    Y ve su historial de puntajes recientes

  @happy-path @critico
  Escenario: CRITERIO-4.2 — Usuario inicia partida desde el dashboard
    Dado que el usuario está en su panel de usuario
    Cuando presiona el botón "Comenzar Partida"
    Entonces navega a la pantalla del juego
    Y se inicia una nueva partida con términos aleatorios

  @happy-path
  Escenario: CRITERIO-4.3 — Usuario nivel 10+ ve opción de sugerir términos
    Dado que el usuario tiene nivel 10 o superior
    Y el umbral de sugerencias está configurado en 10
    Cuando accede a su panel de usuario
    Entonces ve la sección "Sugerir Término" con un formulario
    Y puede escribir un nombre y seleccionar una categoría

  @edge-case
  Escenario: CRITERIO-4.4 — Usuario nivel bajo no ve opción de sugerencias
    Dado que el usuario tiene nivel 5
    Y el umbral de sugerencias está configurado en 10
    Cuando accede a su panel de usuario
    Entonces no ve la sección de sugerencias
    Y ve un mensaje "Alcanza el nivel 10 para sugerir términos"
```

---

### Feature: Sistema de Niveles y XP (HU-05)

```gherkin
#language: es

Característica: Sistema de Niveles y Experiencia
  Como usuario del juego
  Quiero ganar experiencia al completar partidas y subir de nivel
  Para sentir progresión y desbloquear la funcionalidad de sugerencias

  @happy-path @critico @smoke
  Escenario: CRITERIO-5.1 — Usuario gana XP al completar partida
    Dado que el usuario "caraquenio_gamer" está autenticado
    Y tiene 80 puntos de experiencia en nivel 0
    Y completa una partida con 70% de acierto
    Cuando el sistema guarda el puntaje
    Entonces el usuario gana 70 puntos de experiencia
    Y su experiencia total pasa a 150
    Y su nivel sube de 0 a 1
    Y el sistema le indica que subió de nivel

  @happy-path @critico
  Esquema del escenario: CRITERIO-5.2/5.3 — Cálculo de XP y nivel
    Dado que la partida tiene 10 preguntas
    Y el usuario acertó <aciertos> respuestas
    Cuando el sistema calcula la experiencia ganada
    Entonces el usuario gana <xp_ganado> puntos de experiencia
    Y con experiencia acumulada de <xp_total> su nivel es <nivel>

    Ejemplos:
      | aciertos | xp_ganado | xp_total | nivel |
      | 10       | 100       | 100      | 1     |
      | 7        | 70        | 70       | 0     |
      | 8        | 80        | 250      | 2     |
      | 6        | 60        | 999      | 9     |
      | 10       | 100       | 1000     | 10    |

  @edge-case
  Escenario: CRITERIO-5.4 — Invitado no acumula XP
    Dado que el usuario está jugando como invitado sin cuenta
    Cuando completa una partida con 80% de acierto
    Entonces no se registra experiencia ni nivel
    Y el sistema no guarda puntaje automáticamente

  @edge-case
  Escenario: Frontera de nivel — XP exacto en límite
    Dado que el usuario tiene 99 puntos de experiencia en nivel 0
    Cuando completa una partida y gana 1 punto de experiencia adicional
    Entonces su experiencia total pasa a 100
    Y su nivel sube de 0 a 1
```

---

### Feature: Sugerencias de Términos (HU-06)

```gherkin
#language: es

Característica: Sugerencias de Términos por Usuarios Avanzados
  Como usuario de nivel 10 o superior
  Quiero poder sugerir nuevos nombres de pokémon o venezolano
  Para contribuir al contenido del juego

  @happy-path @critico @smoke
  Escenario: CRITERIO-6.1 — Usuario sugiere un nuevo término
    Dado que el usuario "pokefan_vzla" tiene nivel 12
    Y el umbral de sugerencias está configurado en 10
    Cuando sugiere el término "Typhlosion" con categoría "Pokémon"
    Entonces el sistema crea la sugerencia con estado "pendiente"
    Y confirma la creación exitosa

  @happy-path @critico
  Escenario: CRITERIO-6.2 — Admin aprueba una sugerencia
    Dado que existe una sugerencia pendiente del término "Typhlosion"
    Y el usuario autenticado es administrador
    Cuando aprueba la sugerencia de "Typhlosion"
    Entonces el término "Typhlosion" se agrega automáticamente a la lista de juego
    Y la sugerencia cambia a estado "aprobada"
    Y el sistema confirma la aprobación

  @happy-path
  Escenario: CRITERIO-6.3 — Admin rechaza una sugerencia
    Dado que existe una sugerencia pendiente del término "NombreInvalido"
    Y el usuario autenticado es administrador
    Cuando rechaza la sugerencia con la nota "No es un término válido"
    Entonces la sugerencia cambia a estado "rechazada"
    Y se registra la nota del administrador
    Y el término no se agrega a la lista de juego

  @error-path @seguridad
  Escenario: CRITERIO-6.4 — Usuario sin nivel suficiente intenta sugerir
    Dado que el usuario "novato_01" tiene nivel 5
    Y el umbral de sugerencias está configurado en 10
    Cuando intenta sugerir el término "Feraligatr"
    Entonces el sistema rechaza la solicitud
    Y muestra el mensaje "Necesitas nivel 10 para sugerir términos"

  @error-path
  Escenario: CRITERIO-6.5 — Usuario sugiere término que ya existe
    Dado que el usuario tiene nivel suficiente para sugerir
    Y ya existe el término "Pikachu" en la lista de juego
    Cuando intenta sugerir el término "Pikachu"
    Entonces el sistema rechaza la solicitud
    Y muestra el mensaje "Este término ya existe o ya fue sugerido"

  @edge-case
  Escenario: Usuario alcanza el límite de sugerencias pendientes
    Dado que el usuario "pokefan_vzla" tiene nivel 12
    Y ya tiene 5 sugerencias en estado "pendiente"
    Cuando intenta enviar una sexta sugerencia
    Entonces el sistema rechaza la solicitud
    Y muestra un mensaje indicando que tiene el máximo de sugerencias pendientes
```

---

### Feature: Dashboard de Administrador (HU-07)

```gherkin
#language: es

Característica: Dashboard de Administrador
  Como administrador de la plataforma
  Quiero tener un panel centralizado para gestionar usuarios, términos y sugerencias
  Para administrar la plataforma eficientemente

  @happy-path @critico @smoke
  Escenario: CRITERIO-7.1 — Admin accede al panel de administración
    Dado que el usuario autenticado tiene rol "administrador"
    Cuando accede al panel de administración
    Entonces ve tres secciones: "Usuarios", "Términos" y "Sugerencias"
    Y cada sección tiene controles de gestión

  @happy-path @critico
  Escenario: CRITERIO-7.2 — Admin ve listado de usuarios
    Dado que el administrador está en el panel de administración
    Cuando accede a la sección "Usuarios"
    Entonces ve una tabla con las columnas: nombre de usuario, nivel, rol, estado y acciones
    Y los usuarios activos muestran estado "Activo"
    Y los usuarios baneados muestran estado "Baneado"

  @happy-path
  Escenario: CRITERIO-7.3 — Admin ve sugerencias pendientes
    Dado que el administrador está en el panel de administración
    Y existen sugerencias de usuarios en estado "pendiente"
    Cuando accede a la sección "Sugerencias"
    Entonces ve una tabla con: texto sugerido, categoría, usuario, fecha y acciones
    Y cada sugerencia tiene botones "Aprobar" y "Rechazar"

  @error-path @seguridad
  Escenario: CRITERIO-7.4 — Usuario normal intenta acceder al panel admin
    Dado que el usuario autenticado tiene rol "usuario"
    Cuando intenta acceder al panel de administración
    Entonces es redirigido al panel de usuario
    Y ve el mensaje "No tienes permisos de administrador"
```

---

### Feature: Configuración del Umbral de Sugerencias (HU-08)

```gherkin
#language: es

Característica: Configuración del Umbral de Sugerencias
  Como administrador de la plataforma
  Quiero poder cambiar el nivel mínimo requerido para sugerir términos
  Para ajustar la mecánica según la comunidad crezca

  @happy-path @critico
  Escenario: CRITERIO-8.1 — Admin actualiza el umbral de sugerencias
    Dado que el administrador está en la configuración del sistema
    Y el umbral actual de sugerencias es nivel 10
    Cuando cambia el umbral de sugerencias a nivel 15
    Entonces el sistema actualiza el umbral exitosamente
    Y los usuarios con nivel entre 10 y 14 ya no pueden sugerir términos

  @error-path
  Escenario: Admin intenta configurar umbral fuera de rango
    Dado que el administrador está en la configuración del sistema
    Cuando intenta cambiar el umbral a un valor menor que 1 o mayor que 100
    Entonces el sistema rechaza la solicitud
    Y muestra un mensaje indicando que el valor debe estar entre 1 y 100

  @edge-case
  Escenario: Cambio de umbral afecta elegibilidad instantáneamente
    Dado que el usuario "pokefan_vzla" tiene nivel 12
    Y el umbral actual es nivel 10 y puede sugerir
    Cuando el administrador cambia el umbral a nivel 15
    Y "pokefan_vzla" intenta sugerir un término
    Entonces el sistema rechaza la sugerencia
    Y muestra el mensaje "Necesitas nivel 15 para sugerir términos"
```

---

## Resumen de Cobertura Gherkin

| Spec | Feature | HU | Escenarios | Tags principales |
|------|---------|-----|------------|-----------------|
| SPEC-002 | Registro | HU-01 | 5 | `@critico`, `@seguridad` |
| SPEC-002 | Login | HU-02 | 4 | `@critico`, `@seguridad` |
| SPEC-002 | Invitado | HU-03 | 2 | `@critico`, `@seguridad` |
| SPEC-003 | Mecánica | HU-01 | 4 | `@critico`, `@smoke` |
| SPEC-003 | Score | HU-02 | 4 | `@critico`, `@edge-case` |
| SPEC-003 | Guardar | HU-03 | 4 | `@critico`, `@seguridad` |
| SPEC-003 | Leaderboard | HU-04 | 4 | `@critico`, `@smoke` |
| SPEC-003 | Reiniciar | HU-05 | 3 | `@critico`, `@seguridad` |
| SPEC-004 | Rol Admin | HU-01 | 4 | `@critico`, `@seguridad` |
| SPEC-004 | Banear | HU-02 | 4 | `@critico`, `@seguridad` |
| SPEC-004 | Términos | HU-03 | 4 | `@critico`, `@smoke` |
| SPEC-004 | Dashboard Usuario | HU-04 | 4 | `@critico`, `@smoke` |
| SPEC-004 | Niveles/XP | HU-05 | 4 | `@critico`, `@edge-case` |
| SPEC-004 | Sugerencias | HU-06 | 6 | `@critico`, `@seguridad` |
| SPEC-004 | Dashboard Admin | HU-07 | 4 | `@critico`, `@seguridad` |
| SPEC-004 | Config Umbral | HU-08 | 3 | `@critico`, `@edge-case` |
| **Total** | | | **63** | |

---

**Versión:** 2.0
**Generado por:** QA Agent (ASDD)
