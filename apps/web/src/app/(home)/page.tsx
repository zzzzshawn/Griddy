'use client'
import Generate from '@/components/generate/Generate'
import ImageGrid from '@/components/ImageGrid/ImageGrid';
import { api } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react'
import { useInView } from "react-intersection-observer"


const Home = () => {
  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const fetchImages = async ({pageParams}: {pageParams?: number}) => {
    const response = await api.images.$get({
      query: {
        query: searchQuery,
        cursor: String(pageParams)
      }
    })

    const result = await response.json()
    return result;
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["IMAGES", searchQuery],
    queryFn: ({ pageParam }) => fetchImages({ pageParams: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage * 10 < lastPage.count ? nextPage + 1 : undefined;
    }
  })

  useEffect(()=> {
    if( inView && hasNextPage){
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const images = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) =>
          page.data.map((image: { id: string; prompt: string }) => ({
            url: `https://pub-90b2ed77c2ed41b5854982ffe788d376.r2.dev/images/${image.id}.jpeg`,
            prompt: image.prompt,
          })),
        ) || []
    )
  }, [data])

  console.log(images)

  return (
    <main className='flex flex-col items-center justify-center min-h-screen w-full max-w-6xl border mx-auto'>
        <Generate/>
        <ImageGrid 
          images={images}
          hasNextPage={hasNextPage}
        />
    </main>
  )
}

export default Home