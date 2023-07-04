
const GetFiles = (dir = './') => { 
    const fs = require('fs')
    const getSortedFiles = async (dir) => {
        const files = await fs.promises.readdir(dir);
        
        return files
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time)
        .map(file => `${dir}/${file.name}`);
    }
    
    return Promise.resolve()
        .then(() => getSortedFiles(dir))
}

export default GetFiles