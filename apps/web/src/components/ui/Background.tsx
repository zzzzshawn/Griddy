import Image from 'next/image'
import React from 'react'

const Background = () => {
    return (
        <Image src="/12.png" alt="background" fill className='object-cover size-full' />
    )
}

export default Background