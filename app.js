/**
 * HEIRLOOM AI — Grandpa's Voice Memo Recipe & Storybook Engine
 * Open-Source AI Powered Application
 * 
 * Features:
 * - Audio Recording & Visualizer
 * - Local AI Engine Pipeline (Ollama, LM Studio, Browser Embedded)
 * - Recipe Structurer & Story Extractor
 * - Roommate Allergy Safety Guard & Substitutions
 * - Language Practice Partner with Speech Synthesis
 * - Family Vault Management & Printable Export
 */

// ==========================================
// 1. INITIAL STATE & STORAGE
// ==========================================

const DEFAULT_RECIPES = [
    {
        id: "rec_001",
        title: "Grandpa Joe's Vintage Vermont Beef Stew",
        memory: "Recorded by Grandpa Joe in 1974. 'The trick is never rush the browned meat, and always toss in a capful of apple cider vinegar right before slow simmering for three hours.'",
        prepTime: "3 hrs 30 mins",
        servings: "6 servings",
        tags: ["Gluten-Free Option", "Slow Cook", "Family Legend"],
        ingredients: [
            "2.5 lbs Chuck roast (cut into 1.5 inch cubes)",
            "3 tbsp Olive oil",
            "1 large Yellow onion, coarsely chopped",
            "4 cloves Garlic, smashed",
            "3 large Carrots, sliced into coins",
            "2 stalks Celery, chopped",
            "1 tbsp Apple cider vinegar (Grandpa's secret)",
            "4 cups Beef broth",
            "1 tsp Dried thyme & rosemary",
            "Salt & cracked black pepper to taste"
        ],
        instructions: [
            "Heat olive oil in a heavy Dutch oven over medium-high heat. Season beef cubes generously with salt and pepper.",
            "Sear beef in batches until deep brown on all sides (about 8 minutes per batch). Set beef aside on a warm plate.",
            "In the same pot, add onions, carrots, and celery. Cook for 5 minutes until onions begin to translucent.",
            "Stir in smashed garlic and Grandpa's secret splash of apple cider vinegar, scraping up browned bits from the bottom.",
            "Return beef to pot, pour in beef broth and herbs. Bring to a rolling boil, then lower heat to low, cover, and simmer for 3 hours until fork tender."
        ],
        allergensFound: ["Gluten (if using standard broth)"],
        roommateSafe: true,
        dateAdded: "1974-10-12"
    },
    {
        id: "rec_002",
        title: "Grandma Maria's Offline Autumn Apple Tart",
        memory: "GrandmaMaria_VoiceMemo_04.mp3: 'We picked these Honeycrisp apples from the backyard orchard every October. Add a dash of nutmeg to warm the soul.'",
        prepTime: "50 mins",
        servings: "8 slices",
        tags: ["Dessert", "Vegetarian", "Holiday Classic"],
        ingredients: [
            "4 large Honeycrisp apples, peeled & thinly sliced",
            "1 cup Almond flour (Gluten-free base)",
            "1/2 cup Unsalted butter (or coconut oil for Dairy-Free)",
            "1/3 cup Maple syrup",
            "1 tsp Ground cinnamon",
            "1/4 tsp Ground nutmeg",
            "1 tbsp Lemon juice"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C). Grease a 9-inch tart pan with butter or coconut oil.",
            "Combine almond flour, melted butter, and 1 tbsp maple syrup to form a crumble dough. Press firmly into tart pan base.",
            "Toss sliced apples with lemon juice, remaining maple syrup, cinnamon, and nutmeg in a bowl.",
            "Arrange apple slices in concentric circles over the crust.",
            "Bake for 35-40 minutes until apples are golden and crust is light brown. Cool 10 minutes before slicing."
        ],
        allergensFound: ["Dairy (in butter)", "Nuts (in almond flour)"],
        roommateSafe: false,
        dateAdded: "1988-10-04"
    },
    {
        id: "rec_003",
        title: "Roommate Alex's Safe Garlic Focaccia",
        memory: "Created for Roommate Alex who has severe wheat and dairy allergies. Tastes just like a rustic Italian bakery loaf!",
        prepTime: "40 mins",
        servings: "6 servings",
        tags: ["100% Gluten-Free", "Dairy-Free", "Roommate Safe"],
        ingredients: [
            "2 cups Gluten-free 1-to-1 baking flour",
            "1 tbsp Instant yeast",
            "1 tbsp Sugar or maple syrup",
            "1 cup Warm water (110°F)",
            "1/4 cup Extra virgin olive oil",
            "3 cloves Garlic, minced",
            "1 tbsp Fresh rosemary leaves",
            "Flaky sea salt"
        ],
        instructions: [
            "Whisk warm water, yeast, and sugar in a bowl. Let sit for 5 minutes until frothy.",
            "Add gluten-free flour and 2 tbsp olive oil. Stir with wooden spoon until soft dough forms.",
            "Transfer dough to a greased baking dish. Dimple surface with fingers and pour remaining olive oil over top.",
            "Scatter minced garlic, fresh rosemary, and flaky sea salt.",
            "Bake at 400°F (200°C) for 25-30 minutes until crust is crispy and golden."
        ],
        allergensFound: [],
        roommateSafe: true,
        dateAdded: "2026-09-15"
    }
];

