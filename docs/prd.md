# Product Requirement Document (PRD) - PokeVene

## 1. Introducción e Información General
**PokeVene** es un juego web de humor y entretenimiento diseñado para atraer usuarios mediante una mecánica sencilla, rápida y adictiva. El juego desafía al usuario a identificar si un término presentado pertenece al universo de Pokémon o a la cultura popular/jerga venezolana.

### 1.1 Objetivos del Negocio
- Incrementar el tráfico y la retención de usuarios en la plataforma de entretenimiento.
- Crear una experiencia viral basada en el contraste entre el mundo Pokémon y la identidad venezolana.
- Incentivar el registro de usuarios mediante la gamificación y tablas de clasificación.

## 2. Definición del Producto
### 2.1 Público Objetivo
- Fans de la franquicia Pokémon.
- Personas familiarizadas con la cultura popular y jerga venezolana.
- Usuarios ocasionales de juegos web de trivia/humor.

### 2.2 Propuesta de Valor
Un juego de trivia minimalista que utiliza la ambigüedad fonética o conceptual entre nombres de Pokémon y términos venezolanos para generar una experiencia entretenida y desafiante.

## 3. Requerimientos Funcionales

### 3.1 Flujo del Juego (Core)
- **Mecánica Principal**: Se presenta un nombre/término y dos botones: "Pokémon" o "Venezolano".
- **Validación**: El sistema valida la selección de forma inmediata e indica si el usuario acertó o erró.
- **Condición de Victoria**: El usuario gana si logra un acierto superior al 50% + 1 del total de preguntas.

### 3.2 Gestión de Usuarios y Autenticación
- **Modo Invitado**: Permite jugar sin registro previo.
- **Registro Post-Partida**: Al finalizar una partida como invitado, se ofrece la opción de crear una cuenta para guardar el puntaje.
- **Registro Previo**: Opción de inicio de sesión/registro desde el inicio.
- **Autenticación**: Gestionada íntegramente por el backend (JWT o similar) con persistencia en PostgreSQL.

### 3.3 Sistema de Puntuación y Tablas
- **Cálculo de Score**: Porcentaje de acierto y error sobre 100.
- **Tabla General de Puntajes**: Ranking público visible para todos los usuarios.
- **Persistencia**: Solo los usuarios registrados pueden publicar sus puntajes en la tabla general.

### 3.4 Opciones Finales (Post-Juego)
1. **Invitados**: Opción de crear cuenta para subir puntaje.
2. **Usuarios Registrados**: Opción de compartir puntaje en la tabla general.
3. **Reinicio**: Opción de jugar una nueva partida sin guardar puntos.

## 4. Requerimientos No Funcionales

### 4.1 Stack Tecnológico
- **Frontend**: React.
- **Backend**: Node.js (JavaScript) con PostgreSQL.
- **Autenticación**: Implementación personalizada en el Backend.
- **Calidad**: Serenity BDD + WebDriver + GitHub Actions para el pipeline de CI/CD.

### 4.2 Atributos de Calidad
- **Usabilidad**: Interfaz intuitiva y adaptada a dispositivos móviles.
- **Disponibilidad**: El juego debe ser accesible de forma rápida sin tiempos de carga prolongados.

## 5. Diccionario de Dominio (Extracto)
- **Usuario**: Persona autenticada mediante el sistema del Backend.
- **ID**: Identificador único generado por la base de datos PostgreSQL.
- **Score**: Porcentaje de acierto basado en las respuestas de la partida.

---
*Este documento ha sido generado siguiendo el contexto de reglas primitivas del proyecto.*
