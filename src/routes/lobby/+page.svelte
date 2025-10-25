<script lang="ts">
    import { AlertDialog } from "bits-ui";

  let players = $state([
    "flksdjflsdkjfdksl",
    "flskjflsdjfklsj",
    "flksdjflsdkjfdksl",
    "flskjflsdjfklsj",
    "flksdjflsdkjfdksl",
    "lksfdjflksdj"
  ]);
</script>

<div class="flex flex-col justify-center items-center h-full gap-4">
  <div class="flex flex-col border-2 border-fg p-8 w-[60rem] rounded-xl">
    <form action="lobby" class="flex flex-col items-center h-full justify-between gap-12">
      <h1>WHATEVER THE NAME IS</h1>

      <div class="w-1/2 h-[24rem] overflow-auto rounded-xl flex flex-col items-center gap-2 p-4">
        {#each players as player, i}
          <span class="rounded-xl w-full bg-neutral-800 min-h-20 flex justify-center items-center gap-2">
            {#if i === 0}
              <iconify-icon icon="material-symbols:crown" class="text-2xl"></iconify-icon>
            {/if}

            <span>{player}</span>
          </span>
        {/each}
      </div>

      <div class="flex gap-4">
        <AlertDialog.Root>
          <AlertDialog.Trigger class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3">
            <iconify-icon icon="material-symbols:group" class="text-2xl"></iconify-icon>
            <span>invite</span>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80">
              <AlertDialog.Content class="border-2 border-fg p-4 rounded-2xl bg-bg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[40rem] flex flex-col items-center gap-6">
                <h2 class="font-bold text-xl underline underline-offset-2">JOIN CODE</h2>
                <span class="rounded-xl border-2 border-fg px-4 p-2 text-4xl font-bold">
                  ABIEJG
                </span>
                <div class="w-full flex gap-4 justify-center">
                  <AlertDialog.Cancel class="rounded-xl border-2 w-1/2 border-fg px-4 py-2">
                    close
                  </AlertDialog.Cancel>
                  <AlertDialog.Action class="rounded-xl border-2 w-1/2 border-fg px-4 py-2">
                    copy code
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Overlay>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        <a href="/play" class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3">
          <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
          <span>start game</span>
        </a>
      </div>
    </form>
  </div>
</div>
