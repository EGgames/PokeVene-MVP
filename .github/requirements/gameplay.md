# Requerimientos de Negocio: Core del Juego y Score

## Descripción
Se requiere implementar la mecánica principal del juego "PokeVene", basada en identificar correctamente si un término pertenece a la franquicia Pokémon o a la cultura popular/jerga venezolana.

## Criterios de Aceptación
1. El sistema debe presentar un término aleatorio al usuario.
2. La interfaz debe mostrar dos botones claramente identificados: "Pokémon" y "Venezolano".
3. Al seleccionar una opción, el sistema debe indicar inmediatamente si la respuesta es correcta o incorrecta.
4. El sistema debe calcular un score final basado en el porcentaje de aciertos sobre el total de preguntas de la partida.
5. Un usuario "Gana" la partida si su porcentaje de aciertos es superior al 50% + 1.
6. Al finalizar la partida, se le debe dar al usuario registrado la opción de compartir su puntaje en una tabla general.
7. Los usuarios que jueguen como invitados deben ser informados sobre su desempeño y se les dará la opción de registrarse para subir su puntaje.

## Restricciones
- La lógica de validación de respuestas puede residir inicialmente en el frontend para una respuesta inmediata.
- El score final debe ser validado y guardado en el backend para usuarios registrados.
- La tabla de puntajes debe ser pública para su visualización.
