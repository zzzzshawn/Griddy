'use client'

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string | undefined) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                setSearchQuery(undefined);
                onSearch(undefined);
                return;
            }

            if (searchInput && !searchInput.contains(target)) {
                setIsSearchOpen(false);
                setSearchQuery(undefined);
                onSearch(undefined);
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
    }, [onSearch]);

    useEffect(() => {
        onSearch(searchQuery);
    }, [searchQuery, onSearch]);

    if (!isMounted) return null;

    return (
        <motion.div
            layout
            initial={{
                opacity: window.innerWidth > 640 ? 1 : 0,
                y: window.innerWidth > 640 ? 0 : 20
            }}
            animate={{
                opacity: isSearchVisible ? 1 : 0,
                y: isSearchVisible ? 0 : 20
            }}
            className={`fixed z-30 bottom-7 rounded-2xl backdrop-blur-md backdrop-saturate-100 bg-zinc-800/20 border border-white/20 ${isSearchOpen ? "p-0.5" : "p-3"}`}
        >
            {!isSearchOpen && (
                <Search
                    className="size-6 text-white cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                />
            )}
            {isSearchOpen && (
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
            )}
        </motion.div>
    );
}; 