import { writable, get } from 'svelte/store';
import { goto } from '$app/navigation';

// Storet
export const gameName = writable('');
export const gameData = writable(null);
export const error = writable(null);
export const selectedGame = writable(null);
export const storeLogos = writable({});

// Haetaan storejen logot. tehty kokonaan chatGPT:llä.
export async function fetchStoreLogos() {
	if (Object.keys(get(storeLogos)).length === 0) {
		try {
			const res = await fetch(`https://www.cheapshark.com/api/1.0/stores`);
			const stores = await res.json();

			if (res.ok) {
				const logos = stores.reduce((acc, store) => {
					acc[store.storeID] = `https://www.cheapshark.com${store.images.logo}`; // Store logo URL by storeID
					return acc;
				}, {});
				storeLogos.set(logos); // Update the storeLogos store with the fetched logos
			} else {
				throw new Error('Error fetching store logos');
			}
		} catch (err) {
			console.error('Error:', err.message);
		}
	}
}

//SearchGame funktio joka etsii pelit kun ekassa ruudussa painetaan search
export async function searchGame() {
	const currentGameName = get(gameName).trim();
	//haetaan gameName joka setattiin triggerSearch funktiossa
	if (!currentGameName) return;

	try {
		const res = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${currentGameName}`); //käytetään pelin nimeä API haussa
		const data = await res.json();

		if (res.ok) {
			gameData.set(data); //setataan haettu data gameData storeen.
		} else {
			throw new Error(data.error || 'Error fetching game data');
		}
	} catch (err) {
		error.set(err.message);
	}
}

export async function selectGame(gameID) {
	try {
		const res = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`); //haetaan gameID perusteella tietyn pelin tiedot
		const data = await res.json();

		if (res.ok) {
			const selected = Array.isArray(data) ? data[0] : data; // jos data on taulukko sen ensimmäinen alkio asetetan selectediksi, muuten koko data.
			selectedGame.set(selected); //setataan valituksi peliksi
		} else {
			throw new Error('Error fetching game details');
		}
	} catch (err) {
		err.message;
	}
	goto(`/gameselect/${gameID}`);
}
