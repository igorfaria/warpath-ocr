const TableUsers = ({users, action}) => {

  if(typeof users != 'object'){
    return (<pre>No valid users list :(</pre>)
  }

  if(users.length == 0) {
    return (<div className="page-title"><code>Loading the data lol...</code></div>)
  }

  const handleEdit = (uid) => {
    const line = document.querySelector(`tr#tr${uid}`)
    console.log(line)
    console.log('Edit', uid)
  }
  const handleDelete = (uid) => {
    if( !confirm('Are you sure you want to delete this playa?') ) return false
    console.log('Delete', uid)
  }

  return(<table className='table-user text-sm font-light'>
    <thead>
       <tr key='header' className='table-header'>
        {action && action == 'edit' 
        ? (<td hey='h10' scope="col">Actions</td>)
        : ''}
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
       <tr key={ `tr${row.uid}`} id={ `tr${row.uid}`}>
         {action && action == 'edit' 
        ? (<td key={ `actions${row.uid}` }  scope="col">
          <button type='button' onClick={ () => handleEdit(row.uid)}>Edit</button>
          <button type='button' onClick={ () => handleDelete(row.uid)}>Delete</button>
        </td>)
        : ''}
         <td key={ `uid${row.uid}`}>{row.uid}</td>
         <td key={`name${row.name}`}>{row.name}</td>
         <td key={`power${row.power}`}>{row.power}</td>
         <td key={`atp${row.atp}`}>{row.atp}</td>
         <td key={`kills${row.kills}`}>{row.kills}</td>
         <td key={`mkills${row.modern_kills}`}>{row.modern_kills}</td>
         <td key={`lost${row.lost}`}>{row.lost}</td>
         <td key={`col${row.collected}`}>{row.collected}</td>
         <td key={`con${row.contributed}`}>{row.contributed}</td>
         <td key={`ass${row.assisted}`}>{row.assisted}</td>
       </tr>
       )
     })}
     </tbody>
   </table>)
}

export default TableUsers