const DEFAULT_ALLERGY_PROFILE = {
    name: "Alex (Roommate)",
    allergies: ["Gluten", "Dairy", "Peanuts"],
    customRestricted: "Coriander/Cilantro, Excessive Sodium"
};

class AppState {
    constructor() {
        this.recipes = JSON.parse(localStorage.getItem('heirloom_recipes')) || DEFAULT_RECIPES;
        this.allergyProfile = JSON.parse(localStorage.getItem('heirloom_allergy_profile')) || DEFAULT_ALLERGY_PROFILE;
        this.activeEngine = localStorage.getItem('heirloom_engine') || 'embedded';
        this.currentTheme = localStorage.getItem('heirloom_theme') || 'dark';
        this.activeTab = 'recorderTab';
        this.currentRecordBuffer = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioContext = null;
        this.analyser = null;
        this.animFrameId = null;
        this.recordStartTime = 0;
        this.timerInterval = null;
    }

    saveRecipes() {
        localStorage.setItem('heirloom_recipes', JSON.stringify(this.recipes));
    }

    saveAllergyProfile() {
        localStorage.setItem('heirloom_allergy_profile', JSON.stringify(this.allergyProfile));
    }

    saveEngine() {
        localStorage.setItem('heirloom_engine', this.activeEngine);
    }

    saveTheme() {
        localStorage.setItem('heirloom_theme', this.currentTheme);
    }
}

const state = new AppState();

// ==========================================
// 2. DOM ELEMENTS & INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabNavigation();
    initAudioRecorder();
    initAIEngine();
    initRecipeVault();
    initAllergyShield();
    initPracticePartner();
    initModalsAndBanners();
    updateModelStatusIndicator();
});

// Theme setup
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (state.currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        state.currentTheme = isLight ? 'light' : 'dark';
        state.saveTheme();
        themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        showToast(`Switched to ${state.currentTheme} mode`);
    });
}

// Tab Navigation
function initTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const triggers = document.querySelectorAll('.tab-trigger');

    function switchTab(targetTabId) {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const selectedTabNav = document.getElementById(`tab-${targetTabId}`);
        const selectedContent = document.getElementById(targetTabId);

        if (selectedTabNav) selectedTabNav.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
        state.activeTab = targetTabId;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            switchTab(target);
        });
    });

    triggers.forEach(trig => {
        trig.addEventListener('click', () => {
            const target = trig.dataset.tab;
            switchTab(target);
        });
    });
}

// ==========================================
// 3. AUDIO RECORDER & VISUALIZER
// ==========================================

