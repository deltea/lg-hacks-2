<script lang="ts">
  import { AlertDialog } from "bits-ui";
  import { onMount } from "svelte";
  import { Howl } from "howler";
  import { generatePrompt } from "$lib/ai-prompts";
  import Title from "$lib/components/Title.svelte";

  const songLength = 32;
  const songRange = 14;
  const instruments = [
    { name: "Piano", path: "/instruments/piano.wav", color: "#008fb6" },
    { name: "Kick", path: "/instruments/kick.wav", color: "#a41357" },
    { name: "Snare", path: "/instruments/snare.wav", color: "#cf6200" },
    { name: "Synth", path: "/instruments/synth.wav", color: "#6ce9c4" },
    { name: "Cowbell", path: "/instruments/cowbell.wav", color: "#ee6284" }
    // { name: "Guitar", path: "/instruments/guitar.wav", color: "#ffcb4d" },
  ];

  type GameState = "lobby" | "prompt" | "create" | "results";

  let { data } = $props();

  let gameState: GameState = $state("lobby");
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
  let sounds: Howl[] = [];
  let promptInput = $state("");
  let isPlaying = $state(false);
  let currentPlayTime = $state(0);
  let tempo = $state(120);
  let interval: NodeJS.Timeout;

  function setNote(row: number, col: number) {
    song[currentInstrument][col][row] = fillState;
    if (fillState) {
      const id = sounds[currentInstrument].play();
      sounds[currentInstrument].rate((1.059 ** 2) ** (7 - col), id);
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    currentPlayTime = 0;

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPlaying) {
        currentPlayTime = (currentPlayTime + 1) % songLength;
        for (let i = 0; i < instruments.length; i++) {
          for (let j = 0; j < song[i].length; j++) {
            const row = song[i][j];
            if (row[currentPlayTime]) {
              const id = sounds[i].play();
              sounds[i].rate(2 - j / songRange, id);
            }
          }
        }
      }
    }, 60000 / tempo / 4);
  }

  function changeInstrument(instrument: number) {
    currentInstrument = instrument;
  }

  function cellClicked(x: number, y: number) {
    fillState = !song[currentInstrument][y][x];
    setNote(x, y);
  }

  function setGameState(newState: GameState) {
    gameState = newState;
  }

  onMount(() => {
    song = Array(instruments.length).fill(0).map(() => Array(songRange).fill(0).map(() => Array(songLength).fill(false)));

    for (let i = 0; i < instruments.length; i++) {
      const instrument = instruments[i];
      sounds[i] = new Howl({
        src: [instrument.path],
        volume: 0.5
      });
    }

    document.addEventListener("keydown", e => {
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    });

    return () => {
      sounds.forEach(sound => sound.unload());
      song = [];
    };
  });
</script>

