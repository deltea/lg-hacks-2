<script lang="ts">
  import Title from "$lib/components/Title.svelte";
</script>

<div class="flex flex-col justify-center items-center h-full gap-4">
  <div class="flex flex-col border-2 border-fg p-8 w-[60rem] rounded-xl">
    <form action="lobby" class="flex flex-col items-center h-full justify-between gap-12">
      <Title />

      <input
        type="text"
        placeholder="Username"
        class="w-[24rem] h-12 mb-4 px-4 rounded-lg border-2 border-fg bg-bg text-fg focus:outline-none focus:border-accent"
      />

      <div class="flex gap-4">
        <button class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3">
          <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
          <span>host a game</span>
        </button>
        <button class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3">
          <iconify-icon icon="material-symbols:person" class="text-2xl"></iconify-icon>
          <span>join a game</span>
        </button>
      </div>
    </form>
  </div>
</div>