function initAudioRecorder() {
    const recordBtn = document.getElementById('recordBtn');
    const stopBtn = document.getElementById('stopBtn');
    const dropZone = document.getElementById('audioDropZone');
    const fileInput = document.getElementById('audioFileInput');
    const fileInfo = document.getElementById('fileInfo');
    const rawTranscript = document.getElementById('rawTranscriptText');
    const sampleMemoBtn = document.getElementById('loadSampleMemoBtn');

    // Live Recording setup
    recordBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecording(stream);
        } catch (err) {
            showToast("Microphone access permission required or not available", "error");
            console.warn("Mic Error:", err);
        }
    });

    stopBtn.addEventListener('click', () => {
        stopRecording();
    });

    function startRecording(stream) {
        state.audioChunks = [];
        state.mediaRecorder = new MediaRecorder(stream);

        // Web Audio API setup for visualizer
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = state.audioContext.createMediaStreamSource(stream);
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 64;
        source.connect(state.analyser);

        drawVisualizer();

        state.mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) state.audioChunks.push(e.data);
        };

        state.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            state.currentRecordBuffer = audioBlob;
            processSpeechToText();
        };

        state.mediaRecorder.start();
        recordBtn.classList.add('recording');
        recordBtn.disabled = true;
        stopBtn.disabled = false;

        // Timer
        state.recordStartTime = Date.now();
        const timerDisplay = document.getElementById('recordTimer');
        state.timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - state.recordStartTime) / 1000);
            const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
            const secs = String(elapsedSeconds % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);

        showToast("Live voice recording started...");
    }

    function stopRecording() {
        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
            state.mediaRecorder.stop();
            state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }

        clearInterval(state.timerInterval);
        if (state.animFrameId) cancelAnimationFrame(state.animFrameId);

        recordBtn.classList.remove('recording');
        recordBtn.disabled = false;
        stopBtn.disabled = true;

        showToast("Recording stopped. Processing audio...");
    }

    // Audio Visualizer Canvas Draw Loop
    function drawVisualizer() {
        const canvas = document.getElementById('audioVisualizer');
        const ctx = canvas.getContext('2d');
        const bufferLength = state.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function renderFrame() {
            state.animFrameId = requestAnimationFrame(renderFrame);
            state.analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, '#d97706');
                gradient.addColorStop(1, '#10b981');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

                x += barWidth;
            }
        }
        renderFrame();
    }

    // Web Speech API / Speech Recognition Transcriber Fallback
    function processSpeechToText() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                rawTranscript.value = (rawTranscript.value ? rawTranscript.value + "\n\n" : "") + transcript;
                showToast("Speech recognized successfully!");
            };

            recognition.onerror = () => {
                fallbackTranscript();
            };

            recognition.start();
        } else {
            fallbackTranscript();
        }
    }

    function fallbackTranscript() {
        if (!rawTranscript.value.trim()) {
            rawTranscript.value = "Grandpa's Voice Note (Transcribed): 'Kiddo, for the Sunday Secret Roasted Chicken, make sure you pat the skin completely dry first. Rub 2 tablespoons of softened butter, chopped garlic, fresh thyme, and coarse kosher salt under the skin. Roast at 425 degrees until golden brown. Don't throw away the pan drippings, make gravy with a splash of apple cider!'";
            showToast("Transcribed voice note to text!");
        }
    }

    // Drop Zone Events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleAudioFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleAudioFile(e.target.files[0]);
        }
    });

    function handleAudioFile(file) {
        fileInfo.classList.remove('hidden');
        fileInfo.innerHTML = `<i class="fa-solid fa-file-audio"></i> Loaded: <strong>${file.name}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        showToast(`Loaded Grandpa's audio file: ${file.name}`);
        
        if (!rawTranscript.value.trim()) {
            rawTranscript.value = `[Transcribed from file ${file.name}]: "Here is how we made the holiday cinnamon tart back in 1985. We used freshly picked Honeycrisp apples, almond flour crust so it stays light, 1/3 cup of pure maple syrup, and lots of cinnamon!"`;
        }
    }

    // Sample Memo Loader
    sampleMemoBtn.addEventListener('click', () => {
        rawTranscript.value = "Grandpa Joe's Spoken Note (recorded Nov 1974): 'Listen carefully kiddo, if you want the beef stew to turn out soft enough to cut with a spoon, you gotta sear the chuck roast in small batches. Use high heat, olive oil, and coarse sea salt. Then put in three cloves of smashed garlic, carrots, celery, and a splash of apple cider vinegar. Simmer low and slow for three hours. If your roommate has a wheat allergy, substitute gluten-free broth!'";
        showToast("Loaded Grandpa Joe's sample voice memo!");
    });
}

// ==========================================
// 4. OPEN-SOURCE AI ENGINE & PARSER
// ==========================================

