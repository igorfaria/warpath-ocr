import FileUploadForm from './components/FileUploadForm'
import sqlLite from '@/app/components/sqlLite'

export default function Home() {
  sqlLite()
  const users = sqlLite(true).prepare(`SELECT * FROM players ORDER BY atp DESC`).all() 

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl lg:flex">
        
        <h1 className="top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Warpath LoL
        </h1>
      </div>
      <div className="mt-5 z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <FileUploadForm />
      </div>

    <div>
      <table className='table-user'>
        <tr className='table-header'>
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
          <td>Profile</td>
          <td>Informações</td>
        </tr>
        {users.map( (row, idx) => {
          return (
          <tr>
            <td>{idx}</td>
            <td>{row.uid}</td>
            <td>{row.name}</td>
            <td>{row.power}</td>
            <td>{row.atp}</td>
            <td>{row.kills}</td>
            <td>{row.mkills}</td>
            <td>{row.lost}</td>
            <td>{row.collected}</td>
            <td>{row.contributions}</td>
            <td>{row.assists}</td>
            <td><img src={row.image.replace('public/','')} /></td>
            <td><img src={row?.aditional?.replace('public/','')} /></td>
          </tr>)
        })}
      </table>
    </div>

    </main>
  )
}
