<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import "iconify-icon";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="h-screen flex flex-col justify-center items-center p-8">
	<div class="flex flex-col border-4 border-neutral-800 p-6 w-full h-full rounded-xl relative">
		{@render children?.()}
	</div>
</main>
