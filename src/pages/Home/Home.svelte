<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  interface Pause {
    type: string;
    timestamp: Date;
  }

  const NOTIFICATION_INTERVAL = 30 * 60 * 1000;

  let pauses: Pause[] = [];

  $: totalPauses = pauses.length;
  $: {
    const today = new Date().toLocaleDateString();
    pausesToday = pauses.filter(
      (pause) => pause.timestamp.toLocaleDateString() === today
    ).length;
  }
  let pausesToday = 0;

  function registerPause(type: string) {
    const timestamp = new Date();
    pauses = [...pauses, { type, timestamp }];
  }

  function updateCounters() {
    totalPauses = pauses.length;

    const today = new Date().toLocaleDateString();
    pausesToday = pauses.filter(
      (pause) => pause.timestamp.toLocaleDateString() === today
    ).length;
  }

  onMount(() => {
    updateCounters();

    setInterval(() => {
      notifyUserToMove();
    }, NOTIFICATION_INTERVAL);
  });

  function requestNotificationPermission(): Promise<NotificationPermission> {
    if (Notification.permission === "denied") {
      return Promise.reject(new Error("Permission denied"));
    }
    if (Notification.permission === "granted") {
      return Promise.resolve("granted");
    }
    return Notification.requestPermission();
  }

  function notifyUserToMove() {
    requestNotificationPermission()
      .then((permission) => {
        if (permission === "granted") {
          const notification = new Notification(
            "Hora de se levantar e andar ou alongar!",
            {
              icon: "path/to/your/icon.png",
              body: "Clique para registrar uma pausa no aplicativo.",
            }
          );

          notification.onclick = () => {
            registerPause("Andar");
          };
        }
      })
      .catch((error) => {
        console.error("Erro ao solicitar permissão de notificação:", error);
      });
  }
</script>

<main>
  <h1>Rastreador de Pausas</h1>

  <button on:click={() => registerPause("Andar")}
    >Registrar Pausa para Andar</button
  >
  <button on:click={() => registerPause("Alongar")}
    >Registrar Pausa para Alongar</button
  >

  <h2>Registros de Pausas</h2>
  {#if pauses.length > 0}
    <ul>
      {#each pauses as { type, timestamp }}
        <li>{type} - {timestamp.toLocaleTimeString()}</li>
      {/each}
    </ul>
  {:else}
    <p>Nenhuma pausa registrada ainda.</p>
  {/if}

  <div>
    <h2>Estatísticas</h2>
    <p>Total de Pausas: {totalPauses}</p>
    <p>Pausas Hoje: {pausesToday}</p>
    <p>Progresso do Dia: {Math.round((pausesToday / 4) * 100)}%</p>
  </div>

  <div>
    <button
      on:click={() => {
        push("profile").catch((e) => {
          throw e;
        });
      }}>Clique para ir para o Rastreador de Água</button
    >
  </div>
</main>
