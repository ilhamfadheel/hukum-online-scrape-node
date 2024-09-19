import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const scrapeHukumOnline = async () => {
  const firecrawl = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

  const url = "https://www.hukumonline.com/pusatdata/detail/lt66e19da238b6f/peraturan-presiden-nomor-98-tahun-2024/";

  // Add the cookie you obtained after logging in manually
  const cookie = process.env.HUKUMONLINE_COOKIE;

  const scrapeResponse = await firecrawl.scrapeUrl(url, {
    formats: ['extract', 'markdown'],
    headers: {
      'Cookie': cookie
    },
    waitFor: 10000,
    extract: {
        "prompt": "save the pdf file into markdown"
    }
  });
  
  console.log(scrapeResponse)

  // Remove everything before the word "English" in the scrapeResponse
  const markdownContent = scrapeResponse.markdown;
  const englishIndex = markdownContent.indexOf('English');
  const cleanedContent = englishIndex !== -1 ? markdownContent.substring(englishIndex) : markdownContent;

  // Remove lines containing ![loading] with values connected right after the word, and ![back to top]
  const filteredContent = cleanedContent.split('\n').filter(line => 
    !line.includes('![loading]') && !line.includes('![back to top]')
  ).join('\n');

  const fileName = url.match(/\/([^/]+)\/[^/]*$/)?.[1] || 'default';
  const outputPath = path.join('output', `${fileName}.md`);

  await fs.writeFile(outputPath, filteredContent);
  console.log(`Scraped content saved to ${outputPath}`);
};

scrapeHukumOnline();