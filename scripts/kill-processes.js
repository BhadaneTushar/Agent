const { exec } = require('child_process');
const os = require('os');

const IS_WINDOWS = os.platform() === 'win32';

/**
 * List of process names to kill
 * CAUTION: 'node' is broad, but necessary for stuck Playwright runners.
 */
const TARGETS = [
    'playwright',
    'chrome',
    'msedge',
    'chromedriver',
    'geckodriver',
    'webkit',
    // We only kill 'node' if it looks like a test runner (handled via command line args in advanced versions,
    // but for now we'll be aggressive about stuck test processes)
];

// For Windows, we need the .exe extension
const WIN_TARGETS = [
    'node.exe',
    'playwright.exe',
    'chrome.exe',
    'msedge.exe',
    'chromedriver.exe',
    'geckodriver.exe'
];

async function killProcesses() {
    console.log('🧹 cleanup-agent: Hunting for zombie processes...');

    const targets = IS_WINDOWS ? WIN_TARGETS : TARGETS;

    for (const target of targets) {
        try {
            const cmd = IS_WINDOWS
                ? `taskkill /F /IM ${target}`
                : `pkill -f ${target}`; // -f matches against full argument list on Unix

            await new Promise((resolve) => {
                exec(cmd, (error, stdout, stderr) => {
                    // Ignore errors (e.g. process not found)
                    if (!error) {
                        console.log(`✅ Killed: ${target}`);
                    } else if (stderr && !stderr.includes('not found') && !stderr.includes('no process')) {
                        // Only log real errors, silence "not found" noise
                        // console.log(`   (No ${target} found)`); 
                    }
                    resolve();
                });
            });
        } catch (e) {
            console.error(`❌ Error killing ${target}:`, e.message);
        }
    }

    console.log('✨ Cleanup complete. Environment ready.');
}

killProcesses();
