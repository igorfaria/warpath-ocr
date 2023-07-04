
import Jimp from 'jimp'
import { createWorker } from 'tesseract.js'


const ImageOCR = async (filename, lang = 'por', type = 'image/jpeg') => {
    if(!filename) return false
	
	
	const worker = await createWorker({
	//  logger: m => console.log(m),
	  corePath: './node_modules/tesseract.js-core',
	  workerPath: './node_modules/tesseract.js/src/worker-script/node/index.js',
	})

	
	await worker.loadLanguage(lang)
	await worker.initialize(lang)
	

	await worker.setParameters({
		tessedit_char_whitelist: '._-0@ABCDEFGHJILMNOPQRSTUVXZYKWÇãõÃÕabcdefghijlmnopqrstuvxzywkçÇ123456789#$% ',
	})

	const recognize = async function(){

		const image = await  Jimp.read(filename)
		
		image.contrast(0.2)
		image.threshold({ max: 120, replace: 150, autoGreyscale: true})
		image.contrast(0.05)
		image.normalize()
		image.scale(2)
		
		const {width, height} = image.bitmap
	
		const bs64 = await image.getBase64Async(type)
		
		const height_part = Math.floor(height / 3)
		const width_part = width * 0.975

		const ret1 = await worker.recognize(bs64, {
			rectangle: { top: height_part * .5, left: width_part * .3, width: width_part - (width_part * .3), height: height_part }
		})
		
		const ret2 = await worker.recognize(bs64, {
			rectangle: { top: height_part, left: 0, width: width_part, height: height_part }
		})
		
		const ret3 = await worker.recognize(bs64, {
			rectangle: { top: height_part * 2, left: 0, width: width_part, height: height_part }
		})
		
		let txt_content = ret1.data.text + '\n'
			txt_content += ret2.data.text + '\n'
			txt_content += ret3.data.text
		
		txt_content = txt_content.split('\n').filter( line =>
		{
			return line.length > 5
		})
		
		let is_front_profile = false

		const final_content = txt_content.map( (item, idx)  => {

			if(!is_front_profile && item.match(/online id/gi)){
				is_front_profile = true
			}
			return			
		})
		
		let arr_fmt = {}

		const txt_string = txt_content.join('\n')

		if(is_front_profile) {
		
			let modern_kills = txt_content[txt_content.length-1].replace(/k/gi, '').split(' ');
			modern_kills = (parseInt(modern_kills[0]) + parseInt(modern_kills[1]));
			
			if(!modern_kills) modern_kills = 0
			
			const auid = txt_string.match(/.+id.+([\d]+)/i)?.join('').replace(/[^\d]/g, '')
			const apower = txt_string.match(/power.+([.\d+\w{1}]+)/i)?.join('').replace(/([^\.0-9]+)/gi, '').toUpperCase()
			const akills = txt_string.match(/kills.+([\.\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			
			arr_fmt = {
				'uid' : auid ? auid : '', 
				'name': txt_content[1].split(' ').filter( l => {
					return l.length > 3
				}).join(' ').trim() , 
				'power' : apower ? `${apower}M` : 0, 
				'kills': akills ? akills : 0, 
				'modern_kills': modern_kills ? `${modern_kills}k` : 0,
				'image': filename,
			}
		
		} else {
			
			const aatp = txt_string.match(/time.+power.+([\.\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			const alost = txt_string.match(/lost.+([\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			const acollected = txt_string.match(/collected.+([\.\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			const acontribution = txt_string.match(/contributions.+([\.\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			const aassisted = txt_string.match(/assists.+([\.\d+\w{1}]+)/i)?.join('').replace(/([^\.km0-9]+)/gi, '').toUpperCase()
			
			arr_fmt = {
				'name': txt_content[0].split(' ').filter( l => { 9
					return l.length > 2
				}).join(' '), 
				'atp': aatp ? aatp : 0, 
				'lost': alost ? alost : 0, 
				'collected': acollected ? acollected : 0, 
				'contributions': acontribution ? acontribution : 0, 
				'assists': aassisted ? aassisted : 0, 
				'aditional': filename,
			}
		
		}

        await worker.terminate();
		arr_fmt.text = txt_content
		return arr_fmt
	}

    return recognize()

}
 
export default ImageOCR