import { chromium, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Selector Discovery Script
 * 
 * Usage: npx ts-node utils/discover-selectors.ts <url> [email] [password]
 * 
 * Opens the app, optionally logs in, then scans ALL interactive elements
 * and outputs recommended Playwright selectors.
 * 
 * The output is saved to: selector-reports/<page-name>-selectors.json
 */

interface ElementInfo {
    tag: string;
    type?: string;
    id?: string;
    name?: string;
    className?: string;
    placeholder?: string;
    ariaLabel?: string;
    ariaRole?: string;
    testId?: string;
    text?: string;
    href?: string;
    isVisible: boolean;
    recommendedSelector: string;
    selectorType: string;
    stability: 'high' | 'medium' | 'low';
}

async function discoverSelectors(url: string, email?: string, password?: string, featureName?: string) {
    console.log('\n🔍 Selector Discovery — Starting...\n');
    console.log(`📍 URL: ${url}`);

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    try {
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ Page loaded\n');

        // Take screenshot before login
        const screenshotDir = path.join(process.cwd(), 'selector-reports');
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
        await page.screenshot({ path: path.join(screenshotDir, 'before-login.png'), fullPage: true });

        // Scan page BEFORE login
        console.log('📋 Scanning page elements (pre-login)...\n');
        const preLoginElements = await scanPage(page);
        printReport('Login Page', preLoginElements);

        // If credentials provided, attempt login
        if (email && password) {
            console.log('\n🔐 Attempting login...');
            await attemptLogin(page, email, password, preLoginElements);

            // Wait for navigation
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Take screenshot after login
            await page.screenshot({ path: path.join(screenshotDir, 'after-login.png'), fullPage: true });

            // Scan page AFTER login (dashboard/home)
            console.log('\n📋 Scanning page elements (post-login)...\n');
            let postLoginElements = await scanPage(page);
            printReport('Dashboard/Home', postLoginElements);

            // SPECIAL LOGIC: Navigate to Feature if provided
            if (featureName) {
                console.log(`\n🧭 Navigating to feature: "${featureName}"...`);

                // Fuzzy Match Strategy
                const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
                const target = normalize(featureName);
                const synonyms = ['add', 'new', 'create', 'plus', '+']; // Common prefixes

                const featureLink = postLoginElements.find(e => {
                    const text = normalize(e.text || '');
                    const label = normalize(e.ariaLabel || '');

                    // 1. Direct match (fuzzy)
                    if (text.includes(target) || label.includes(target)) return true;

                    // 2. Synonym match (e.g. User says "Add Provider", button says "New Provider")
                    // If featureName has "Add", try replacing it with synonyms
                    for (const syn of synonyms) {
                        const modifiedTarget = target.replace('add', syn).replace('new', syn).replace('create', syn);
                        if (text.includes(modifiedTarget) || label.includes(modifiedTarget)) return true;
                    }

                    return false;
                });

                if (featureLink) {
                    console.log(`   Found link: ${featureLink.recommendedSelector}`);
                    // Click it
                    if (featureLink.testId) await page.getByTestId(featureLink.testId).click();
                    else if (featureLink.text) await page.getByRole('link', { name: featureLink.text }).click().catch(() => page.getByText(featureLink.text!).click());
                    else await page.locator(featureLink.recommendedSelector).click();

                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(2000);

                    console.log(`📋 Scanning feature page: ${featureName}...\n`);
                    const featureElements = await scanPage(page);
                    printReport(featureName, featureElements);

                    // Update postLoginElements to be the feature elements for the report
                    postLoginElements = featureElements;
                } else {
                    console.log(`⚠️  Could not find link for "${featureName}" on dashboard.`);
                }
            }

            // Save combined report


            // Save combined report
            const report = {
                timestamp: new Date().toISOString(),
                url,
                preLogin: { pageName: 'Login Page', elements: preLoginElements },
                postLogin: { pageName: 'Dashboard/Home', url: page.url(), elements: postLoginElements },
            };

            const reportPath = path.join(screenshotDir, 'selectors-report.json');
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`\n💾 Full report saved to: ${reportPath}`);
        } else {
            // Save pre-login only
            const report = {
                timestamp: new Date().toISOString(),
                url,
                preLogin: { pageName: 'Login Page', elements: preLoginElements },
            };

            const reportPath = path.join(screenshotDir, 'selectors-report.json');
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`\n💾 Report saved to: ${reportPath}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
        console.log('\n✅ Discovery complete. Browser closed.');
    }
}

/** Scan all interactive elements on the current page */
async function scanPage(page: Page): Promise<ElementInfo[]> {
    return await page.evaluate(() => {
        const elements: ElementInfo[] = [];

        // Target all interactive and visible elements
        const selectors = [
            'input', 'button', 'select', 'textarea', 'a[href]',
            '[role="button"]', '[role="link"]', '[role="tab"]', '[role="menuitem"]',
            '[role="checkbox"]', '[role="radio"]', '[role="switch"]', '[role="combobox"]',
            '[role="textbox"]', '[role="searchbox"]', '[role="listbox"]',
            '[role="navigation"]', '[role="dialog"]', '[role="alert"]',
            '[data-testid]', '[aria-label]',
            'h1', 'h2', 'h3', 'label', 'img',
            '.sidebar a', 'nav a', '[class*="menu"] a',
        ];

        const seen = new Set<Element>();

        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach((el) => {
                if (seen.has(el)) return;
                seen.add(el);

                const htmlEl = el as HTMLElement;
                const tag = el.tagName.toLowerCase();
                const type = (el as HTMLInputElement).type || undefined;
                const id = el.id || undefined;
                const name = (el as HTMLInputElement).name || undefined;
                const className = el.className && typeof el.className === 'string'
                    ? el.className.substring(0, 100) : undefined;
                const placeholder = (el as HTMLInputElement).placeholder || undefined;
                const ariaLabel = el.getAttribute('aria-label') || undefined;
                const ariaRole = el.getAttribute('role') || undefined;
                const testId = el.getAttribute('data-testid') || el.getAttribute('data-test-id') || undefined;
                const text = htmlEl.innerText?.trim().substring(0, 80) || undefined;
                const href = (el as HTMLAnchorElement).href || undefined;
                const rect = htmlEl.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;

                // Determine best selector
                let recommendedSelector = '';
                let selectorType = '';
                let stability: 'high' | 'medium' | 'low' = 'low';

                if (testId) {
                    recommendedSelector = `page.getByTestId('${testId}')`;
                    selectorType = 'data-testid';
                    stability = 'high';
                } else if (ariaRole && ariaLabel) {
                    recommendedSelector = `page.getByRole('${ariaRole}', { name: '${ariaLabel}' })`;
                    selectorType = 'role+name';
                    stability = 'high';
                } else if (ariaRole && text && text.length < 50) {
                    recommendedSelector = `page.getByRole('${ariaRole}', { name: '${text}' })`;
                    selectorType = 'role+text';
                    stability = 'high';
                } else if (ariaLabel) {
                    recommendedSelector = `page.getByLabel('${ariaLabel}')`;
                    selectorType = 'aria-label';
                    stability = 'high';
                } else if (tag === 'input' && placeholder) {
                    recommendedSelector = `page.getByPlaceholder('${placeholder}')`;
                    selectorType = 'placeholder';
                    stability = 'medium';
                } else if (tag === 'label' || (tag === 'input' && type)) {
                    // Try to find associated label
                    const labelEl = id ? document.querySelector(`label[for="${id}"]`) : null;
                    if (labelEl) {
                        const labelText = (labelEl as HTMLElement).innerText?.trim();
                        if (labelText) {
                            recommendedSelector = `page.getByLabel('${labelText}')`;
                            selectorType = 'label';
                            stability = 'high';
                        }
                    }
                    if (!recommendedSelector && placeholder) {
                        recommendedSelector = `page.getByPlaceholder('${placeholder}')`;
                        selectorType = 'placeholder';
                        stability = 'medium';
                    }
                    if (!recommendedSelector && id) {
                        recommendedSelector = `page.locator('#${id}')`;
                        selectorType = 'id';
                        stability = 'medium';
                    }
                } else if (text && text.length < 50 && (tag === 'button' || tag === 'a')) {
                    const role = tag === 'button' ? 'button' : 'link';
                    recommendedSelector = `page.getByRole('${role}', { name: '${text}' })`;
                    selectorType = 'role+text';
                    stability = 'high';
                } else if (text && text.length < 50) {
                    recommendedSelector = `page.getByText('${text}')`;
                    selectorType = 'text';
                    stability = 'medium';
                } else if (id) {
                    recommendedSelector = `page.locator('#${id}')`;
                    selectorType = 'id';
                    stability = 'medium';
                } else if (className) {
                    const firstClass = className.split(' ')[0];
                    recommendedSelector = `page.locator('.${firstClass}')`;
                    selectorType = 'class';
                    stability = 'low';
                }

                if (recommendedSelector && isVisible) {
                    elements.push({
                        tag, type, id, name, className, placeholder,
                        ariaLabel, ariaRole, testId, text, href, isVisible,
                        recommendedSelector, selectorType, stability,
                    });
                }
            });
        }

        return elements;
    });
}

/** Try to login using discovered selectors */
async function attemptLogin(page: Page, email: string, password: string, elements: ElementInfo[]) {
    // Find email input
    const emailEl = elements.find(e =>
        e.tag === 'input' && (
            e.type === 'email' ||
            e.placeholder?.toLowerCase().includes('email') ||
            e.ariaLabel?.toLowerCase().includes('email') ||
            e.name?.toLowerCase().includes('email')
        )
    );

    // Find password input
    const passwordEl = elements.find(e =>
        e.tag === 'input' && (
            e.type === 'password' ||
            e.placeholder?.toLowerCase().includes('password') ||
            e.ariaLabel?.toLowerCase().includes('password') ||
            e.name?.toLowerCase().includes('password')
        )
    );

    // Find login button
    const loginBtn = elements.find(e =>
        (e.tag === 'button' || e.ariaRole === 'button') && (
            e.text?.toLowerCase().includes('log in') ||
            e.text?.toLowerCase().includes('login') ||
            e.text?.toLowerCase().includes('sign in') ||
            e.ariaLabel?.toLowerCase().includes('login')
        )
    );

    if (emailEl) {
        console.log(`  📧 Email field: ${emailEl.recommendedSelector}`);
        await page.evaluate((sel) => {
            // Use the raw selector approach
        }, emailEl.recommendedSelector);
        // Fill using Playwright API
        if (emailEl.testId) await page.getByTestId(emailEl.testId).fill(email);
        else if (emailEl.ariaLabel) await page.getByLabel(emailEl.ariaLabel).fill(email);
        else if (emailEl.placeholder) await page.getByPlaceholder(emailEl.placeholder).fill(email);
        else if (emailEl.id) await page.locator(`#${emailEl.id}`).fill(email);
    }

    if (passwordEl) {
        console.log(`  🔑 Password field: ${passwordEl.recommendedSelector}`);
        if (passwordEl.testId) await page.getByTestId(passwordEl.testId).fill(password);
        else if (passwordEl.ariaLabel) await page.getByLabel(passwordEl.ariaLabel).fill(password);
        else if (passwordEl.placeholder) await page.getByPlaceholder(passwordEl.placeholder).fill(password);
        else if (passwordEl.id) await page.locator(`#${passwordEl.id}`).fill(password);
    }

    if (loginBtn) {
        console.log(`  🔘 Login button: ${loginBtn.recommendedSelector}`);
        if (loginBtn.testId) await page.getByTestId(loginBtn.testId).click();
        else if (loginBtn.text) await page.getByRole('button', { name: loginBtn.text }).click();
        else if (loginBtn.id) await page.locator(`#${loginBtn.id}`).click();
    }
}

/** Print a formatted report to console */
function printReport(pageName: string, elements: ElementInfo[]) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(` 📄 ${pageName} — ${elements.length} elements discovered`);
    console.log(`${'='.repeat(70)}\n`);

    // Group by tag
    const groups: Record<string, ElementInfo[]> = {};
    for (const el of elements) {
        const key = el.tag;
        (groups[key] = groups[key] || []).push(el);
    }

    for (const [tag, groupElements] of Object.entries(groups)) {
        console.log(`  🏷️  <${tag}> (${groupElements.length} elements)`);
        for (const el of groupElements) {
            const stabilityIcon = el.stability === 'high' ? '🟢' : el.stability === 'medium' ? '🟡' : '🔴';
            const extra = el.text ? ` — "${el.text.substring(0, 40)}"` : '';
            console.log(`     ${stabilityIcon} ${el.recommendedSelector}${extra}`);
        }
        console.log('');
    }
}

// --- Main ---
const args = process.argv.slice(2);
const url = args[0];
const email = args[1];
const password = args[2];
const featureName = args[3];

if (!url) {
    console.log('Usage: npx ts-node utils/discover-selectors.ts <url> [email] [password] [feature_name]');
    console.log('Example: npx ts-node utils/discover-selectors.ts https://qa.admin.eu.eamata.com/auth/login user@test.com Pass123 "Home Care Provider"');
    process.exit(1);
}

discoverSelectors(url, email, password, featureName);
