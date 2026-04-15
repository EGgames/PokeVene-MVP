# Requerimientos de Negocio: Autenticación de Usuarios

## Descripción
Se requiere implementar un sistema de gestión de usuarios (registro e inicio de sesión) desarrollado íntegramente en el backend para permitir a los jugadores guardar su puntuación y aparecer en la tabla general de puntajes.

## Criterios de Aceptación
1. El usuario debe poder registrarse con un nombre de usuario y contraseña.
2. El usuario debe poder iniciar sesión para autenticar su identidad.
3. La autenticación debe ser gestionada mediante el backend (ej. JWT).
4. El sistema debe permitir jugar como invitado sin necesidad de autenticación inicial.
5. Al finalizar una partida como invitado, se debe ofrecer la opción de registro para guardar el puntaje.

## Restricciones
- No utilizar servicios externos como Firebase Auth.
- Persistencia en PostgreSQL.
- Las contraseñas deben ser almacenadas de forma segura (hashing).
