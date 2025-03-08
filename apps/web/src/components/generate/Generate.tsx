'use client'
import React, { useEffect, useState } from 'react'
import { GenerateInput } from '../ui/input'
import { api } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { ImageCard } from '../ImageGrid/ImageCard'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface GenerateProps {
    onSuccess: () => void;
}

const Generate = ({ onSuccess }: GenerateProps) => {
    const [prompt, setPrompt] = useState('')
    const [imgPrompt, setImgPrompt] = useState('')

    const [imageSrc, setImageSrc] = useState<string | null>('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isButtonOpen, setIsButtonOpen] = useState(false)


    const generateImage = async (prompt: string) => {
        const response = await api.generate.$post({
            json: {
                prompt
            }
        })
        if (!response.ok) {
            const errorMessage = await response.text()
            console.error('Error generating image:', errorMessage)
            throw new Error(errorMessage)
        }
        const image = await response.blob();
        const imageUrl = URL.createObjectURL(image)
        return imageUrl
    }

    const mutation = useMutation({
        mutationFn: generateImage,
        onMutate: () => {
            setIsGenerating(true)
        },
        onSuccess: (imageUrl) => {
            setImageSrc(imageUrl);
            setIsGenerating(false);
            onSuccess();
        },
        onError: (error) => {
            console.error('Error generating image:', error)
            setIsGenerating(false)
        }
    })

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (prompt.length > 0) {
                setImageSrc(null)
                mutation.mutate(prompt)
                setImgPrompt(prompt)
            }
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const generateInput = document.getElementById('generate-input');

            if (generateInput && !generateInput.contains(target)) {
                setIsButtonOpen(false);
            } else if (generateInput && generateInput.contains(target)) {
                setIsButtonOpen(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (


        <motion.div
            id="generate-input"
            layout
            className="flex flex-col gap-2 w-full z-50  "
        >

            <motion.div layout>
                {imageSrc && isButtonOpen ? (

                    <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-2xl">
                        <ImageCard
                            imgUrl={imageSrc}
                            prompt={imgPrompt}
                            isShareable={true}
                            truncate={false}
                            blob={true}
                        />

                    </div>

                ) : isGenerating && isButtonOpen && (
                    <div className="size-full aspect-square border rounded-2xl p-0.5">
                        <div className="flex size-full flex-col items-center justify-center gap-4 border rounded-xl">
                            <span className="flex items-center gap-1 justify-center text-center text-white">
                                <Loader2 className="size-4 animate-spin" />
                                Generating...
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div className="flex p-0.5 rounded-2xl border gap-1 h-11 backdrop-blur-md backdrop-saturate-100">

                {isButtonOpen && (
                    <motion.div
                        key="input-field"
                        className="w-full h-full"

                    >
                        <GenerateInput
                            autoFocus
                            placeholder="Type your prompt here"
                            className="border rounded-xl w-full "
                            isLoading={false}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            minLength={1}
                        />
                    </motion.div>

                )}
                {isButtonOpen && (
                    <motion.button
                        onClick={() => {
                            if (prompt.length > 0) {
                                setImageSrc(null)
                                mutation.mutate(prompt)
                                setImgPrompt(prompt)
                            }
                        }}
                        className="backdrop-blur-md backdrop-saturate-100 px-3 py-1 w-max border rounded-xl"
                    >
                        Generate
                    </motion.button>

                )}



                {
                    !isButtonOpen && (
                        <motion.button
                            onClick={() => {
                                setIsButtonOpen(true);

                            }}
                            className="backdrop-blur-md backdrop-saturate-100 px-3 py-1 w-max border rounded-xl"
                        >
                            Generate
                        </motion.button>
                    )
                }
            </motion.div>
        </motion.div>


    )
}

export default Generate