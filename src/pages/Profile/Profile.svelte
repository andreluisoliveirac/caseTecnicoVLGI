<script lang="ts">
  import LoggedInUser from "$stores/LoggedInUser";
  import {
    waterConsumed,
    addWater,
    dailyWaterGoal,
    setDailyWaterGoal,
  } from "$stores/WaterConsumed";
  import { onMount } from "svelte";

  async function requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificação:", error);
      return "denied";
    }
  }

  function showNotification() {
    dailyWaterGoal.subscribe(($dailyWaterGoal) => {
      void requestNotificationPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("Hora de beber água!", {
            body: `Lembre-se de beber ${$dailyWaterGoal} ml de água regularmente.`,
          });

          notification.onclick = () => {
            // Redirecionar para a página de registro de água ingerida
            window.location.href = "/profile";
          };
        }
      });
    });
  }

  onMount(() => {
    showNotification();
    setInterval(showNotification, 15 * 60 * 1000);
  });
</script>

{#if $LoggedInUser}
  <article>
    <h1>{$LoggedInUser.name}</h1>
    <img
      src={$LoggedInUser.image}
      alt="{$LoggedInUser.name}'s profile picture"
    />
  </article>
{/if}

<!-- Adicionar a quantidade de água  -->
<div class="container">
  <h1 class="rastreador">Rastreador de Água</h1>

  <p>Água ingerida hoje: {$waterConsumed} ml</p>

  <p>Meta diária de água: {$dailyWaterGoal} ml</p>

  <button on:click={() => addWater(250)}>Adicionar 250 ml</button>

  <input
    type="number"
    placeholder="Defina sua meta diária de água (ml)"
    on:input={(e) => setDailyWaterGoal(e.target.value)}
  />

  <!-- Exibir progresso de água ingerida no dia atual -->
  <div class="progress">
    <div
      class="bar"
      style="width: {($waterConsumed / $dailyWaterGoal) * 100}%"
    />
  </div>
</div>

<style lang="scss">
  img {
    width: 50ch;
    height: 50ch;
    border-radius: 100%;
  }
</style>
