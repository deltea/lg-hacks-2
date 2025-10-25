<script lang="ts">
  import { AlertDialog } from "bits-ui";
  import { onMount } from "svelte";

  const songLength = 32;
  const songRange = 14;
  const colors = ["#008fb6", "#a41357", "#cf6200", "#ffcb4d", "#6ce9c4", "#ee6284"];
  const instruments = [
    "Piano",
    "Drums",
    "Bass",
    "Guitar",
    "Synth",
    "Strings"
  ];

  type State = "lobby" | "prompt" | "create";
  let gameState: State = $state("lobby");
  let song: boolean[][][] = $state([]);
  let currentInstrument = $state(0);
  let fillState = true;
  let players = $state([
    "flksdjflsdkjfdksl",
    "flskjflsdjfklsj",
    "flksdjflsdkjfdksl",
    "flskjflsdjfklsj",
    "flksdjflsdkjfdksl",
    "lksfdjflksdj"
  ]);

  function setNote(row: number, col: number) {
    song[currentInstrument][col][row] = fillState;
  }

  function changeInstrument(instrument: number) {
    currentInstrument = instrument;
  }

  function cellClicked(x: number, y: number) {
    fillState = !song[currentInstrument][y][x];
    setNote(x, y);
  }

  function nextState() {
    if (gameState == "lobby") {
      gameState = "prompt";
    } else if (gameState == "prompt") {
      gameState = "create";
    } else if (gameState == "create") {
      gameState = "prompt";
    }
  }

  onMount(() => {
    song = Array(instruments.length).fill(0).map(() => Array(songLength).fill(0).map(() => Array(songRange).fill(false)));
  });
</script>

<div class="flex flex-col justify-center items-center h-full gap-4">
  {#if gameState == "lobby"}
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

          <button onclick={nextState} class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3">
            <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
            <span>start game</span>
          </button>
        </div>
      </form>
    </div>
  {:else if gameState == "prompt"}
    <div class="w-[60rem] rounded-2xl border-2 border-fg p-8 flex flex-col items-center gap-12">
      <iconify-icon icon="material-symbols:draw-outline" class="text-[12rem]"></iconify-icon>

      <div class="flex flex-col items-center -mt-4">
        <h2 class="font-bold">WRITE A PROMPT!</h2>
        <h3>Describe a beat the next player will make</h3>
      </div>

      <form class="flex gap-4 h-12">
        <input
          type="text"
          placeholder="a sinister type beat"
          class="w-[24rem] h-full mb-4 px-4 rounded-xl border-2 border-fg bg-bg text-fg focus:outline-none focus:border-accent"
        />

        <button onclick={nextState} class="border-2 border-fg font-bold rounded-xl h-full cursor-pointer px-4 flex items-center gap-2 hover:bg-fg hover:text-bg">
          <iconify-icon icon="material-symbols:check" class="text-2xl"></iconify-icon>
          <span>done</span>
        </button>
      </form>
    </div>
  {:else if gameState == "create"}
    <div class="w-[80rem] rounded-2xl border-2 border-fg p-8 flex flex-col items-center gap-8">
      <div class="flex flex-col items-center">
        <h2 class="font-bold">CREATE A BEAT!</h2>
        <h3>
          <i>"a sinister type beat"</i>
        </h3>
      </div>

      <div class="w-full border-2 rounded-2xl border-fg h-[40rem] flex">
        <div class="flex flex-col overflow-auto w-[16rem] border-r-2 border-fg p-4">
          <h3 class="font-bold mb-4">TRACKS</h3>
          <div class="flex flex-col gap-2">
            {#each instruments as instrument, i}
              <button onclick={() => changeInstrument(i)} class="rounded-xl w-full bg-neutral-800 min-h-12 flex px-4 items-center gap-2 cursor-pointer hover:scale-105 duration-100 active:scale-100">
                <span>{instrument}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="grow border-l-2 border-fg relative overflow-x-auto grid grid-cols-32 grid-rows-14 rounded-r-2xl">
          {#each song[currentInstrument] as col, y}
            {#each col as item, x}
              <!-- svelte-ignore a11y_mouse_events_have_key_events -->
              <button
                onmousedown={e => e.buttons & 1 && cellClicked(x, y)}
                onmouseenter={e => e.buttons & 1 && setNote(x, y)}
                class="border w-full h-full {item ? 'border-transparent' : 'bg-bg hover:bg-neutral-800 border-neutral-800'}"
                style:background-color={item ? colors[currentInstrument] : "transparent"}
                aria-label="add note"
              ></button>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
