'use client'
import Generate from '@/components/generate/Generate'
import Hero from '@/components/Hero/Hero';
import ImageGrid from '@/components/ImageGrid/ImageGrid';
import { api } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from "react-intersection-observer"
import { LayoutGroup, motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';


const Home = () => {
  const { ref, inView } = useInView();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const debounceQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 640) {
        setIsSearchVisible(window.scrollY > 100);
      } else {
        setIsSearchVisible(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchImages = useCallback(
    async ({ pageParams }: { pageParams?: number }) => {
      const response = await api.images.$get({
        query: {
          query: debounceQuery,
          cursor: String(pageParams)
        }
      })

      const result = await response.json()
      if (result.data.length === 0) {
        console.log("No images found")
      }
      return result;
    },
    [debounceQuery]
  )

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ["IMAGES", debounceQuery],
    queryFn: ({ pageParam }) => fetchImages({ pageParams: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage * 10 < lastPage.count ? nextPage + 1 : undefined;
    }
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const images = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) =>
          page.data.map((image: { id: string; prompt: string }) => ({
            url: `https://pub-fd21440a971545968d1aa765101f1c1e.r2.dev/apollo/images/${image.id}.jpeg`,
            prompt: image.prompt,
          })),
        ) || []
    )
  }, [data])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const searchInput = document.getElementById('search-input');

      if (e instanceof KeyboardEvent && e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); 
        setIsSearchOpen(true);
        return;
      }

      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery(undefined)
        return;
      }

      if (searchInput && !searchInput.contains(target)) {
        setIsSearchOpen(false);
        setSearchQuery(undefined)
      } else if (searchInput && searchInput.contains(target)) {
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, []);


  return (
    <main className='flex flex-col items-center gap-10 min-h-screen w-full border mx-auto bg-dark-2 relative font-grandstander p-5'>
      <LayoutGroup>

        <motion.div
          layout
          layoutId="container"

          className="z-30 mx-auto w-full max-w-6xl flex flex-col gap-10 items-center justify-center bg-zinc-800/20 backdrop-blur-2xl rounded-3xl backdrop-saturate-150 sm:p-20 max-sm:p-10 overflow-hidden max-sm:h-[95dvh]"
        >
          <motion.div layoutId="hero">
            <Hero />
          </motion.div>
          <motion.div layoutId="generate" className='z-20'>
            <Generate onSuccess={() => refetch()} />
          </motion.div>
          <span className="absolute pointer-events-none w-[16rem] aspect-square border bg-gradient-to-br from-white to-blue-200 blur-[2rem] -top-20 right-20 rotate-[30deg] z-0">
          </span>
          <span className="absolute pointer-events-none w-[16rem] aspect-square border bg-gradient-to-br from-white to-blue-200 blur-[2rem] -bottom-20 left-0 rotate-[45deg] z-0">
          </span>
        </motion.div>


        <motion.div layout className='w-full'>
          <ImageGrid
            ref={ref}
            images={images}
            hasNextPage={hasNextPage}
          />
        </motion.div>


        {isLoading && (
          <section className="grid w-full grid-cols-2 gap-2 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="aspect-[0.9] size-full rounded-xl"
              />
            ))}
          </section>
        )}


        <motion.div
          layout
          initial={{
            opacity: window?.innerWidth > 640 ? 1 : 0,
            y: window?.innerWidth > 640 ? 0 : 20
          }}
          animate={{
            opacity: isSearchVisible ? 1 : 0,
            y: isSearchVisible ? 0 : 20
          }}
          className={`fixed z-30 bottom-7 rounded-2xl backdrop-blur-md backdrop-saturate-100 bg-zinc-800/20 border border-white/20 ${isSearchOpen ? "p-0.5" : "p-3"}`}
        >
          {
            !isSearchOpen && (
              <Search
                className="size-6 text-white cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
            )
          }
          {
            isSearchOpen && (
              <Input
                autoFocus
                autoComplete="off"
                placeholder="Search for anything"
                id="search-input"
                spellCheck={false}
                className="h-12 w-[350px] rounded-xl backdrop-blur-xl backdrop-saturate-100 bg-zinc-800/10 text-sm border border-white/10"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value || undefined)}
              />
            )
          }
        </motion.div>

      </LayoutGroup>
    </main>
  )
}

export default Home   