import { writable } from "svelte/store";

// Store para rastrear a quantidade de água ingerida
export const waterConsumed = writable(0);

// Função para adicionar água ao total
export function addWater(ml: number) {
  waterConsumed.update((total) => total + ml);
}
