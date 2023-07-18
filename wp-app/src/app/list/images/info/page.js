import Player from "@/app/components/Player"

export default async function ListInfo() {
 
    const player = new Player()
    const users = await player.getUsers()

    users.forEach ( async user => {
        const data ={...user.info_profile, ...user.info_stats}
        //console.log(data)
        await player.update( data )
    })

    return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {typeof users != 'object'
        ? ''
        : users.map( ( user, idx ) => {
            return (<div className="flex mb-20" style={ {whiteSpace: 'pre'} } key={idx}>{JSON.stringify( {...user.info_profile, ...user.info_stats}, null, 4)}</div>)
        })}
    </main>
  )
}
