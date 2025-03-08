import React from 'react'

const Hero = () => {
    return (
        <section className='relative text-5xl flex-grow flex flex-col items-center justify-center gap-8 text-center'>
            <h1 className='font-semibold sm:font-bold max-sm:leading-9 text-white [text-shadow:_0_1px_0_rgb(0_0_0),_1px_0_0_rgb(0_0_0),_-1px_0_0_rgb(0_0_0),_0_-1px_0_rgb(0_0_0)] z-50 max-sm:text-[2.6rem]' >
                Generate Graffiti style images with
            </h1>
            <span className='font-urban tracking-widest text-white [text-shadow:_0_1px_0_rgb(0_0_0),_1px_0_0_rgb(0_0_0),_-1px_0_0_rgb(0_0_0),_0_-1px_0_rgb(0_0_0)] z-50 max-sm:text-4xl'>
                GRIDDY
            </span>
        </section>
    )
}

export default Hero