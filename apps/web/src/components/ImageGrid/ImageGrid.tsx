import React, { forwardRef } from 'react'
import { ImageCard } from './ImageCard'
import { Skeleton } from '../ui/skeleton'

interface ImagesSectionProps {
    images: {
        url: string
        prompt: string
    }[]
    hasNextPage: boolean
}

const ImageGrid = forwardRef<HTMLDivElement, ImagesSectionProps>(({ images, hasNextPage }, ref) => {

    return (
        <section className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((data, idx) => (
                <ImageCard key={idx} imgUrl={data.url} prompt={data.prompt} />
            ))}
            {hasNextPage && (
                <>
                    <div
                        className="aspect-[0.9] size-full animate-pulse rounded-xl bg-muted"
                    />
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div ref={ref}
                            key={idx}
                            className="">

                            <Skeleton
                                className="aspect-[0.9] size-full rounded-xl"
                            />
                        </div>
                    ))}
                </>
            )}
        </section>
    )
}
)

ImageGrid.displayName = "ImageGrid"

export default ImageGrid