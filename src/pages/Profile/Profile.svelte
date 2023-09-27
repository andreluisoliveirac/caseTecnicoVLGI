<script lang="ts">
  import LoggedInUser from "$stores/LoggedInUser";
  import { waterConsumed, addWater } from "$stores/WaterConsumed";
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

<div class="container">
  <h1>Rastreador de Água</h1>

  <p>Água ingerida hoje: {$waterConsumed} ml</p>

  <button on:click={() => addWater(250)}>Adicionar 250 ml</button>

  <!-- Exibir progresso de água ingerida no dia atual -->
  <div class="progress">
    <div
      class="bar"
      style="width: {($waterConsumed / 2000) * 100}%"
    />
  </div>
</div>