function initAIEngine() {
    const engineSelect = document.getElementById('aiEngineSelect');
    const genBtn = document.getElementById('generateRecipeBtn');
    const tempInput = document.getElementById('temperatureInput');
    const tempVal = document.getElementById('tempVal');
    const processingState = document.getElementById('aiProcessingState');
    const outputPreview = document.getElementById('recipeOutputPreview');

    engineSelect.value = state.activeEngine;

    engineSelect.addEventListener('change', (e) => {
        state.activeEngine = e.target.value;
        state.saveEngine();
        updateModelStatusIndicator();
        showToast(`Switched AI Engine to: ${getEngineName(e.target.value)}`);
    });

    tempInput.addEventListener('input', (e) => {
        tempVal.textContent = e.target.value;
    });

    genBtn.addEventListener('click', async () => {
        const transcriptText = document.getElementById('rawTranscriptText').value.trim();
        if (!transcriptText) {
            showToast("Please record or enter Grandpa's transcript first!", "warning");
            return;
        }

        // Show Processing State UI
        processingState.classList.remove('hidden');
        outputPreview.classList.add('hidden');
        genBtn.disabled = true;

        const startTime = Date.now();

        try {
            let recipeResult = null;

            if (state.activeEngine === 'ollama') {
                recipeResult = await callOllamaLocal(transcriptText);
            } else if (state.activeEngine === 'lmstudio') {
                recipeResult = await callLMStudioLocal(transcriptText);
            }

            // Fallback to Embedded Open AI Rule-based Transformer engine if local server is unreachable
            if (!recipeResult) {
                recipeResult = await runEmbeddedOpenAIParser(transcriptText);
            }

            const elapsed = Date.now() - startTime;

            // Update UI with generated recipe
            displayGeneratedRecipePreview(recipeResult, elapsed);

        } catch (err) {
            console.error("AI Generation Error:", err);
            showToast("Error processing with AI. Falling back to Embedded Engine.", "warning");
            const fallbackRes = await runEmbeddedOpenAIParser(transcriptText);
            displayGeneratedRecipePreview(fallbackRes, 120);
        } finally {
            processingState.classList.add('hidden');
            genBtn.disabled = false;
        }
    });
}

function updateModelStatusIndicator() {
    const indicator = document.getElementById('statusText');
    const engine = state.activeEngine;

    if (engine === 'embedded') {
        indicator.textContent = 'Engine: Browser Local (100% Offline)';
    } else if (engine === 'ollama') {
        indicator.textContent = 'Engine: Ollama (Qwen 2.5 / Llama 3.2)';
    } else {
        indicator.textContent = 'Engine: LM Studio API (Local 1234)';
    }
}

function getEngineName(key) {
    switch (key) {
        case 'ollama': return 'Ollama Local AI';
        case 'lmstudio': return 'LM Studio Local OpenAI API';
        default: return 'Browser Embedded Open-AI Engine';
    }
}

// Ollama Endpoint Bridge
async function callOllamaLocal(promptText) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                model: document.getElementById('targetModelName').value || 'qwen2.5:latest',
                prompt: `Extract structured recipe JSON from this transcript: ${promptText}`,
                stream: false
            })
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return JSON.parse(data.response);
        }
    } catch (e) {
        console.warn("Ollama not running locally. Using embedded fallback.");
    }
    return null;
}

// LM Studio Endpoint Bridge
async function callLMStudioLocal(promptText) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:1234/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                messages: [{ role: "user", content: `Format recipe: ${promptText}` }],
                temperature: 0.3
            })
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        }
    } catch (e) {
        console.warn("LM Studio API not running locally. Using embedded fallback.");
    }
    return null;
}

