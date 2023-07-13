const TableUsers = ({users}) => {

  if(typeof users != 'object'){
    return (<pre>No valid users list :(</pre>)
  }

  if(users.length == 0) {
    return (<div className="page-title"><code>Loading the data lol...</code></div>)
  }

  return(<table className='table-user text-sm font-light'>
    <thead>
       <tr key='header' className='table-header'>
         <td hey='h0' scope="col">UID</td>
         <td hey='h1' scope="col">Name</td>
         <td hey='h2' scope="col">Power</td>
         <td hey='h3' scope="col">ATP</td>
         <td hey='h4' scope="col">Kills</td>
         <td hey='h5' scope="col">Modern</td>
         <td hey='h6' scope="col">Lost</td>
         <td hey='h7' scope="col">Resources</td>
         <td hey='h8' scope="col">Tech</td>
         <td hey='h9' scope="col">Assists</td>
     </tr>
     </thead>
     <tbody>
     {users.map( (row, idx) => {
       return (
       <tr key={ `tr${row.uid}`}>
         <td key={ `uid${row.uid}`}>{row.uid}</td>
         <td key={`name${row.name}`}>{row.name}</td>
         <td key={`power${row.power}`}>{row.power}</td>
         <td key={`atp${row.atp}`}>{row.atp}</td>
         <td key={`kills${row.kills}`}>{row.kills}</td>
         <td key={`mkills${row.mkills}`}>{row.mkills}</td>
         <td key={`lost${row.lost}`}>{row.lost}</td>
         <td key={`col${row.collected}`}>{row.collected}</td>
         <td key={`con${row.contributions}`}>{row.contributions}</td>
         <td key={`ass${row.assists}`}>{row.assists}</td>
       </tr>
       )
     })}
     </tbody>
   </table>)
}

export default TableUsers