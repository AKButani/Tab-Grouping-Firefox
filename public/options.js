/* document.addEventListener('DOMContentLoaded', function() {
    // Retrieve saved preferences
    const savedMode = localStorage.getItem('mode');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    // Apply saved preferences
    if (savedMode) {
        document.querySelector(`input[name="mode"][value="${savedMode}"]`).checked = true;
    }
    if (savedAccentColor) {
        document.getElementById('accent-color').value = savedAccentColor;
    }
    
    // Save preferences on change
    document.querySelectorAll('input[name="mode"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            localStorage.setItem('mode', this.value);
        });
    });
    document.getElementById('accent-color').addEventListener('change', function() {
        localStorage.setItem('accentColor', this.value);
    });
}); */


document.addEventListener('DOMContentLoaded', restoreOptions);


async function restoreOptions() {

    let mode = await browser.storage.local.get('mode');
    console.log(mode);
    let selectedMode;
    if (mode === undefined) {
        selectedMode = "light";
    }else{
        selectedMode = mode.mode;
    }
    console.log(`${selectedMode}-mode-radio`);
    document.getElementById(`${selectedMode}-mode-radio`).checked = true;

    /* const accentColor = await browser.storage.local.get('accentColor');
    console.log(accentColor);
    document.getElementById('accent-color').value = accentColor;
 */
};

async function saveMode(e){
    e.preventDefault();
    const mode = document.querySelector('input[name="mode"]:checked').value;
    await browser.storage.local.set({mode});

    console.log('Mode saved');
}

/* async function saveAccentColor(e){
    e.preventDefault();
    const accentColor = document.getElementById('accent-color').value;
    await browser.storage.local.set({accentColor});

    console.log('Accent color saved');
} */

document.querySelectorAll('input[name="mode"]').forEach(function(radio) {
    radio.addEventListener('change', saveMode);
});

/* document.getElementById('accent-color').addEventListener('change', saveAccentColor); */