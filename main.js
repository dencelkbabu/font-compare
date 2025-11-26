import opentype from 'opentype.js';

const state = {
    font1: null,
    font2: null,
    viewMode: 'side-by-side', // 'overlay' or 'side-by-side'
    text: 'The quick brown fox jumps over the lazy dog.',
};

const elements = {
    upload1: document.getElementById('font-upload-1'),
    upload2: document.getElementById('font-upload-2'),
    fileInfo1: document.getElementById('file-info-1'),
    fileInfo2: document.getElementById('file-info-2'),
    metadataDisplay1: document.getElementById('metadata-1'),
    metadataDisplay2: document.getElementById('metadata-2'),
    controls1: document.getElementById('controls-1'),
    controls2: document.getElementById('controls-2'),
    previewContainer: document.getElementById('preview-container'),
    previewLayer1: document.getElementById('preview-layer-1'),
    previewLayer2: document.getElementById('preview-layer-2'),
    toggleViewBtn: document.getElementById('toggle-view-btn'),
};

// Event Listeners
elements.upload1.addEventListener('change', (e) => handleFontUpload(e, 1));
elements.upload2.addEventListener('change', (e) => handleFontUpload(e, 2));

elements.toggleViewBtn.addEventListener('click', () => {
    state.viewMode = state.viewMode === 'overlay' ? 'side-by-side' : 'overlay';
    updateViewMode();
});

// Sync text changes
elements.previewLayer1.addEventListener('input', (e) => {
    state.text = e.target.innerText;
    if (state.text !== elements.previewLayer2.innerText) {
        elements.previewLayer2.innerText = state.text;
    }
});

elements.previewLayer2.addEventListener('input', (e) => {
    state.text = e.target.innerText;
    if (state.text !== elements.previewLayer1.innerText) {
        elements.previewLayer1.innerText = state.text;
    }
});

function updateViewMode() {
    if (state.viewMode === 'side-by-side') {
        elements.previewContainer.classList.remove('overlay-mode');
        elements.previewContainer.classList.add('side-by-side');
        elements.toggleViewBtn.textContent = 'Switch to Overlay';
    } else {
        elements.previewContainer.classList.remove('side-by-side');
        elements.previewContainer.classList.add('overlay-mode');
        elements.toggleViewBtn.textContent = 'Switch to Side-by-Side';
    }
}

async function handleFontUpload(event, id) {
    const file = event.target.files[0];
    if (!file) return;

    // Update UI
    const infoEl = id === 1 ? elements.fileInfo1 : elements.fileInfo2;
    infoEl.textContent = file.name;

    try {
        // 1. Load font with opentype.js for metadata
        const buffer = await file.arrayBuffer();
        const font = opentype.parse(buffer);

        // 2. Create FontFace for rendering
        const fontName = `CustomFont${id}`;
        const fontFace = new FontFace(fontName, buffer);
        await fontFace.load();
        document.fonts.add(fontFace);

        // 3. Update State
        state[`font${id}`] = { font, fontName, axes: {} };

        // 4. Apply to Preview
        const previewEl = id === 1 ? elements.previewLayer1 : elements.previewLayer2;
        previewEl.style.fontFamily = fontName;

        // 5. Render Metadata & Controls
        renderMetadata(font, id);
        renderControls(font, id);

    } catch (err) {
        console.error('Error loading font:', err);
        alert(`Failed to load font: ${err.message}`);
    }
}

function renderMetadata(font, id) {
    const display = id === 1 ? elements.metadataDisplay1 : elements.metadataDisplay2;
    const names = font.names;

    const familyName = names.fontFamily?.en || 'Unknown Family';
    const subFamily = names.fontSubfamily?.en || 'Regular';
    const numGlyphs = font.numGlyphs;
    const outlines = font.outlinesFormat;

    display.innerHTML = `
    <div class="metadata-item"><span>Family:</span> <span>${familyName}</span></div>
    <div class="metadata-item"><span>Style:</span> <span>${subFamily}</span></div>
    <div class="metadata-item"><span>Glyphs:</span> <span>${numGlyphs}</span></div>
    <div class="metadata-item"><span>Format:</span> <span>${outlines}</span></div>
  `;
}

function renderControls(font, id) {
    const container = id === 1 ? elements.controls1 : elements.controls2;
    container.innerHTML = '';

    // Check for variable font axes
    if (font.tables.fvar) {
        const axes = font.tables.fvar.axes;

        axes.forEach(axis => {
            const group = document.createElement('div');
            group.className = 'control-group';

            const label = document.createElement('label');
            const name = axis.name.en || axis.tag;
            label.innerHTML = `<span>${name} (${axis.tag})</span> <span id="val-${id}-${axis.tag}">${axis.defaultValue}</span>`;

            const input = document.createElement('input');
            input.type = 'range';
            input.min = axis.minValue;
            input.max = axis.maxValue;
            input.value = axis.defaultValue;
            input.step = 1; // Can be refined based on axis

            input.addEventListener('input', (e) => {
                const val = e.target.value;
                document.getElementById(`val-${id}-${axis.tag}`).textContent = val;
                updateFontVariation(id, axis.tag, val);
            });

            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });
    } else {
        container.innerHTML = '<div class="metadata-item">No variable axes found.</div>';
    }
}

function updateFontVariation(id, tag, value) {
    const currentFontState = state[`font${id}`];
    if (!currentFontState) return;

    currentFontState.axes[tag] = value;

    // Construct font-variation-settings string
    const settings = Object.entries(currentFontState.axes)
        .map(([t, v]) => `"${t}" ${v}`)
        .join(', ');

    const previewEl = id === 1 ? elements.previewLayer1 : elements.previewLayer2;
    previewEl.style.fontVariationSettings = settings;
}