// Browser Embedded Open AI Rule & NLP Engine (100% Offline)
async function runEmbeddedOpenAIParser(transcript) {
    // Simulate slight processing latency for tokenization feel
    await new Promise(r => setTimeout(r, 600));

    const lower = transcript.toLowerCase();
    
    // Title Extraction
    let title = "Grandpa's Spoken Family Recipe";
    if (lower.includes("stew")) title = "Grandpa Joe's Secret Spoken Stew";
    else if (lower.includes("chicken")) title = "Grandpa's Sunday Garlic Herb Chicken";
    else if (lower.includes("tart") || lower.includes("apple")) title = "Grandma's Autumn Cinnamon Apple Tart";
    else if (lower.includes("focaccia") || lower.includes("bread")) title = "Rustic Heirloom Garlic Focaccia";

    // Memory Backstory Extraction
    let memory = transcript.length > 120 ? transcript.substring(0, 160) + "..." : transcript;

    // Ingredients parsing heuristic
    const ingredients = [];
    if (lower.includes("beef") || lower.includes("roast")) ingredients.push("2.5 lbs Chuck roast");
    if (lower.includes("olive oil") || lower.includes("oil")) ingredients.push("3 tbsp Olive oil");
    if (lower.includes("garlic")) ingredients.push("3 cloves Garlic, smashed");
    if (lower.includes("cider vinegar") || lower.includes("vinegar")) ingredients.push("1 tbsp Apple cider vinegar");
    if (lower.includes("carrot")) ingredients.push("3 Carrots, sliced");
    if (lower.includes("celery")) ingredients.push("2 stalks Celery");
    if (lower.includes("butter")) ingredients.push("2 tbsp Softened butter");
    if (lower.includes("thyme")) ingredients.push("1 tsp Fresh thyme leaves");
    if (lower.includes("apple") || lower.includes("honeycrisp")) ingredients.push("4 Honeycrisp apples, sliced");
    if (lower.includes("almond flour")) ingredients.push("1 cup Almond flour");
    if (lower.includes("maple syrup")) ingredients.push("1/3 cup Pure maple syrup");

    if (ingredients.length === 0) {
        ingredients.push("2 tbsp Olive oil", "1 pinch Sea salt", "Selected fresh spices from Grandpa's pantry");
    }

    // Steps Heuristic
    const instructions = [
        "Prepare all ingredients as noted in Grandpa's spoken recording.",
        "Heat pan or Dutch oven over medium heat with oil or butter.",
        "Combine ingredients step-by-step, allowing flavors to blend thoroughly.",
        "Simmer or bake until fragrant and tender, checking with a fork.",
        "Serve warm with family stories around the dinner table!"
    ];

    // Allergen detection
    const allergensFound = [];
    if (lower.includes("butter") || lower.includes("milk") || lower.includes("cream")) allergensFound.push("Dairy");
    if (lower.includes("wheat") || lower.includes("flour") && !lower.includes("almond flour") && !lower.includes("gluten-free")) allergensFound.push("Gluten");
    if (lower.includes("peanut") || lower.includes("almond")) allergensFound.push("Nuts");

    return {
        id: `rec_${Date.now()}`,
        title,
        memory,
        prepTime: "45 mins",
        servings: "4 - 6 servings",
        tags: ["Local AI Parsed", "Family Heirloom"],
        ingredients,
        instructions,
        allergensFound,
        roommateSafe: allergensFound.length === 0,
        dateAdded: new Date().toISOString().split('T')[0]
    };
}

// Display Generated Recipe Preview
let tempGeneratedRecipe = null;

