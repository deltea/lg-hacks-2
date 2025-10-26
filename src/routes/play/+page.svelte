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

  type GameState = "lobby" | "prompt" | "create" | "results" | "guess";

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

  function playSong(song: boolean[][][], tempo: number) {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (isPlaying) {
        currentPlayTime = (currentPlayTime + 1) % songLength;
        for (let i = 0; i < instruments.length; i++) {
          for (let j = 0; j < song[i].length; j++) {
            const row = song[i][j];
            if (row[currentPlayTime]) {
              const id = sounds[i].play();
              sounds[i].rate((1.059 ** 2) ** (7 - j), id);
            }
          }
        }
      }
    }, 60000 / tempo / 4);
  }

  function submitSong() {
    // submit the song here
  }

  function stopSong() {
    isPlaying = false;
    currentPlayTime = 0;
    clearInterval(interval);
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    currentPlayTime = 0;

    playSong(song, tempo);
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
        <div class="w-[24rem] h-[24rem] overflow-auto rounded-xl flex flex-col gap-2 px-4 pb-4">
          {#each players as player, i}
            <span class="rounded-xl w-full bg-neutral-900 min-h-16 flex px-4 items-center gap-2 hover:scale-105 duration-100 group">
              <div class="flex items-center gap-2">
                {#if i === 0}
                  <iconify-icon icon="material-symbols:crown" class="text-2xl"></iconify-icon>
                {/if}
                <span>{player}</span>
              </div>

              <span class="ml-auto group-hover:opacity-100 opacity-0 duration-100">
                <button class="flex justify-center items-center rounded-full size-8 bg-neutral-800 text-fg cursor-pointer" aria-label="remove player">
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

        <button onclick={() => setGameState("prompt")} class="border-2 border-fg font-bold rounded-xl px-4 py-2 cursor-pointer flex items-center gap-3 hover:scale-105 active:scale-100 duration-100">
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
          <h3>Describe the beat the next player will make</h3>
        </div>
      </div>

      <form class="flex gap-2 h-12">
        <div class="bg-neutral-800 w-[32rem] rounded-xl pl-4 flex items-center">
          <input
            bind:value={promptInput}
            type="text"
            placeholder="a sinister type beat"
            class="w-full h-full outline-none"
          />

          <button
            onclick={() => (promptInput = generatePrompt())} class="bg-neutral-800 font-bold rounded-xl h-full cursor-pointer px-4 flex items-center text-xl"
            aria-label="generate prompt"
          >
            <iconify-icon icon="mingcute:sparkles-fill" class="text-2xl"></iconify-icon>
          </button>
        </div>

        <button onclick={() => setGameState("create")} class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl h-full cursor-pointer px-6 flex items-center gap-2">
          <iconify-icon icon="material-symbols:check" class="text-2xl"></iconify-icon>
          <span>Done</span>
        </button>
      </form>
    </div>
  {:else if gameState == "create"}
    <div class="flex justify-between items-center w-full">
      <div
        class="w-full bg-fg h-2 absolute top-0 left-0 -z-10"
        style:width={`${(2 / 3) * 100}%`}
      ></div>

      <div class="flex items-center gap-4">
        <button onclick={togglePlay} class="hover:scale-110 active:scale-100 duration-100" aria-label="play/pause">
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
        <div class="flex flex-col gap-2 relative grow">
          {#each instruments as instrument, i}
            <button onclick={() => changeInstrument(i)} class="rounded-xl w-full min-h-12 flex px-4 items-center gap-2 cursor-pointer hover:scale-105 duration-100 active:scale-100 {i === currentInstrument ? 'bg-fg text-bg' : 'bg-neutral-900'}">
              <span>{instrument.name}</span>
            </button>
          {/each}

          <button onclick={submitSong} class="font-bold absolute bottom-0 left-0 w-full py-4 bg-fg text-bg rounded-xl cursor-pointer hover:scale-105 active:scale-100 duration-100">
            Submit
          </button>
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
              class="outline-none border w-full h-full {item ? 'border-transparent' : 'bg-bg hover:bg-neutral-800 border-neutral-800'}"
              style:background-color={item ? instruments[currentInstrument].color : "transparent"}
              aria-label="add note"
            ></button>
          {/each}
        {/each}
      </div>
    </div>
  {:else if gameState == "guess"}
    <div class="flex flex-col items-center h-full justify-evenly">
      <div class="flex flex-col items-center gap-8">
        <iconify-icon icon="material-symbols:question-mark" class="text-[12rem]"></iconify-icon>
        <div class="flex flex-col items-center -mt-4">
          <h2 class="font-bold">GUESS THE PROMPT!</h2>
          <h3>Based on the beat, guess what the original prompt was</h3>
        </div>
      </div>

      <button class="border-2 border-fg font-bold rounded-xl px-6 py-4 cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-100 duration-100">
        <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
        <span>Play Beat</span>
      </button>

      <form class="flex gap-2 h-12">
        <div class="bg-neutral-800 w-[32rem] rounded-xl pl-4 flex items-center">
          <input
            bind:value={promptInput}
            type="text"
            placeholder="a sinister type beat"
            class="w-full h-full outline-none"
          />
        </div>

        <button onclick={() => setGameState("create")} class="bg-neutral-800 duration-100 hover:scale-105 active:scale-100 font-bold rounded-xl h-full cursor-pointer px-6 flex items-center gap-2">
          <iconify-icon icon="material-symbols:check" class="text-2xl"></iconify-icon>
          <span>Done</span>
        </button>
      </form>
    </div>
  {:else if gameState == "results"}
    <div class="w-[45rem] flex h-full overflow-auto pt-8">
      <!-- prompts -->
      <div class="flex flex-col h-full w-1/2 gap-[10rem]">
        {#each ["osdkjlskdjflksjdlkjfskld", "ldskjflksdjflksjdflksjdlkfj", "lksjdflksdjflksdjlfkjdjsl", "slkdjflskdjfldsjljdslfjklj"] as prompt}
          <div class="rounded-full px-6 py-4 bg-neutral-800 text-fg">
            {prompt}
          </div>
        {/each}
      </div>

      <!-- songs -->
      <div class="flex flex-col h-full w-1/2 gap-[10rem] mt-[5rem]">
        {#each ["osdkjlskdjflksjdlkjfskld", "ldskjflksdjflksjdflksjdlkfj", "lksjdflksdjflksdjlfkjdjsl", "slkdjflskdjfldsjljdslfjklj"] as prompt}
          <button class="rounded-full px-6 py-4 bg-fg text-bg font-bold flex items-center gap-2 cursor-pointer">
            <iconify-icon icon="material-symbols:play-arrow" class="text-2xl"></iconify-icon>
            <span>PLAY SONG</span>
          </button>
        {/each}
      </div>
    </div>

    <a href="/" class="bg-fg font-bold w-[45rem] justify-center text-bg rounded-xl px-6 py-4 cursor-pointer flex items-center gap-2 hover:scale-[102%] active:scale-100 duration-100">
      <iconify-icon icon="material-symbols:home" class="text-xl"></iconify-icon>
      <span>Home</span>
    </a>
  {/if}
</div>
