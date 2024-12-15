export const fetchCharacters = async (startPage, resultsPerPage) => {
    let allResults = [];
    let currentPage = startPage;

    try {
        while (allResults.length < resultsPerPage) {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${currentPage}`);
            const data = await response.json();

            allResults = [...allResults, ...data.results]; 
            if (!data.info.next) break; 
            currentPage++;
        }

        return { results: allResults.slice(0, resultsPerPage) }; 
    } catch (error) {
        throw new Error('Error fetching characters');
    }
};