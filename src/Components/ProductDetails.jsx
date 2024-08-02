import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import banner from '../assets/banner.jpg';

const ProductDetails = () => {
    const { productName } = useParams();
    const [productData, setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9; // 3 columns * 3 rows

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // Replace spaces with underscores in productName
                const fileName = productName.replace(/ /g, '_') + '.json';
                console.log("Filename:", fileName);
                const response = await fetch(`/Products/${fileName}`);
                console.log("Response:", response);

                // Check if the response is ok (status is in the range 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Data:", data);
                setProductData(data); // Wrap the data in an array to match expected structure
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        fetchProductData();
    }, [productName]);

    // Calculate the products to display for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productData.slice(indexOfFirstProduct, indexOfLastProduct);

    // Determine the number of pages
    const totalPages = Math.ceil(productData.length / productsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate page numbers to display in pagination
    const generatePageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            // If total pages is 5 or less, show all page numbers
            pages = Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
            // Show first 3 pages, last 2 pages, and handle ellipses
            pages = [1, 2, 3];
            if (currentPage > 4) {
                pages.push('...');
            }
            if (currentPage > 3 && currentPage < totalPages - 2) {
                pages.push(currentPage);
            }
            if (currentPage < totalPages - 3) {
                pages.push('...');
            }
            pages.push(totalPages - 1, totalPages);
        }
        return pages;
    };

    return (
        <div className='relative flex flex-col h-full w-full items-center gap-8'>
            <img
                src={banner}
                alt='Cannot Display Image'
                className='flex w-full h-screen md:max-h-[300px] filter brightness-50 object-cover'
            />

            <h1 className='text-4xl text-center md:text-5xl font-bold absolute left-1/2 top-28 transform -translate-x-1/2 -translate-y-1/2 text-white'>
                {productName}
            </h1>

            <p
                className='text-lg font-bold absolute left-1/2 top-44 md:top-40 transform -translate-x-1/2 -translate-y-1/2 text-white'
                style={{ fontSize: '12px' }}
            >
                Amazon Web services
            </p>

            <p className='absolute left-1/2 top-52 md:top-48 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white w-12'></p>

            {/* <h1>{productName}</h1> */}
            {productData.length === 0 ? (
                <p>No Such Products found in store at the time</p>
            ) : (
                <>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '30px',
                            maxWidth: '1200px', // Adjust this to control the maximum width of the grid container
                            margin: '0 auto',   // Centers the grid container horizontally
                            padding: '0 20px'   // Adds extra horizontal space around the grid
                        }}
                    >
                        {currentProducts.map((product, index) => (
                            <div key={index} className='flex flex-col gap-2 justify-center items-center shadow-md shadow-black hover:scale-105 transform-all duration-300' style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}>
                                <LazyLoadImage
                                    alt={product.title}
                                    src={product.imageUrl}
                                    effect="blur"
                                    style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                                />
                                <h2 className='text-blac text-sm font-semibold'>{product.title}</h2>
                                <p className='border-2 border-[#0b9948] w-24'></p>
                                <p className='text-black'>Rating: {product.rating}</p>
                                <p className='text-black'><strong>Reviews:</strong> {product.reviews}</p>
                                <p className='text-black'><strong>Price: $</strong>{product.price}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ padding: '10px 15px', margin: '0 5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        >
                            Previous
                        </button>
                        {generatePageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => page !== '...' && handlePageChange(page)}
                                style={{
                                    padding: '10px 15px',
                                    margin: '0 5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    backgroundColor: currentPage === page ? '#007bff' : '#fff',
                                    color: currentPage === page ? '#fff' : '#000',
                                }}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ padding: '10px 15px', margin: '0 5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetails;
