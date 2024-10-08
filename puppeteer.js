import puppeteer from 'puppeteer';
import path from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFromWebsite(url) {
    // Create the output directory if it doesn't exist
    const downloadPath = path.join(__dirname, 'output');
    if (!existsSync(downloadPath)) {
        mkdirSync(downloadPath);
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Wait for the download option to appear and click it
        const downloadOptionSelector = 'span:contains("Download")';
        await page.waitForSelector(downloadOptionSelector, { visible: true });
        await page.click(downloadOptionSelector);

        // Wait for the download to start
        await page.waitForTimeout(1000);

        // Function to check if download is complete
        const isDownloadComplete = () => {
            const files = readdirSync(downloadPath);
            return files.some(file => !file.endsWith('.crdownload'));
        };

        // Wait for the download to complete
        while (!isDownloadComplete()) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('Download completed successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Keep the browser open for 5 seconds before closing
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

// Usage
const websiteUrl = "https://www.hukumonline.com/pusatdata/detail/lt66e19da238b6f/peraturan-presiden-nomor-98-tahun-2024/";
downloadFromWebsite(websiteUrl);
