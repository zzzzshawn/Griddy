'use client'
import React, { useState } from 'react'
import { GenerateInput } from '../ui/input'
import { api } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'

const Generate = () => {
    const [prompt, setPrompt] = useState('')
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [isGenerating, setIsGenerating   ] = useState(false)

    const generateImage = async (prompt: string) => {
        const response = await api.generate.$post({
            json: {
                prompt
            }
        })
        if (!response.ok) {
            const errorMessage = await response.text()
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
            setIsGenerating(false)
        },
        onError: (error) => {
            console.error('Error generating image:', error)
            setIsGenerating(false)
        }
    })

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            mutation.mutate(prompt)
        }
    }

    return (
        <div>
            <GenerateInput
                autoFocus
                placeholder="Type your prompt here"
                className="rounded-lg"
                isLoading={false}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {imageSrc && (
                <Image src={imageSrc} alt="Generated" width={512} height={512} />
            )}

        </div>
    )
}

export default Generate