import GetFiles from '@/app/components/GetFiles'

const Images = async (index = 1, quantity = 9999999) => {
    const images = await GetFiles('./public/images')
    const start = (index-1) * quantity
    const end = start + (quantity - 1)
    return images.slice(start, end)
}

export default Images