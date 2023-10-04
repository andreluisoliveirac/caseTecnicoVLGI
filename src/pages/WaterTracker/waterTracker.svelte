<script lang="ts">
  import { waterConsumed, addWater, dailyWaterGoal, setDailyWaterGoal } from "$stores/WaterConsumed";
  import { onMount } from "svelte";

  let dailyGoal: number;
  dailyWaterGoal.subscribe((value) => (dailyGoal = value));

  let startHour = 7; // 7AM
  let endHour = 22; // 10PM

  async function requestNotificationPermission(): Promise<string> {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificação:", error);
      return "denied";
    }
  }

  function getNotificationCount(): number {
    const notificationsPerHour = 60 / 15; // A cada 15 minutos
    return (endHour - startHour) * notificationsPerHour;
  }

  function getNotificationWaterAmount(): number {
    const notificationsCount = getNotificationCount();
    const waterPerNotification = dailyGoal / notificationsCount;
    return Math.round(Math.max(waterPerNotification, 250));
}

  function showNotification() {
    requestNotificationPermission()
      .then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("Hora de beber água!", {
            body: `Lembre-se de beber ${getNotificationWaterAmount()} ml de água.`,
          });

          notification.onclick = () => {
            window.location.href = "/profile";
          };
        }
      })
      .catch((error) => {
        console.error("Error requesting notification permission:", error);
      });
  }

  onMount(() => {
    function checkAndShowNotification() {
      const currentHour = new Date().getHours();
      if (currentHour >= startHour && currentHour <= endHour) {
        showNotification();
      }
    }

    checkAndShowNotification();
    setInterval(checkAndShowNotification, 15 * 60 * 1000);
  });

  function handleWaterGoalInput(e: Event) {
    const value = (e.target as HTMLInputElement).valueAsNumber;
    if (value > 0) {
      setDailyWaterGoal(value);
    }
  }
</script>

<div class="container">
  <h1 class="rastreador">Rastreador de Água</h1>
  <p>Água ingerida hoje: {$waterConsumed} ml</p>
  <p>Meta diária de água: {$dailyWaterGoal} ml</p>
  <button on:click={() => addWater(250)}>Adicionar 250 ml</button>
  <input
    type="number"
    min="1"
    placeholder="Defina sua meta diária de água (ml)"
    on:input={handleWaterGoalInput}
  />
  <p>Notificar das:
    <input type="number" min="0" max="23" bind:value={startHour}>h
    até:
    <input type="number" min="0" max="23" bind:value={endHour}>h
  </p>
  <div class="progress">
    <div
      class="bar"
      style="width: {Math.min(
        100,
        Math.max(0, ($waterConsumed / $dailyWaterGoal) * 100)
      )}%"
    />
  </div>
</div>
