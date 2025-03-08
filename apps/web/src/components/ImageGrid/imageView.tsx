'use client'
import React from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { ImageCard } from "./ImageCard"
import { useImageStore } from "@/store/use-image"




export function ImageView() {
  const { data, setData } = useImageStore()
  const [isOpen, setIsOpen] = React.useState(
    !!data.imageUrl && !!data.prompt,
  )

  React.useEffect(() => {
    setIsOpen(!!data.imageUrl && !!data.prompt)
  }, [data.imageUrl, data.prompt])

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) {
      setTimeout(() => {
        setData({
          prompt: null,
          imageUrl: null,
        })
      }, 200)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex items-center justify-center p-10 bg-transparent font-grandstander border-none">
        {" "}
        <ImageCard
          imgUrl={data.imageUrl}
          prompt={data.prompt}
          isShareable={true}
          truncate={false}
        />
      </DialogContent>
    </Dialog>
  )
}
