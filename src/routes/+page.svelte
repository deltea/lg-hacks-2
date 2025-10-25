<script lang="ts">
  import { generateDescription } from "$lib/ai-prompts";
  import Title from "$lib/components/Title.svelte";
  import { AlertDialog } from "bits-ui";
  import { onMount } from "svelte";

  let username = $state("");
  let description = $state("");
  let joinCode = $state("");

  onMount(() => {
    setInterval(() => {
      description = generateDescription();
    }, 2000);
  });
</script>

<form class="flex flex-col items-center h-full justify-center gap-12">
  <Title />

  <h2 class="italics text-neutral-500 typewriter">
    "{description}"
  </h2>

  <input
    type="text"
    placeholder="Username"
    bind:value={username}
    class="w-[24rem] h-12 mb-4 px-4 rounded-xl bg-neutral-800 focus:outline-none focus:border-accent"
  />

  <div class="flex gap-4">
    <a href="/play?username={username}&hosting=true" class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3 hover:scale-105 active:scale-100 duration-100">
      <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
      <span>Host a game</span>
    </a>

    <AlertDialog.Root>
      <AlertDialog.Trigger class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl px-6 py-4 cursor-pointer flex items-center gap-3">
        <iconify-icon icon="material-symbols:group" class="text-2xl"></iconify-icon>
        <span>Join a game</span>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80">
          <AlertDialog.Content class="border-4 border-fg p-4 rounded-2xl bg-bg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[40rem] flex flex-col items-center gap-8">
            <h2 class="font-bold text-xl">JOIN CODE</h2>

            <input
              type="text"
              placeholder="ABCDEF"
              maxlength={6}
              bind:value={joinCode}
              class="w-[11rem] text-center h-12 font-bold px-4 p-2 rounded-xl text-4xl bg-neutral-800 focus:outline-none focus:border-accent"
            />

            <div class="w-full flex gap-4 justify-center">
              <AlertDialog.Cancel class="rounded-xl w-1/2 bg-neutral-800 duration-100 hover:scale-105 active:scale-100 px-6 py-4 cursor-pointer">
                Cancel
              </AlertDialog.Cancel>

              <a
                href="/play?username={username}&joinCode={joinCode}"
                class="rounded-xl w-1/2 bg-fg text-bg duration-100 hover:scale-105 active:scale-100 px-6 py-4 cursor-pointer flex justify-center"
              >
                Join
              </a>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</form>