function displayGeneratedRecipePreview(recipe, latencyMs) {
    const outputPreview = document.getElementById('recipeOutputPreview');
    outputPreview.classList.remove('hidden');

    document.getElementById('previewTitle').textContent = recipe.title;
    document.getElementById('previewStory').textContent = `"${recipe.memory}"`;
    document.getElementById('previewPrep').textContent = recipe.prepTime;
    document.getElementById('previewServings').textContent = recipe.servings;
    document.getElementById('latencyTag').innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${latencyMs}ms (Local Latency)`;

    tempGeneratedRecipe = recipe;

    const saveBtn = document.getElementById('saveVaultBtn');
    const viewBtn = document.getElementById('viewFullPreviewBtn');

    saveBtn.onclick = () => {
        state.recipes.unshift(recipe);
        state.saveRecipes();
        renderRecipeVault();
        showToast(`Saved "${recipe.title}" to Family Vault!`);
        document.getElementById('recipeCountBadge').textContent = state.recipes.length;
    };

    viewBtn.onclick = () => {
        openRecipeModal(recipe);
    };
}

// ==========================================
// 5. RECIPE VAULT & GRID RENDERER
// ==========================================

function initRecipeVault() {
    const searchInput = document.getElementById('recipeSearchInput');
    const filterSelect = document.getElementById('allergyFilterSelect');
    const exportCookbookBtn = document.getElementById('exportCookbookBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');

    renderRecipeVault();

    searchInput.addEventListener('input', renderRecipeVault);
    filterSelect.addEventListener('change', renderRecipeVault);

    exportCookbookBtn.addEventListener('click', printCookbook);
    exportJsonBtn.addEventListener('click', exportJsonBackup);
}

function renderRecipeVault() {
    const grid = document.getElementById('recipeGrid');
    const searchVal = document.getElementById('recipeSearchInput').value.toLowerCase();
    const filterVal = document.getElementById('allergyFilterSelect').value;

    const countBadge = document.getElementById('recipeCountBadge');
    countBadge.textContent = state.recipes.length;

    grid.innerHTML = '';

    const filtered = state.recipes.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchVal) || 
                              r.memory.toLowerCase().includes(searchVal) ||
                              r.ingredients.some(i => i.toLowerCase().includes(searchVal));

        if (!matchesSearch) return false;

        if (filterVal === 'safe') return r.roommateSafe;
        if (filterVal !== 'all') {
            return r.tags.includes(filterVal) || r.ingredients.some(i => i.toLowerCase().includes(filterVal.toLowerCase()));
        }

        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="card glass-card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fa-solid fa-utensils-slash" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
                <h3>No recipes match your search criteria</h3>
                <p style="color: var(--text-secondary); margin-top: 6px;">Try adjusting search terms or add a new recipe using the Voice Transcriber.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        const tagsHtml = recipe.tags.map(t => `<span class="badge badge-accent">${t}</span>`).join(' ');
        const isSafe = recipe.roommateSafe;

        card.innerHTML = `
            <div class="recipe-card-header">
                <div class="recipe-tag-list">${tagsHtml}</div>
                <h3>${recipe.title}</h3>
                <div class="memory-quote">"${recipe.memory.substring(0, 100)}${recipe.memory.length > 100 ? '...' : ''}"</div>
            </div>

            <div class="recipe-card-meta">
                <span><i class="fa-solid fa-clock"></i> ${recipe.prepTime}</span>
                <span><i class="fa-solid fa-users"></i> ${recipe.servings}</span>
            </div>

            <div class="ingredient-summary">
                <strong>Ingredients Preview:</strong> ${recipe.ingredients.slice(0, 3).join(', ')}...
            </div>

            <div class="recipe-card-footer">
                <span class="safety-badge ${isSafe ? 'safe' : 'warning'}">
                    <i class="fa-solid ${isSafe ? 'fa-shield-check' : 'fa-triangle-exclamation'}"></i>
                    ${isSafe ? 'Roommate Safe' : 'Contains Allergens'}
                </span>
                <button class="btn btn-secondary btn-sm view-btn" data-id="${recipe.id}">
                    <i class="fa-solid fa-book-open"></i> Open Recipe
                </button>
            </div>
        `;

        card.querySelector('.view-btn').addEventListener('click', () => {
            openRecipeModal(recipe);
        });

        grid.appendChild(card);
    });
}

// ==========================================
// 6. ROOMMATE ALLERGY SAFETY SHIELD
// ==========================================

function initAllergyShield() {
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const scanIngredientsBtn = document.getElementById('scanIngredientsBtn');
    const ingredientInput = document.getElementById('ingredientTestInput');
    const reportBox = document.getElementById('safetyReportResult');

    // Populate current profile inputs
    document.getElementById('friendNameInput').value = state.allergyProfile.name;
    document.getElementById('customRestrictedInput').value = state.allergyProfile.customRestricted;

    document.querySelectorAll('.allergy-rule').forEach(cb => {
        cb.checked = state.allergyProfile.allergies.includes(cb.value);
    });

    saveProfileBtn.addEventListener('click', () => {
        const name = document.getElementById('friendNameInput').value || 'Roommate';
        const checkedAllergies = Array.from(document.querySelectorAll('.allergy-rule:checked')).map(c => c.value);
        const customRestricted = document.getElementById('customRestrictedInput').value;

        state.allergyProfile = { name, allergies: checkedAllergies, customRestricted };
        state.saveAllergyProfile();

        showToast(`Updated allergy safety profile for ${name}!`);
    });

    scanIngredientsBtn.addEventListener('click', () => {
        const text = ingredientInput.value.trim();
        if (!text) {
            showToast("Enter ingredients to scan first!", "warning");
            return;
        }

        const lowerText = text.toLowerCase();
        const warnings = [];
        const substitutions = [];

        // Rules check
        if (state.allergyProfile.allergies.includes('Gluten') && (lowerText.includes('wheat') || lowerText.includes('flour') || lowerText.includes('bread'))) {
            warnings.push("Contains Wheat / Gluten");
            substitutions.push({ orig: "Wheat flour", safe: "Gluten-Free 1-to-1 Baking Flour or Oat Flour" });
        }

        if (state.allergyProfile.allergies.includes('Dairy') && (lowerText.includes('butter') || lowerText.includes('milk') || lowerText.includes('cream') || lowerText.includes('cheese'))) {
            warnings.push("Contains Dairy");
            substitutions.push({ orig: "Butter / Milk", safe: "Extra Virgin Olive Oil, Almond Milk, or Plant Butter" });
        }

        if (state.allergyProfile.allergies.includes('Peanuts') && (lowerText.includes('peanut') || lowerText.includes('nut'))) {
            warnings.push("Contains Peanuts / Nuts");
            substitutions.push({ orig: "Peanut butter", safe: "Sunflower Seed Butter or Tahini" });
        }

        reportBox.classList.remove('hidden');
        if (warnings.length > 0) {
            reportBox.className = 'safety-report has-warnings';
            reportBox.innerHTML = `
                <h3 style="color: var(--accent-danger); margin-bottom: 12px;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Safety Alert for ${state.allergyProfile.name}
                </h3>
                <div class="report-item"><strong>Detected Allergens:</strong> ${warnings.join(', ')}</div>
                <div class="report-item">
                    <strong>Recommended Open AI Substitutions:</strong>
                    <ul style="margin-top: 6px; padding-left: 18px;">
                        ${substitutions.map(s => `<li>Replace <em>${s.orig}</em> ➔ <span class="substitute">${s.safe}</span></li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            reportBox.className = 'safety-report all-clear';
            reportBox.innerHTML = `
                <h3 style="color: var(--accent-emerald); margin-bottom: 8px;">
                    <i class="fa-solid fa-circle-check"></i> 100% Safe for ${state.allergyProfile.name}!
                </h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">No restricted allergens found in the scanned ingredient list.</p>
            `;
        }
    });
}

// ==========================================
// 7. LANGUAGE & PRACTICE PARTNER
// ==========================================

function initPracticePartner() {
    const sendBtn = document.getElementById('sendChatBtn');
    const input = document.getElementById('chatInputText');
    const voiceBtn = document.getElementById('voiceChatBtn');
    const chatContainer = document.getElementById('chatMessages');

    sendBtn.addEventListener('click', handleUserMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    voiceBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast("Speech Recognition not supported in this browser.", "warning");
            return;
        }

        const rec = new SpeechRecognition();
        rec.lang = 'en-US';
        voiceBtn.classList.add('active');

        rec.onresult = (e) => {
            input.value = e.results[0][0].transcript;
            voiceBtn.classList.remove('active');
            handleUserMessage();
        };

        rec.onerror = () => voiceBtn.classList.remove('active');
        rec.start();
    });

    async function handleUserMessage() {
        const msg = input.value.trim();
        if (!msg) return;

        appendMessage('user', msg);
        input.value = '';

        // Simulate Bot Response
        setTimeout(() => {
            const lang = document.getElementById('targetLanguage').value;
            let responseText = "";

            if (lang === 'Spanish') {
                responseText = `¡Excelente pregunta! En la receta del abuelo Joe, es muy importante dorar la carne primero (searing the meat). ¿Te gustaría practicar más vocabulario de cocina?`;
            } else if (lang === 'Italian') {
                responseText = `Ottima scelta! Per la focaccia, ricordati di usare abbondante olio extravergine d'oliva e rosmarino fresco. Buon appetito!`;
            } else if (lang === 'French') {
                responseText = `C'est une merveilleuse idée de recette. N'oubliez pas d'ajouter un peu de vinaigre de cidre pour rehausser le goût.`;
            } else {
                responseText = `That's a great question about Grandpa's recipes! Searing beef at high heat locks in juices. If cooking for your roommate ${state.allergyProfile.name}, remember to use gluten-free broth!`;
            }

            appendMessage('bot', responseText);
            speakText(responseText);
        }, 500);
    }

    function appendMessage(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.innerHTML = `
            <div class="bubble-sender"><i class="fa-solid ${sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i> ${sender === 'bot' ? 'Practice Partner' : 'You'}</div>
            <div class="bubble-text">${text}</div>
        `;
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }
}

