// store.ts
import { writable } from "svelte/store";

// Store para rastrear a quantidade de água ingerida
export const waterConsumed = writable(0);

// Store para a quantidade diária sugerida de água (em ml)
export const dailyWaterGoal = writable(2000); // Padrão: 2000 ml

// Função para adicionar água ao total
export function addWater(ml: number) {
  waterConsumed.update((total) => total + ml);
}

// Função para ajustar a quantidade diária sugerida de água
export function setDailyWaterGoal(ml: number) {
  dailyWaterGoal.set(ml);
}
