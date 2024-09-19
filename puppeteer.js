import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const SCRAPE_URL = "https://www.hukumonline.com/pusatdata/detail/lt66e19da238b6f/peraturan-presiden-nomor-98-tahun-2024/";
const LOGIN_URL = 'https://id.hukumonline.com/user/login';
const COOKIES_FILE = 'cookies.json';
const CREDENTIALS_FILE = '.env';
const OUTPUT_FOLDER = 'output';

async function login(page, username, password) {
    await page.goto(LOGIN_URL);
    await page.waitForSelector('#username');
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button[type="submit"]');

    // Wait for already login popup if exist
    try {
        // Wait for the modal to be visible
        await page.waitForSelector('#modalDouble.show', { visible: true, timeout: 5000 });
        console.log('Popup detected');


        // Click the "Lanjutkan login" button
        const buttonSelector = 'button.btnCancel';
        await page.waitForSelector(buttonSelector, { visible: true, timeout: 5000 });

        page.click(buttonSelector)

        console.log('Successfully clicked "Lanjutkan login" button');
    } catch (error) {
        console.log('No popup detected or error handling popup:', error.message);
    }

    await page.waitForNavigation().catch(e => console.log('Navigation timeout, continuing...'));
}

async function saveCookies(page, filePath) {
    const cookies = await page.cookies();
    await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
}

async function saveCredentials(username, password) {
    const content = `HUKUMONLINE_USERNAME=${username}\nHUKUMONLINE_PASSWORD=${password}\n`;
    await fs.appendFile(CREDENTIALS_FILE, content);
}

function getFileNameFromUrl(url) {
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    return lastPart.endsWith('/') ? urlParts[urlParts.length - 2] : lastPart;
}

const scrapeHukumOnline = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    const username = process.env.HUKUMONLINE_USERNAME;
    const password = process.env.HUKUMONLINE_PASSWORD;

    if (!username || !password) {
        console.error('Please set HUKUMONLINE_USERNAME and HUKUMONLINE_PASSWORD in your .env file');
        await browser.close();
        return;
    }

    try {
        // await login(page, username, password);
        // await saveCookies(page, COOKIES_FILE);
        // await saveCredentials(username, password);

        // console.log('Login successful. Cookies and credentials saved.');

        await page.goto(SCRAPE_URL, { waitUntil: 'networkidle0' });
        console.log('Navigated to scrape URL');
        await page.waitForSelector('button:has(span:contains("Download"))', { timeout: 5000 });
        await page.click('button:has(span:contains("Download"))');

        console.log('Download completed');
    } catch (error) {
        console.error('Error during login or scraping:', error);
    } finally {
        await browser.close();
    }
};

scrapeHukumOnline();