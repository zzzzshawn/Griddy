import Image from 'next/image'
import React from 'react'

interface ImagesSectionProps {
    images: {
        url: string
        prompt: string
    }[]
    hasNextPage: boolean
}

const ImageGrid = React.forwardRef<HTMLDivElement, ImagesSectionProps>(({ images, hasNextPage }, ref) => {

    return (
        <section className=''>
            {
                images.map((image, idx)=> (
                    <Image
                        key={idx}
                        src={image.url}
                        alt={image.prompt}
                        width={500}
                        height={500}
                    />
                ))
            }
            {
                hasNextPage && (
                    <div ref={ref} className='w-full h-10 bg-slate-500'>
                        Loading...
                    </div>
                )
            }
        </section>
    )
}
)

export default ImageGrid