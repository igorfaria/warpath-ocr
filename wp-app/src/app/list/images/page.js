import Image from 'next/image'
import Images from '@/app/components/Images'
import ImagePreview from '@/app/components/ImagePreview'

export default async function ListImages() {
 
    let images = await Images()
        images = images.flatMap ( filepath => {
          const public_path = filepath.replace('./public/', '/')
          return [public_path, public_path.replace('images/', 'images/proccessed/_')]
        })
    
    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {<ImagePreview images={images} />}
    </main>
  )
}
