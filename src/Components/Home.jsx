import React from 'react'
import products from '../Products'
import { Link } from 'react-router-dom'
import amazon from '../assets/amazon.jpg'

const Home = () => {
  return (
    <div className='relative flex flex-col h-full w-full items-center gap-8'>
    <img
        src={amazon}
        alt='Cannot Display Image'
        className='flex w-full h-screen md:max-h-[300px] filter brightness-75 object-cover'
    />

    <h1 className='text-4xl text-center md:text-5xl font-bold absolute left-1/2 top-28 transform -translate-x-1/2 -translate-y-1/2 text-white'>
        Amazon Web Scraper
    </h1>

    <p
        className='text-lg font-bold absolute left-1/2 top-44 md:top-40 transform -translate-x-1/2 -translate-y-1/2 text-white'
        style={{ fontSize: '12px' }}
    >
        by Muhammad Huzaifa
    </p>

    <p className='absolute left-1/2 top-52 md:top-48 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white w-12'></p>

    <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Adjust the minmax values to fit your design
                gap: '10px',
                maxWidth: '1200px', // Adjust as needed
                margin: '0 auto',   // Centers the grid container horizontally
                padding: '20px'     // Adds space around the grid container
            }}
        >
            <h1 style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Product List</h1>
            {products.map(product => (
                <Link key={product} to={`/products/${product}`} style={{ textDecoration: 'none' }}>
                    <button
                        className='flex text-center justify-center items-center h-12 w-28 text-orange-500 border border-orange-500 font-bold hover:font-light hover:text-white hover:bg-orange-500 hover:scale-105 transform-all duration-300 rounded-lg p-4'
                    >
                        {product}
                    </button>
                </Link>
            ))}
        </div>

        </div>
  )
}

export default Home