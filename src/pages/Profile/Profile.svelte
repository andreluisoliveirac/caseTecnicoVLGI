<script lang="ts">
  import LoggedInUser from "$stores/LoggedInUser";
  import {
    waterConsumed,
    addWater,
    dailyWaterGoal,
    setDailyWaterGoal,
  } from "$stores/WaterConsumed";
  import { onMount } from "svelte";

  let dailyGoal: number;

  dailyWaterGoal.subscribe(value => dailyGoal = value);

  async function requestNotificationPermission(): Promise<string> {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificação:", error);
      return "denied";
    }
  }

  function showNotification() {
    requestNotificationPermission().then(permission => {
      if (permission === "granted") {
        const notification = new Notification("Hora de beber água!", {
          body: `Lembre-se de beber ${dailyGoal} ml de água regularmente.`,
        });

        notification.onclick = () => {
          window.location.href = "/profile";
        };
      }
    });
  }

  onMount(() => {
    showNotification();
    setInterval(showNotification, 15 * 60 * 1000);
  });

  function handleWaterGoalInput(e: Event) {
    const value = (e.target as HTMLInputElement).valueAsNumber;
    if (value > 0) {
      setDailyWaterGoal(value);
    }
  }
</script>

{#if $LoggedInUser}
  <article>
    <h1>{$LoggedInUser.name}</h1>
    <img src={$LoggedInUser.image} alt="{$LoggedInUser.name}'s profile picture" />
  </article>
{/if}

<div class="container">
  <h1 class="rastreador">Rastreador de Água</h1>
  <p>Água ingerida hoje: {$waterConsumed} ml</p>
  <p>Meta diária de água: {$dailyWaterGoal} ml</p>
  <button on:click={() => addWater(250)}>Adicionar 250 ml</button>
  <input type="number" min="1" placeholder="Defina sua meta diária de água (ml)" on:input={handleWaterGoalInput} />
  <div class="progress">
    <div class="bar" style="width: {Math.min(100, Math.max(0, ($waterConsumed / $dailyWaterGoal) * 100))}%"></div>
  </div>
</div>

<style lang="scss">
  img {
    width: 50ch;
    height: 50ch;
    border-radius: 50%;
  }
</style>
