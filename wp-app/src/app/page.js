import FileUploadForm from './components/FileUploadForm'
import sqlLite from '@/app/components/sqlLite'
import Image from 'next/image'

export default function Home() {
  sqlLite()
  const users = sqlLite(true).prepare(`SELECT * FROM players ORDER BY round(power) DESC`).all() 

  /* 
          <td>Profile</td>
          <td>Informações</td>
          

          
          <td>P</td>
          <td>I</td>
  */
  /*
        <td>
              <Image 
                src={row.image ? row.image.replace('public/','').replace('./','/') + '?' + Date.now().toString() : '/noimg.jpg'} 
                alt="Profile image"
                width={1800}
                height={1000}
              />
            </td>
            <td>
              <Image 
                src={row.aditional ? row.aditional?.replace('public/','').replace('./','/') + '?' + Date.now().toString() : '/noimg.jpg'} 
                alt="Stats image"
                width={1800}
                height={1000}
              />
            </td>
            <td>
              <Image 
                src={row?.image?.replace('public/','').replace('./','/').replace('/images/','/images/proccessed/_')} 
                alt="Stats image"
                width={1800}
                height={1000}
              />
            </td>
            <td>
              <Image
                src={row?.aditional?.replace('public/','').replace('./','/').replace('/images/','/images/proccessed/_')} 
                alt="Stats image"
                width={1800}
                height={1000}
              />
            </td>
  */
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <div key="div1" className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl lg:flex">
        
        <h1 className="top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Warpath LoL
        </h1>
      </div>
      <div key="div1" className="mt-5 z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <FileUploadForm />
      </div>

    <div>
      <table className='table-user'>
        <tr className='table-header' key="tr1">
          <td>ID</td>
          <td>UID</td>
          <td>Name</td>
          <td>Power</td>
          <td>ATP</td>
          <td>Kills</td>
          <td>Modern Kills</td>

          <td>Lost personal</td>
          <td>Resources</td>
          <td>Tech</td>
          <td>Assists</td>

        
        </tr>
        {users.map( (row, idx) => {
          return (
            <>
          <tr key={idx}>
            <td key={idx}>{idx}</td>
            <td key={row.uid}>{row.uid}</td>
            <td key={row.name}>{row.name}</td>
            <td key={row.power}>{row.power}</td>
            <td key={row.atp}>{row.atp}</td>
            <td key={row.kills}>{row.kills}</td>
            <td key={row.mkills}>{row.mkills}</td>
            <td key={row.lost}>{row.lost}</td>
            <td key={row.collected}>{row.collected}</td>
            <td key={row.contributions}>{row.contributions}</td>
            <td key={row.assists}>{row.assists}</td>
          </tr>
          <tr key={`${idx}${idx}`} className='tr-images'>
             <td colspan="11">
              <Image 
                  src={row.image ? row.image.replace('public/','').replace('./','/') + '?' + Date.now().toString() : '/noimg.jpg'} 
                  alt="Profile"
                  width={1800}
                  height={1000}
                />
                <Image 
                  src={row.aditional ? row.aditional?.replace('public/','').replace('./','/') + '?' + Date.now().toString() : '/noimg.jpg'} 
                  alt="Stats"
                  width={1800}
                  height={1000}
                />

              <Image 
                  src={row?.image?.replace('public/','').replace('./','/').replace('/images/','/images/proccessed/_')} 
                  alt="Profile"
                  width={1800}
                  height={1000}
                />
              <Image
                src={row?.aditional?.replace('public/','').replace('./','/').replace('/images/','/images/proccessed/_')} 
                alt="Stats"
                width={1800}
                height={1000}
              />
             </td>
             
          </tr>
          </>)
        })}
      </table>
    </div>

    </main>
  )
}
