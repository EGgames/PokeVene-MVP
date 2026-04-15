#language: es

Característica: Mecánica de Juego — Pokémon o Venezolano
  Como usuario autenticado o invitado
  Quiero responder preguntas identificando términos como Pokémon o Venezolano
  Para entrenarme y acumular una puntuación en la partida

  @happy-path @critico @smoke
  Escenario: CRITERIO-1.1 — Iniciar partida y ver primer término
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Entonces ve un término en el centro de la pantalla
    Y ve dos botones lado a lado: "Pokémon" y "Venezolano"
    Y ve un contador que indica "Pregunta 1 de 10"
    Y ve una barra de progreso en su estado inicial

  @happy-path @critico
  Escenario: CRITERIO-1.2 — Responder correctamente a un término
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde correctamente al término mostrado
    Entonces el sistema muestra feedback positivo
    Y después de un breve instante se carga automáticamente el siguiente término
    Y el contador avanza a "Pregunta 2 de 10"

  @error-path @wip
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
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde las 10 preguntas de la partida
    Entonces el sistema navega automáticamente a la pantalla de resultados
    Y muestra los aciertos, errores, porcentaje y el estado de la partida
