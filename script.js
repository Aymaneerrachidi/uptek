console.log('Script loaded');

// Replace with your Solana token address
const TOKEN_ADDRESS = "dvdzpijxyyladzvnsktftarc2k6ckrgbtoxsfwqcjb5c";

// Fast refresh (ms). Adjust if you need faster/slower updates.
const REFRESH_INTERVAL_MS = 250;

let mcContainer = null;
let lastMarketCap = null;
let currentController = null;

function ensureMcContainer() {
    if (mcContainer) return mcContainer;
    mcContainer = document.getElementById('mc-container');
    if (!mcContainer) {
        mcContainer = document.createElement('div');
        mcContainer.id = 'mc-container';
        mcContainer.style.cssText = `
            position: absolute;
            top: 95%;
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
        } else {
            document.body.appendChild(mcContainer);
        }
    }
    return mcContainer;
}

async function fetchMarketCap() {
    ensureMcContainer();

    // Abort any previous pending fetch to avoid overlap
    if (currentController) currentController.abort();
    currentController = new AbortController();
    const signal = currentController.signal;

    try {
        const resp = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${TOKEN_ADDRESS}`, { signal });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            const raw = pair.marketCap ?? pair.market_cap ?? null;
            const mcNum = raw != null ? Number(raw) : NaN;

            if (!isNaN(mcNum)) {
                // Only update DOM when value actually changes to reduce flicker
                if (lastMarketCap === null || lastMarketCap !== mcNum) {
                    lastMarketCap = mcNum;
                    mcContainer.textContent = `$${mcNum.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
                }
            } else {
                mcContainer.textContent = 'N/A';
            }
        } else {
            mcContainer.textContent = 'No data';
        }
    } catch (err) {
        if (err.name === 'AbortError') return; // expected when aborting
        console.error('Error fetching market cap:', err);
        mcContainer.textContent = 'Error';
    }
}

// Start immediately and then poll at the chosen fast interval
fetchMarketCap();
setInterval(fetchMarketCap, REFRESH_INTERVAL_MS);
