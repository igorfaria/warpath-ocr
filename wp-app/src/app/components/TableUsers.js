const TableUsers = ({users}) => {

  if(typeof users != 'object'){
    return (<pre>Not valid users</pre>)
  }

  if(users.length == 0) {
    return (<div className="page-title"><code>Loading the data lol...</code></div>)
  }

  return(<table className='table-user text-sm font-light'>
    <thead>
       <tr class='table-header'>          
         <td scope="col">ID</td>
         <td scope="col">UID</td>
         <td scope="col">Name</td>
         <td scope="col">Power</td>
         <td scope="col">ATP</td>
         <td scope="col">Kills</td>
         <td scope="col">Modern</td>
         <td scope="col">Lost</td>
         <td scope="col">Resources</td>
         <td scope="col">Tech</td>
         <td scope="col">Assists</td>
     </tr>
     </thead>
     <tbody>
     {users.map( (row, idx) => {
       return (
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
       )
     })}
     </tbody>
   </table>)
}

export default TableUsers