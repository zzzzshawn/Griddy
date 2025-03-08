"use client"

import React from "react"
import Image from "next/image"

import { CheckIcon, Copy, Download, Share2 } from "lucide-react"

import { cn, getIdFromUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useImageStore } from "@/store/use-image"
import { useToast } from "@/hooks/use-toast"

interface ImageCardProps {
  imgUrl: string | null
  prompt: string | null
  isShareable?: boolean
  truncate?: boolean
  blob?: boolean
}

export function ImageCard({
  blob,
  imgUrl,
  prompt,
  isShareable = false,
  truncate = true,
}: ImageCardProps) {
  const { setData } = useImageStore()
  const [hasCheckIcon, setHasCheckIcon] = React.useState(false)
  const [isImageLoading, setIsImageLoading] = React.useState(true)
  const { toast } = useToast()

  function onCopy() {
    void navigator.clipboard.writeText(prompt ?? "")
    setHasCheckIcon(true)

    setTimeout(() => {
      setHasCheckIcon(false)
    }, 1000)
  }

  let isSharing = false

  async function onShare() {
    if (isSharing) return
    if (!imgUrl) return alert("No image url found!")

    isSharing = true

    try {
      let blobData: Blob

      if (blob) {
        const response = await fetch(imgUrl)
        blobData = await response.blob()
      } else {
        const response = await fetch(`/download/${getIdFromUrl(imgUrl)}`)
        blobData = await response.blob()
      }

      const filesArray = [
        new File([blobData], "griddy.jpg", {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        }),
      ]

      await navigator.share({
        files: filesArray,
      })
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Lol try again",
        description: "Skill issue frfr"
      });
    } finally {
      isSharing = false
    }
  }

  async function onDownload() {
    if (!imgUrl) return alert("No image url found!");

    try {
      let blobData: Blob;

      if (blob) {
        const response = await fetch(imgUrl);
        blobData = await response.blob();
      } else {
        const response = await fetch(`/download/${getIdFromUrl(imgUrl)}`);
        blobData = await response.blob();
      }

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;
      link.download = "griddy.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading:", error);
      toast({
        title: "Lol try again",
        description: "Skill issue frfr"
      });
    }
  }

  return (
    <div className=" w-full aspect-square gap-1.5 rounded-xl relative flex flex-col p-0.5 flex-shrink">

      {imgUrl && (
        <div
          className="aspect-[1] size-full cursor-pointer select-none border rounded-2xl p-0.5 relative  bg-dark-2/20 backdrop-blur-md backdrop-saturate-100"
          onClick={() => {
            setData({
              prompt,
              imageUrl: imgUrl,
            })
          }}
        >
          <Image
            alt={prompt ?? "image"}
            src={imgUrl}
            loading="lazy"
            width={1000}
            height={1000}
            unoptimized
            className={cn(
              "pointer-events-none size-full rounded-xl object-cover object-top",
              {
                "blur-md": isImageLoading,
              },
            )}
            onLoad={() => setIsImageLoading(false)}
          />

          <div className="absolute px-1.5 rounded-xl w-full bottom-1.5 left-1/2 -translate-x-1/2 cursor-auto">
            <div className="relative p-0.5 rounded-xl backdrop-blur-md backdrop-saturate-100 bg-neutral-900/30">
              <div className="relative p-0.5 px-1.5 rounded-xl flex flex-col sm:gap-0.5">
                <div className="flex items-center justify-between gap-0.5">

                  <p className="max-sm:text-xs text-white">Prompt</p>
                  <Button
                    size={"icon"}
                    title="Copy to clipboard"
                    className="size-6 bg-transparent hover:!bg-transparent shadow-none outline-none"
                    onClick={onCopy}

                  >
                    {hasCheckIcon ? (
                      <CheckIcon className="!size-3 text-white" />
                    ) : (
                      <Copy className="!size-3 text-white" />
                    )}
                  </Button>
                </div>
                <p className={cn("max-sm:text-xs", { truncate: truncate })}>{prompt}</p>

              </div>
            </div>
          </div>
        </div>
      )}



      {imgUrl && isShareable && (
        <div className="flex items-center justify-center gap-1 text-gray-600 border rounded-xl row-start-1 row-end-3 p-0.5  bg-dark-2/20 backdrop-blur-md backdrop-saturate-100">
          <Button
            variant={"ghost"}
            size={"icon"}
            title="Download"
            className="animate-jelly w-full border rounded-xl bg-dark-2"
            onClick={onDownload}
          >
            <Download className="!size-4 text-white" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            title="Share"
            className="animate-jelly w-full border rounded-xl bg-dark-2"
            onClick={onShare}
          >
            <Share2 className="!size-4 text-white" />
          </Button>

        </div>
      )}




    </div>
  )
}
