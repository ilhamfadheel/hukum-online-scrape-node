# Hukum Online Scrape

This project is designed to crawl and collect legal data from [www.hukumonline.com](https://www.hukumonline.com) using Node.js and Firecrawl. The collected data will be used to fine-tune a language model, creating a specialized model focused on Indonesian law.

## Project Objective

The main objective is to create a dataset of Indonesian legal documents, including regulations and court decisions, which will be used to fine-tune a language model. This will result in a model with specialized knowledge of Indonesian law.

## Data Source

The data is collected from [www.hukumonline.com](https://www.hukumonline.com), which provides:

"Kumpulan peraturan dan putusan pengadilan preseden maupun non-preseden yang diperbarui secara berkala dengan sistematis dan terintegrasi, untuk kemudahan riset hukum Anda."

(Translation: A collection of regulations and court decisions, both precedent and non-precedent, updated regularly, systematically, and integrated for the convenience of your legal research.)

## Types of Legal Documents

The crawler is designed to categorize the legal documents into the following types:

1. Peraturan Pusat (Central Regulations)
2. Peraturan Daerah (Regional Regulations)
3. Putusan Terpilih (Selected Decisions)
4. Precedent
5. Terjemahan Peraturan (Regulation Translations)
6. Peraturan Konsolidasi (Consolidated Regulations)

## Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/ilhamfadheel/hukum-online-scrape-node.git
   cd hukum-online-scrape
   ```

2. Install the required packages:
   ```
   npm install
   ```

## Usage

1. Set up your environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file and add your Firecrawl API key:
   ```
   FIRECRAWL_API_KEY=your_api_key_here
   ```
   Make sure to keep your API key confidential and never commit it to the repository.

2. Run the main scraping script:
   ```
   npm run start
   ```

3. To scrape specific document types:
   ```
   npm run start -- --type peraturan_pusat
   ```
   Replace `peraturan_pusat` with the desired document type.

4. To limit the number of pages scraped:
   ```
   npm run start -- --limit 100
   ```

5. To process the scraped data:
   ```
   npm run process
   ```

6. To create the GGUF file for model fine-tuning:
   ```
   npm run create-gguf
   ```

For more detailed usage instructions, refer to the documentation in the `docs/` directory.

## Project Structure

- `index.js`: The entry point for running the scraper.
- `src/scraper/`: Contains the core scraping logic.
- `src/processors/`: Modules for cleaning and transforming the scraped data.
- `src/models/`: Contains scripts for creating GGUF files and model-related operations.
- `data/`: Directory to store raw and processed data.
- `config/`: Configuration files and settings.
- `tests/`: Unit and integration tests.
- `docs/`: Detailed documentation.

## License

This project is open-source and is provided under the MIT license.

## Disclaimer

This project is for educational and research purposes only. The creators of this project do not own the data collected, and users should respect the copyright and terms of use of www.hukumonline.com.

## Contributing

Contributions to improve the project are welcome. Please feel free to submit a Pull Request.

## Contact

For any queries regarding this project, please open an issue on this GitHub repository.