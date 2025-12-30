console.log('Script loaded');

// Replace with your Solana token address
const TOKEN_ADDRESS = "2TAi8XLzDJ8btNTQp7WtCvhGuMnWzkFddr1PhYf6pump";

function fetchMarketCap() {
    console.log('fetchMarketCap called');
    
    // Create or get market cap container
    let mcContainer = document.getElementById('mc-container');
    if (!mcContainer) {
        mcContainer = document.createElement('div');
        mcContainer.id = 'mc-container';
        mcContainer.style.cssText = `
            position: absolute;
            top: 96%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #000000;
            font-size: 18px;
            font-family: 'Comic Sans MS', 'Comic Sans', cursive;
            font-weight: bold;
            text-align: center;
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
            z-index: 10;
            pointer-events: none;
            white-space: nowrap;
        `;
        const uptekShape = document.querySelector('.uptek-shape');
        if (uptekShape && uptekShape.parentElement) {
            uptekShape.parentElement.style.position = 'relative';
            uptekShape.parentElement.appendChild(mcContainer);
        }
    }
    
    // Try the search endpoint
    fetch(`https://api.dexscreener.com/latest/dex/search?q=${TOKEN_ADDRESS}`)
        .then(response => {
            console.log('Response received:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.pairs && data.pairs.length > 0) {
                const pair = data.pairs[0];
                const marketCap = pair.marketCap;
                
                console.log('Market cap:', marketCap);
                
                // Format market cap as simple text
                const formattedMarketCap = marketCap 
                    ? `$${parseFloat(marketCap).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    : "N/A";
                
                mcContainer.textContent = formattedMarketCap;
                console.log('Updated display:', formattedMarketCap);
            } else {
                mcContainer.textContent = 'No data';
            }
        })
        .catch(error => {
            console.error('Error fetching market cap:', error);
            mcContainer.textContent = 'Error';
        });
}

// Call immediately
setTimeout(fetchMarketCap, 100);

// Refresh market cap every 1 second
setInterval(fetchMarketCap, 1000);
