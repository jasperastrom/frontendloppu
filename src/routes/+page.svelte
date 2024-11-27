<script>
	import { searchGame, gameName, gameData, error, selectGame } from '$store/gameStore.js';

	let localGameName = ''; // input valuen muuttuja

	//trigger search funnktio, joka aktivoituu kun serchia painetaan.
	function triggerSearch() {
		gameName.set(localGameName); // Otetaan input valuen muuttuja ja asetetaan se Storeen gameName muuttujaan.
		searchGame(); // Search nappulan jälkeen laukaistaan searchGame funktio joka on storessa
	}

	function triggerClick(gameID) {
		selectGame(gameID);
	}

	// Reaktiivisesti subscribataan gameData muuttuja storesta. Sieltä löytyy searchGame funktion asettama data.
	$: currentGameData = $gameData;
</script>

<main class="flex min-h-screen flex-col items-center justify-center space-y-6 bg-pink-100">
	<h1 class="text-5xl font-extrabold text-purple-600">Game Price Finder</h1>

	<input
		type="text"
		bind:value={localGameName}
		placeholder="Enter game name"
		class="mx-auto mt-4 w-[70%] max-w-lg rounded-lg border-2 border-gray-300 p-3 text-center text-lg font-bold transition-all duration-300 focus:w-[80%] focus:ring-2 focus:ring-purple-500"
	/>

	<button
		on:click={triggerSearch}
		class="mt-4 w-[15%] rounded-lg bg-purple-500 p-3 text-lg font-semibold text-white hover:bg-purple-600 focus:outline-none"
	>
		Search
	</button>

	{#if currentGameData && currentGameData.length > 0}
		<div class="games-list mt-6 flex w-full flex-wrap justify-center gap-6">
			{#each currentGameData as game}
				<!-- Loopataan gameDataa ympäri ja otetaan aina yks peli. game.GameID jne. on apissa nimettyjä. -->
				<div
					class="game-info w-64 cursor-pointer rounded-lg bg-gray-200 p-4 text-center shadow-xl transition-all hover:shadow-2xl hover:ring-4 hover:ring-orange-300"
					on:click={() => triggerClick(game.gameID)}
				>
					<h2 class="text-xl font-bold">{game.external}</h2>
					<img
						src={game.thumb}
						alt={game.external}
						class="game-image mt-2 h-48 w-full rounded-lg object-cover"
					/>
					<h2 class="mt-2 text-lg font-semibold text-purple-500">{game.cheapest}€</h2>
				</div>
			{/each}
		</div>
	{:else if gameData && gameData.length === 0}
		<p class="mt-4 text-center text-xl text-gray-600">No games found for "{gameName}".</p>
	{/if}
</main>
