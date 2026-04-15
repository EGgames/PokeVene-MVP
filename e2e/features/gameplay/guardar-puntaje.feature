#language: es

Característica: Guardar Puntaje en la Tabla General
  Como usuario autenticado que ganó la partida
  Quiero poder guardar mi puntaje en la tabla general
  Para competir con otros jugadores y verificar mi posición

  @happy-path @critico
  Escenario: CRITERIO-3.1 — Usuario autenticado ve opción de guardar tras ganar
    Dado que el usuario "caraquenio_gamer" está autenticado con un token válido
    Y el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde correctamente 8 de 10 preguntas
    Entonces el sistema navega automáticamente a la pantalla de resultados
    Y ve el botón "Guardar en Tabla General" habilitado

  @happy-path @critico @smoke
  Escenario: CRITERIO-3.2 — Guardar puntaje exitosamente en el backend
    Dado que el usuario "caraquenio_gamer" está autenticado con un token válido
    Y el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde correctamente 8 de 10 preguntas
    Y el sistema navega automáticamente a la pantalla de resultados
    Y presiona el botón "Guardar en Tabla General"
    Entonces muestra el mensaje "¡Puntaje guardado exitosamente!"
    Y ofrece el botón "Ver Tabla de Posiciones"

  @error-path @seguridad @wip
  Escenario: CRITERIO-3.3 — Backend rechaza puntaje perdedor
    Dado que el usuario "caraquenio_gamer" está autenticado con un token válido
    Y perdió la partida con 4 aciertos de 10 preguntas (40%)
    Cuando intenta enviar el puntaje al backend directamente
    Entonces el backend retorna un código de estado 400
    Y muestra el mensaje "No puedes guardar un puntaje con menos de 51%"
    Y el puntaje no es almacenado

  @edge-case @wip
  Escenario: CRITERIO-3.4 — Prevención de puntaje duplicado en la misma partida
    Dado que el usuario "caraquenio_gamer" ya guardó el puntaje de la partida actual
    Cuando presiona el botón de guardar nuevamente
    Entonces el botón está deshabilitado
    Y muestra el mensaje "Este puntaje ya fue guardado"
    Y no se crea un registro duplicado en el backend
