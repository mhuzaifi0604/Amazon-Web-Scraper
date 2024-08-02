# Important Imports for the script
import requests # For making HTTP requests
from bs4 import BeautifulSoup # For parsing HTML
import json
import time
import random

# Headers to be used in the HTTP requests
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip',
    'DNT': '1',  # For not trackiing the request header
    'Connection': 'close'
}

# Function to read the products from the JSON file
def read_queries(file_path):
    with open(file_path, 'r') as file:
        queries = json.load(file)
    return queries

# Function to scrape the data for a single product
def scrape_for_single_product(product_name):
    all_products = []

    for page in range(1, 21):  # Scraping 20 pages
        success = False
        retries = 3  # Number of retries before MOVING TO THE NEXT PAGE FOR THE PRODUCT
        for _ in range(retries):
            try:
                print(f":::::::::::::::::::::::::::::::::::::::: Scraping page {page} for product: {product_name} ::::::::::::::::::::::::::::::::::::::::\n\n")
                # Make the request to the Amazon search page
                req = requests.get(f'https://www.amazon.com/s?k={product_name}&page={page}', headers=headers)
                soup = BeautifulSoup(req.content, 'html.parser') # Get the current page's content using BeautifulSoup
                
                # Looking for container in the scraped content that contained product details
                # 'div[data-component-type="s-search-result"]' is the class of the parent container of the product details
                for product in soup.select('div[data-component-type="s-search-result"]'):
                    # Getting required details of the products from the container and storing them in vars
                    title = product.find('span', class_='a-size-medium a-color-base a-text-normal')
                    rating = product.find('span', class_='a-icon-alt')
                    reviews = product.find('span', class_='a-size-base s-underline-text')
                    price = product.find('span', class_='a-price-whole')
                    image_url = product.find('img', class_='s-image')

                    single_product = { # Creating an object for a single product to add to the resultant json file
                        # Adding scraped values and None if the value is not found
                        'title': title.text if title else None,
                        'rating': rating.text if rating else None,
                        'reviews': reviews.text if reviews else None,
                        'price': price.text if price else None,
                        'imageUrl': image_url['src'] if image_url else None
                    }

                    all_products.append(single_product)
                success = True # Mark the request as successful if no exceptions are raised
                break  # Exit retry loop if successful
            # Handling exceptions
            except (requests.exceptions.RequestException, requests.exceptions.ChunkedEncodingError) as e:
                print(f"Error encountered: {e}. Retrying...")
                time.sleep(random.uniform(1, 3))  # Random sleep before retrying

        if not success: # If the request is not successful after retries, print the error message and continue to the next page
            print(f"Failed to scrape page {page} for product: {product} after {retries} retries.")
            continue

        time.sleep(random.uniform(1, 3))
        

    # Save the data to a JSON file named after the product
    file_name = f'{product_name.replace("+", "_")}.json'
    with open(file_name, 'w') as f:
        json.dump(all_products, f, indent=4)

    print(f"\n ::::::::::::::::::::::::::: Scraping complete for {product_name}. Data saved to '{file_name}'.:::::::::::::::::::::::::::::::::::\n\n")

# Main function to read product names from the JSON file and scrape the data for each product
def main():
    products = read_queries('user_queries.json') # Reading Products from the JSON file
    for product in products:
        scrape_for_single_product(product.replace(" ", "+")) # Scraping data for each product

if __name__ == "__main__":
    main()