<div class="flex flex-col justify-center items-center h-full gap-4">
  {#if gameState == "lobby"}
    <form class="flex flex-col items-center h-full justify-evenly gap-12 w-full">
      <Title />

      <div class="flex flex-col items-center gap-2 border-4 border-neutral-800 px-4 pt-4 rounded-2xl">
        <h2 class="font-bold">PARTY</h2>
        <div class="w-[24rem] h-[24rem] overflow-auto rounded-xl flex flex-col gap-2 px-4">
          {#each players as player, i}
            <span class="rounded-xl w-full bg-neutral-900 min-h-16 flex px-4 items-center gap-2 hover:scale-105 duration-100 group">
              <div class="flex items-center gap-2">
                {#if i === 0}
                  <iconify-icon icon="material-symbols:crown" class="text-2xl"></iconify-icon>
                {/if}
                <span>{player}</span>
              </div>

              <span class="ml-auto group-hover:opacity-100 opacity-0 duration-100">
                <button class="flex justify-center items-center rounded-full size-8 bg-neutral-800 text-fg" aria-label="remove player">
                  <iconify-icon icon="material-symbols:close-small-outline" class="text-2xl"></iconify-icon>
                </button>
              </span>
            </span>
          {/each}
        </div>
      </div>

      <div class="flex gap-4">
        <AlertDialog.Root>
          <AlertDialog.Trigger class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl px-6 py-4 cursor-pointer flex items-center gap-3">
            <iconify-icon icon="material-symbols:group" class="text-2xl"></iconify-icon>
            <span>Invite</span>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80">
              <AlertDialog.Content class="border-4 border-fg p-4 rounded-2xl bg-bg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[40rem] flex flex-col items-center gap-6">
                <h2 class="font-bold text-xl">JOIN CODE</h2>
                <span class="rounded-xl border-4 border-neutral-800 px-4 p-2 text-4xl font-bold">
                  ABIEJG
                </span>

                <div class="w-full flex gap-4 justify-center">
                  <AlertDialog.Cancel class="rounded-xl w-1/2 bg-neutral-800 duration-100 hover:scale-105 active:scale-100 px-6 py-4 cursor-pointer">
                    Close
                  </AlertDialog.Cancel>
                  <AlertDialog.Action class="rounded-xl w-1/2 bg-fg text-bg duration-100 hover:scale-105 active:scale-100 px-6 py-4 cursor-pointer">
                    Copy code
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Overlay>
          </AlertDialog.Portal>
        </AlertDialog.Root>

        <button onclick={() => setGameState("prompt")} class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl px-6 py-4 cursor-pointer flex items-center gap-3">
          <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
          <span>Start game</span>
        </button>
      </div>
    </form>
  {:else if gameState == "prompt"}
    <div class="flex flex-col items-center h-full justify-evenly">
      <div class="flex flex-col items-center gap-8">
        <iconify-icon icon="material-symbols:draw-outline" class="text-[12rem]"></iconify-icon>
        <div class="flex flex-col items-center -mt-4">
          <h2 class="font-bold">WRITE A PROMPT!</h2>
          <h3>Describe a beat the next player will make</h3>
        </div>
      </div>

      <form class="flex gap-2 h-12">
        <input
          bind:value={promptInput}
          type="text"
          placeholder="a sinister type beat"
          class="w-[32rem] h-full mb-4 px-4 rounded-xl bg-neutral-800 focus:outline-none focus:border-accent"
        />
        <button onclick={() => (promptInput = generatePrompt())} class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl h-full cursor-pointer px-4 flex items-center">
          <span>✨</span>
        </button>
        <button onclick={() => setGameState("create")} class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl h-full cursor-pointer px-4 flex items-center gap-2">
          <iconify-icon icon="material-symbols:check" class="text-2xl"></iconify-icon>
          <span>done</span>
        </button>
      </form>
    </div>
  {:else if gameState == "create"}
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center gap-4">
        <button onclick={togglePlay} aria-label="play/pause">
          <iconify-icon
            icon={isPlaying ? "material-symbols:stop-circle" : "material-symbols:play-circle"}
            class="text-5xl cursor-pointer"
          ></iconify-icon>
        </button>
      </div>

      <div class="flex flex-col items-center">
        <h2 class="font-bold">CREATE A BEAT!</h2>
        <h3>
          <i>"a sinister type beat"</i>
        </h3>
      </div>

      <div class="flex items-center gap-3">
        <label for="tempo" class="font-bold">Tempo</label>
        <input
          bind:value={tempo}
          type="number"
          name="tempo"
          id="tempo"
          min={60}
          max={300}
          class="p-2 rounded-xl border-2 border-fg "
        />
      </div>
    </div>

    <div class="w-full border-4 rounded-2xl border-fg grow flex">
      <div class="flex flex-col overflow-auto w-[16rem] border-r-2 border-fg p-4">
        <h3 class="font-bold mb-4">TRACKS</h3>
        <div class="flex flex-col gap-2">
          {#each instruments as instrument, i}
            <button onclick={() => changeInstrument(i)} class="rounded-xl w-full min-h-12 flex px-4 items-center gap-2 cursor-pointer hover:scale-105 duration-100 active:scale-100 {i === currentInstrument ? 'bg-fg text-bg' : 'bg-neutral-900'}">
              <span>{instrument.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="grow border-l-2 border-fg relative overflow-x-auto grid grid-cols-32 grid-rows-14 rounded-r-2xl">
        <div
          class="bg-fg h-full w-1 absolute top-0 {isPlaying ? "block" : "hidden"}"
          style:left={`${(currentPlayTime / songLength) * 100}%`}
        ></div>

        {#each song[currentInstrument] as col, y}
          {#each col as item, x}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <button
              onmousedown={e => e.buttons & 1 && cellClicked(x, y)}
              onmouseenter={e => e.buttons & 1 && setNote(x, y)}
              class="border w-full h-full {item ? 'border-transparent' : 'bg-bg hover:bg-neutral-800 border-neutral-800'}"
              style:background-color={item ? instruments[currentInstrument].color : "transparent"}
              aria-label="add note"
            ></button>
          {/each}
        {/each}
      </div>
    </div>
  {:else if gameState == "results"}
    <div class="w-[80rem] rounded-2xl border-2 border-fg p-8 flex flex-col gap-8">

    </div>
  {/if}
</div>