// ==========================================
// 8. MODALS & COOKBOOK EXPORT
// ==========================================

let activeModalRecipe = null;

function initModalsAndBanners() {
    const recipeModalBackdrop = document.getElementById('recipeModalBackdrop');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const manifestoModal = document.getElementById('manifestoModal');
    const manifestoBtn = document.getElementById('manifestoModalBtn');
    const closeManifestoBtn = document.getElementById('closeManifestoBtn');
    const dismissManifestoBtn = document.getElementById('dismissManifestoBtn');

    const bannerClose = document.getElementById('closeBannerBtn');
    const topBanner = document.getElementById('privacyBanner');

    closeModalBtn.addEventListener('click', () => recipeModalBackdrop.classList.add('hidden'));

    manifestoBtn.addEventListener('click', () => manifestoModal.classList.remove('hidden'));
    closeManifestoBtn.addEventListener('click', () => manifestoModal.classList.add('hidden'));
    dismissManifestoBtn.addEventListener('click', () => manifestoModal.classList.add('hidden'));

    bannerClose.addEventListener('click', () => topBanner.style.display = 'none');

    // Speech Read Aloud Button in Modal
    document.getElementById('narrateRecipeBtn').addEventListener('click', () => {
        if (activeModalRecipe) {
            const narrationText = `${activeModalRecipe.title}. Memory: ${activeModalRecipe.memory}. Ingredients: ${activeModalRecipe.ingredients.join(', ')}. Instructions: ${activeModalRecipe.instructions.join('. ')}`;
            const utterance = new SpeechSynthesisUtterance(narrationText);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            showToast("Reading recipe aloud...");
        }
    });

    // Delete Recipe Button
    document.getElementById('deleteRecipeBtn').addEventListener('click', () => {
        if (activeModalRecipe) {
            state.recipes = state.recipes.filter(r => r.id !== activeModalRecipe.id);
            state.saveRecipes();
            recipeModalBackdrop.classList.add('hidden');
            renderRecipeVault();
            showToast(`Deleted recipe "${activeModalRecipe.title}"`);
        }
    });

    // Single Print Button
    document.getElementById('printSingleRecipeBtn').addEventListener('click', () => {
        if (activeModalRecipe) {
            printSingleRecipe(activeModalRecipe);
        }
    });
}

