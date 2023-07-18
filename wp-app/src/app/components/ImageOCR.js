import Jimp from 'jimp'
import { createWorker } from 'tesseract.js' 

const ImageOCR = async (filename, lang = 'por+eng', type = 'image/jpeg', waitForIt = false) => {
	if (!filename) return false

	const worker = await createWorker({
		//  logger: m => console.log(m),
		corePath: './node_modules/tesseract.js-core',
		workerPath: './node_modules/tesseract.js/src/worker-script/node/index.js',
		// Path to the directory containing language data files
		tessdata: 'app/traindata'
	})


	await worker.loadLanguage(lang)
	await worker.initialize(lang)

	const recognize = async function () {

		const image = await Jimp.read(filename)

		image.contrast(0.2)
		image.threshold({ max: 130, replace: 200, autoGreyscale: false })
		image.normalize()

		const { width, height } = image.bitmap

		const bs64 = await image.getBase64Async(Jimp.MIME_PNG)

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

		let txt_content = [ret1.data.text, ret2.data.text, ret3.data.text].join('\n')

		txt_content = txt_content.split('\n').filter(line => {
			return line.length > 5
		})

		let is_front_profile = false
		txt_content.map((item, idx) => {
			if (!is_front_profile && item.match(/o[nm]lin/gi)) {
				is_front_profile = true
			}
			return
		})

		let arr_fmt = {}

		const row_text = txt_content.join('\n')

		const ProcessName = (name) => {
			return name.split(' ').filter(l => {
				return l.length > 3
			}).join(' ')
			.trim()
		}
		if (is_front_profile) {

			let modern_kills = txt_content[txt_content.length - 1].match(/.+?\s?(?<m1>[\.\d]+).+?\s?(?<m2>[\.\d]+)/i)
			if(modern_kills && 'groups' in modern_kills && 'm1' in modern_kills.groups) {
				let mk = modern_kills.groups.m1 
					? modern_kills.groups.m1 
					: 0
				if('m2' in modern_kills.groups && modern_kills.groups.m2) modern_kills = mk + ' ' + modern_kills.groups.m2
				modern_kills = `${mk}k`
			} 
			if (!modern_kills) modern_kills = 0 

			let uid = row_text.match(/.+[i1]d.+?\s?(?<uid>[0-9]+)/i)
				uid = (uid && 'groups' in uid) ? uid.groups.uid.replace(/[^\d]/gi, '') : null
			
			let power = row_text.match(/p.wer.+?\s?(?<power>[\.\d+]+)(?<unit>[km]{1})/i)
			if(power && 'groups' in power && 'power' in power.groups) {
				power = power.groups.power + ('unit' in power.groups ? power.groups.unit.toUpperCase() : 'M')
			} else {
				power = 0
			}
			
			let kills = row_text.match(/kills.+?\s?(?<kills>[\.\d+]+)(?<unit>[km]+)/i)
			if(kills && 'groups' in kills && 'kills' in kills.groups) {
				kills = kills.groups.kills + ('unit' in kills.groups ? kills.groups.unit.toLowerCase() : 'k')
			} else {
				kills = 0
			}

			arr_fmt = {
				'uid': uid ? uid : '',
				'name': ProcessName(txt_content[1]),
				'power': power ? power : 0,
				'kills': kills ? kills : 0,
				'modern_kills': modern_kills ? modern_kills : 0,
				'image': filename,
			}

		} else {

			let atp = row_text.match(/time.+power.+?\s?(?<atp>[\.\d+]+)(?<unit>[km]+)/i)
			if(atp && 'groups' in atp && 'atp' in atp.groups) {
				atp = atp.groups.atp + ('unit' in atp.groups ? atp.groups.unit.toUpperCase() : 'K')
			} else {
				atp = 0
			}
					
			let lost = row_text.match(/lost.+?\s?(?<lost>[\.\d+]+)(?<unit>[km]+)/i)
			if(lost && 'groups' in lost && 'lost' in lost.groups) {
				lost = lost.groups.lost + ('unit' in lost.groups ? lost.groups.unit.toUpperCase() : 'K')
			} else {
				lost = 0
			}
			
			let collected = row_text.match(/collected.+?\s?(?<collected>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(collected && 'groups' in collected && 'collected' in collected.groups) {
				collected = collected.groups.collected + ('unit' in collected.groups ? collected.groups.unit.toUpperCase() : 'K')
			} else {
				collected = null
			}
			
					
			let contributed = row_text.match(/contributed.+?\s?(?<contributed>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(contributed && 'groups' in contributed && 'contributed' in contributed.groups) {
				contributed = contributed.groups.contributed + ('unit' in contributed.groups ? contributed.groups.unit.toUpperCase() : 'B')
			} else {
				contributed = null
			}
			
			let assisted = row_text.match(/assisted.+?\s?(?<assisted>[\.\d+]+)(?<unit>[kmb]+)/i)
			if(assisted && 'groups' in assisted && 'assisted' in assisted.groups) {
				assisted = assisted.groups.assisted +  ('unit' in assisted.groups ? assisted.groups.unit : 'B')
			} else {
				assisted = null
			}

			arr_fmt = {
				'name': ProcessName(txt_content[0]),
				'atp': atp,
				'lost': lost,
				'collected': collected,
				'contributed': contributed,
				'assisted': assisted,
				'additional': filename,
			}

		}
   
		let new_name = filename.replace('images/', 'images/processed/_')
			image.write(new_name)

		arr_fmt.processed = new_name
		arr_fmt.type = is_front_profile ? 'profile' : 'additional'	

		await worker.terminate();
		arr_fmt.text = txt_content.join('\n').replace(/([\"\t]+)/g,'')
		
		return arr_fmt
	}

	return await recognize()

}

export default ImageOCR