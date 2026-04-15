#language: es

Característica: Reiniciar Partida o Volver al Inicio
  Como usuario invitado que perdió o ganó
  Quiero poder jugar otra partida sin registrar el puntaje anterior
  Para seguir practicando sin fricción

  @happy-path @critico
  Escenario: CRITERIO-5.1 — Reintentar partida desde pantalla de resultado
    Dado que el usuario accede a la pantalla del juego
    Cuando la página termina de cargar
    Y el usuario responde las 10 preguntas de la partida
    Y el sistema navega automáticamente a la pantalla de resultados
    Y presiona el botón "Jugar de Nuevo"
    Entonces navega a la pantalla del juego
    Y se inicia una nueva partida con el contador reiniciado

  @happy-path @wip
  Escenario: CRITERIO-5.2 — Volver al inicio sin guardar datos
    Dado que el usuario invitado se encuentra en la pantalla del juego o de resultados
    Cuando presiona el botón "Volver al Inicio"
    Entonces navega a la página de inicio
    Y no se guarda ningún dato de la partida en el sistema
    Y el estado del juego se limpia completamente

  @error-path @seguridad @wip
  Escenario: CRITERIO-5.3 — Invitado ganador redirigido a registro para guardar
    Dado que el usuario invitado ganó la partida con 70% de acierto
    Cuando llega a la pantalla de resultados
    Entonces no ve el botón "Guardar Puntaje"
    Y ve el botón "Crear Cuenta para Guardar Este Puntaje"
    Cuando presiona dicho botón
    Entonces es redirigido a la pantalla de registro
    Y el porcentaje de la partida se preserva para guardarlo tras el registro
