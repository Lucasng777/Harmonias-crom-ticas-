import chroma from 'chroma-js';

class ColorPlayground {
    constructor() {
        this.baseColorInput = document.getElementById('baseColor');
        this.harmonyTypeSelect = document.getElementById('harmonyType');
        this.generatedPalette = document.querySelector('.generated-palette');
        this.previewContainer = document.querySelector('.preview-container');

        this.setupEventListeners();
        this.updateColors();
    }

    setupEventListeners() {
        this.baseColorInput.addEventListener('input', () => this.updateColors());
        this.harmonyTypeSelect.addEventListener('change', () => this.updateColors());

        // Add hover animation to palette colors
        this.generatedPalette.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('palette-color')) {
                const colors = Array.from(this.generatedPalette.children);
                const index = colors.indexOf(e.target);
                colors.forEach((color, i) => {
                    color.style.transform = `rotate(${(i - index) * 5}deg) scale(${i === index ? 1.1 : 0.95})`;
                });
            }
        });

        this.generatedPalette.addEventListener('mouseout', () => {
            const colors = Array.from(this.generatedPalette.children);
            colors.forEach(color => {
                color.style.transform = '';
            });
        });

        // Add copy feedback
        this.generatedPalette.addEventListener('click', (e) => {
            if (e.target.classList.contains('palette-color')) {
                const color = e.target.dataset.color;
                navigator.clipboard.writeText(color);
                
                const feedback = document.createElement('div');
                feedback.textContent = 'Copiado!';
                feedback.className = 'copy-feedback';
                e.target.appendChild(feedback);
                
                setTimeout(() => feedback.remove(), 1000);
            }
        });
    }

    generateHarmony(baseColor) {
        const type = this.harmonyTypeSelect.value;
        const base = chroma(baseColor);
        
        switch(type) {
            case 'monochromatic':
                return [
                    base.brighten(2),
                    base.brighten(1),
                    base,
                    base.darken(1),
                    base.darken(2)
                ];
            case 'analogous':
                return [
                    base.set('hsl.h', '-30'),
                    base.set('hsl.h', '-15'),
                    base,
                    base.set('hsl.h', '+15'),
                    base.set('hsl.h', '+30')
                ];
            case 'complementary':
                return [
                    base.set('hsl.h', '-15'),
                    base,
                    base.set('hsl.h', '+15'),
                    base.set('hsl.h', '+180'),
                    base.set('hsl.h', '+195')
                ];
            case 'triadic':
                return [
                    base,
                    base.set('hsl.h', '+120'),
                    base.set('hsl.h', '+240'),
                    base.set('hsl.h', '+120').brighten(1),
                    base.set('hsl.h', '+240').brighten(1)
                ];
        }
    }

    updateColors() {
        const baseColor = this.baseColorInput.value;
        const colors = this.generateHarmony(baseColor);
        
        // Update palette display
        this.generatedPalette.innerHTML = colors.map((color, index) => `
            <div class="palette-color animate-in" 
                 style="background-color: ${color.hex()};
                        animation-delay: ${index * 100}ms"
                 data-color="${color.hex()}"
                 title="Clique para copiar">
                <div class="color-info">
                    <span>${color.hex()}</span>
                    <span>RGB: ${color.rgb().map(Math.round).join(', ')}</span>
                </div>
            </div>
        `).join('');

        // Enhanced preview with more elements and explanations
        const previewContainer = this.previewContainer;
        previewContainer.innerHTML = `
            <div class="preview-header">Cabeçalho Principal</div>
            <div class="preview-content">
                <div class="element-explanation">
                    <h4>Elementos de Interface</h4>
                    <p>Veja como as cores são aplicadas em diferentes elementos:</p>
                </div>
                
                <div class="element-group">
                    <span class="element-label">Títulos e Cabeçalhos:</span>
                    <h4 class="preview-title">Exemplo de Título</h4>
                </div>

                <div class="element-group">
                    <span class="element-label">Texto Principal:</span>
                    <p class="preview-text">Este é um exemplo de texto para conteúdo principal. O contraste adequado é essencial para legibilidade.</p>
                </div>

                <div class="element-group">
                    <span class="element-label">Links e Navegação:</span>
                    <div class="preview-links">
                        <a href="#" class="preview-link">Link não visitado</a>
                        <a href="#" class="preview-link visited">Link visitado</a>
                    </div>
                </div>

                <div class="element-group">
                    <span class="element-label">Botões de Ação:</span>
                    <div class="preview-buttons">
                        <button class="preview-button primary">Botão Principal</button>
                        <button class="preview-button secondary">Botão Secundário</button>
                    </div>
                </div>

                <div class="element-group">
                    <span class="element-label">Bordas e Divisores:</span>
                    <div class="preview-border"></div>
                </div>

                <div class="element-group">
                    <span class="element-label">Cards e Containers:</span>
                    <div class="preview-card">
                        <h5>Card de Exemplo</h5>
                        <p>Conteúdo do card com fundo suave</p>
                    </div>
                </div>
            </div>
        `;

        // Apply colors to all preview elements
        const header = previewContainer.querySelector('.preview-header');
        const title = previewContainer.querySelector('.preview-title');
        const text = previewContainer.querySelector('.preview-text');
        const links = previewContainer.querySelectorAll('.preview-link');
        const primaryBtn = previewContainer.querySelector('.preview-button.primary');
        const secondaryBtn = previewContainer.querySelector('.preview-button.secondary');
        const border = previewContainer.querySelector('.preview-border');
        const card = previewContainer.querySelector('.preview-card');

        header.style.backgroundColor = colors[0].hex();
        header.style.color = chroma.contrast(colors[0], 'white') > 4.5 ? 'white' : 'black';

        title.style.color = colors[1].hex();
        text.style.color = colors[3].darken(1).hex();

        links.forEach(link => {
            link.style.color = colors[2].hex();
            if (link.classList.contains('visited')) {
                link.style.color = colors[2].darken(1).hex();
            }
        });

        primaryBtn.style.backgroundColor = colors[2].hex();
        primaryBtn.style.color = chroma.contrast(colors[2], 'white') > 4.5 ? 'white' : 'black';

        secondaryBtn.style.backgroundColor = colors[4].hex();
        secondaryBtn.style.color = chroma.contrast(colors[4], 'white') > 4.5 ? 'white' : 'black';

        border.style.borderColor = colors[3].hex();
        card.style.backgroundColor = colors[1].brighten(2).hex();
        card.style.borderColor = colors[3].hex();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ColorPlayground();
});