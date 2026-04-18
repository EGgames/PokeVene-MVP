// Service: Funciones puras de cálculo de XP y nivel — sin estado ni dependencias (SPEC-004)

/**
 * Calcula el XP ganado en una partida a partir del score_percentage.
 * @param {number} scorePercentage - Porcentaje de aciertos (0-100)
 * @returns {number}
 */
function calculateXpGained(scorePercentage) {
  return Math.round(scorePercentage);
}

/**
 * Calcula el nivel a partir del XP total acumulado.
 * Nivel 1 con 0-99 XP, nivel 2 con 100-199 XP, etc.
 * @param {number} totalXp
 * @returns {number}
 */
function calculateLevel(totalXp) {
  return Math.floor(totalXp / 100) + 1;
}

module.exports = { calculateXpGained, calculateLevel };
