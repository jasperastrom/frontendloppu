<script>
	import { selectedGame, storeLogos, fetchStoreLogos } from '$store/gameStore.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	export let gameid;

	let error = null;
	let selectedGameDetails = null;
	let logos = {};

	// Kun sivu renderöidään se aktivoi storesta funktion joka fetchaa kauppojen logot. Tälle oli apissa oma URL, joten jouduttiin tekemään kokonaan uusi funktio tälle.
	onMount(() => {
		fetchStoreLogos();
	});
	function redirectToWebsite(dealID) {
		window.open(`https://www.cheapshark.com/redirect?dealID=${dealID}`, '_blank');
	}

	// Funktio joka navigoi takasin etusivulle
	function goBack() {
		goto(`/`);
	}

	// reaktiivisesti subataan storen muuttujia.
	$: selectedGameDetails = $selectedGame;
	$: logos = $storeLogos;
</script>

<main class="flex min-h-screen flex-col items-center bg-pink-50 py-6">
	<button
		on:click={goBack}
		class="mb-6 rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
	>
		Back to Home
	</button>

	<h1 class="mb-6 text-5xl font-extrabold text-purple-300">Game Details</h1>

	{#if error}
		<p class="font-semibold text-red-500">{error}</p>
	{/if}

	{#if selectedGameDetails}
		<!-- Näytetään yhden pelin tarkemmat tiedot. -->
		<div class="game-details mt-6 w-[80%] rounded-lg bg-white p-6 shadow-xl md:w-[60%]">
			<h2 class="text-center text-3xl font-bold text-purple-700">
				{selectedGameDetails.info.title}
			</h2>
			<img
				src={selectedGameDetails.info.thumb}
				alt={selectedGameDetails.info.title}
				class="game-image-large mx-auto mt-4 w-full max-w-[150px] rounded-lg shadow-md"
			/>
			<p class="mt-4 text-2xl font-bold text-green-600">
				Cheapest Price Ever: <span class="text-3xl"
					>{selectedGameDetails.cheapestPriceEver.price}€</span
				>
			</p>
			<p class="mt-2 text-lg text-gray-600">Deals:</p>
			<ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each selectedGameDetails.deals || [] as deal}
					<!-- Loopataan kaikki diilit kyseiselle pelille. -->
					<li class="flex items-center space-x-4">
						{#if logos[deal.storeID]}
							<!-- kaupan iconi redirectaa suoraan sivulle mistä diili löytyy. -->
							<img
								on:click={() => redirectToWebsite(deal.dealID)}
								src={logos[deal.storeID]}
								alt="Store Logo"
								class="store-logo h-10 w-10 cursor-pointer transition-all hover:ring-4 hover:ring-orange-300"
							/>
						{:else}
							<p class="text-sm text-gray-600">Store ID: {deal.storeID}</p>
						{/if}
						<!-- Nappi hinnoille ja kun niitä painaa se redirectaa suoraan sivulle, mistä diili löytyy -->
						<button
							on:click={() => redirectToWebsite(deal.dealID)}
							class="rounded-lg px-4 py-2 text-lg font-semibold text-purple-600 shadow-md transition-all hover:bg-purple-600 hover:text-white"
						>
							{deal.price}€
						</button>

						<p class="text-sm text-gray-500">
							Retail Price: <span class="line-through">{deal.retailPrice}€</span>
						</p>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p class="text-lg text-gray-600">Loading game details...</p>
	{/if}
</main>
