<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import "iconify-icon";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="h-screen flex flex-col">
	{@render children?.()}
</main>