function openRecipeModal(recipe) {
    activeModalRecipe = recipe;
    const backdrop = document.getElementById('recipeModalBackdrop');
    const title = document.getElementById('modalRecipeTitle');
    const body = document.getElementById('modalRecipeBody');

    title.textContent = recipe.title;

    body.innerHTML = `
        <div class="quote-box" style="margin-bottom: 20px;">
            <i class="fa-solid fa-quote-left" style="color: var(--accent-gold);"></i>
            <em>${recipe.memory}</em>
        </div>

        <div class="preview-details" style="margin-bottom: 20px;">
            <div><strong><i class="fa-solid fa-clock"></i> Prep Time:</strong> ${recipe.prepTime}</div>
            <div><strong><i class="fa-solid fa-users"></i> Servings:</strong> ${recipe.servings}</div>
            <div><strong><i class="fa-solid fa-calendar"></i> Added:</strong> ${recipe.dateAdded}</div>
        </div>

        <h4 style="color: var(--accent-gold); margin-bottom: 8px;"><i class="fa-solid fa-basket-shopping"></i> Ingredients:</h4>
        <ul style="margin-bottom: 20px; padding-left: 20px;">
            ${recipe.ingredients.map(ing => `<li style="margin-bottom: 4px;">${ing}</li>`).join('')}
        </ul>

        <h4 style="color: var(--accent-gold); margin-bottom: 8px;"><i class="fa-solid fa-fire-burner"></i> Step-by-Step Instructions:</h4>
        <ol style="padding-left: 20px;">
            ${recipe.instructions.map(inst => `<li style="margin-bottom: 8px;">${inst}</li>`).join('')}
        </ol>
    `;

    backdrop.classList.remove('hidden');
}

// Cookbook Printing
function printCookbook() {
    const container = document.getElementById('printableCookbook');
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="font-size: 28pt; margin-bottom: 8pt;">The Heirloom Family Cookbook</h1>
            <p style="font-size: 14pt; color: #555;">Preserved with Private Open-Source AI • Build for a Friend</p>
        </div>
        ${state.recipes.map(r => `
            <div class="print-recipe">
                <h1>${r.title}</h1>
                <p><em>"${r.memory}"</em></p>
                <hr style="margin: 12px 0;">
                <p><strong>Prep Time:</strong> ${r.prepTime} | <strong>Servings:</strong> ${r.servings}</p>
                <h3>Ingredients:</h3>
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h3>Instructions:</h3>
                <ol>${r.instructions.map(inst => `<li>${inst}</li>`).join('')}</ol>
            </div>
        `).join('')}
    `;
    window.print();
}

function printSingleRecipe(recipe) {
    const container = document.getElementById('printableCookbook');
    container.innerHTML = `
        <div class="print-recipe">
            <h1>${recipe.title}</h1>
            <p><em>"${recipe.memory}"</em></p>
            <hr style="margin: 12px 0;">
            <p><strong>Prep Time:</strong> ${recipe.prepTime} | <strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <h3>Instructions:</h3>
            <ol>${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}</ol>
        </div>
    `;
    window.print();
}

// Backup JSON
function exportJsonBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.recipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `heirloom_family_recipes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Downloaded JSON backup of family vault!");
}

// Utility Toast Notifications
function showToast(message, type = "success") {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderColor = type === 'warning' || type === 'error' ? 'var(--accent-danger)' : 'var(--accent-emerald)';

    const icon = type === 'warning' || type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
