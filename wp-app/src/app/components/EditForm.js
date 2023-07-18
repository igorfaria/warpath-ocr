import { useEffect } from "react"
import Image from "next/image"
import axiosQueue from "../axiosQueue"

const EditForm = ({ users }) => {
  
  useEffect( () => {
    let value_focus = '' 
    const inputs = document.querySelectorAll('input')
    inputs.forEach( ( input )  => {

        let timeOutUpdate = null
        input.addEventListener('focus', (e) => {
          value_focus = input.value
          clearTimeout(timeOutUpdate)
        })

        input.addEventListener('blur', (e) => {
          const value_blur = input.value
          if(value_focus != value_blur) {
              timeOutUpdate = setTimeout(() => updatePlayer(input.form), 1000)
          } 
        })
    })
  }, [])

  const updatePlayer = (form) => {
    console.log('update')
    const inputs = form.querySelectorAll('input')
    const buttons = form.querySelectorAll('button')
    buttons.forEach( (button) => button.style = 'pointer-events: none')
    if(inputs && inputs.length) {
      const formData = new FormData()
      
      inputs.forEach( ( input ) => {
        formData.append(input.name, input.value)
      })
      try {
         axiosQueue.post('/api/update', formData).then( () => {
          input.style.background = 'green'
          input.style.color = 'white'

          setTimeout( () => {
              input.style.background = ''
              input.style.color = ''
          }, 1500)
         })
      } catch (err) {
        console.log('Error EditForm', err)
      }
    }
    buttons.forEach( (button) => button.style = '')
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      updatePlayer(e.target)
      return false
  }
  if(typeof users != 'object' || users.length == 0) {
    return (<div className="page-title" key={'page-title'}><code>Loading the data lol...</code></div>)
   }

  return (
    <div className='editForm'>
      {users.map( (user, idx) => {
        if(!'uid' in user || !user.uid) return (<div key={`nope_${idx}`}></div>) 
       return (<form 
                onSubmit={handleSubmit}
                className="flex flex-col" 
                key={`form${idx}${user.id}`}>
          <div key={`h0${idx}`} scope="col">
            <label htmlFor={`uid_${user.uid}`}>UID</label>
             <input type='text' name='uid' id={`uid_${user.uid}`} readOnly={true} defaultValue={`${user.uid}`} />
          </div>
          <div key={`dh1${idx}`} className='wrapper-double'>
            <div key='h1' scope="col">
                <label htmlFor={`name_${user.name}${user.uid}`}>Name</label>
                 <input   required type='text' id={`name_${user.name}${user.uid}`} name='name' defaultValue={`${user.name}`} />
            </div>
            <div key='h2' scope="col">
                <label htmlFor={`power_${user.power}${user.uid}`}>Power</label>
                 <input   required type='text' id={`power_${user.power}`} name='power' defaultValue={`${user.power}`} />
            </div>
          </div>

          <div key={`dh2${idx}`} className='wrapper-double'>
            <div key='h3' scope="col">
                <label htmlFor={`atp_${user.atp}${user.uid}`}>ATP</label>
                 <input   required type='text' id={`atp_${user.atp}${user.uid}`} name='atp' defaultValue={`${user.atp}`} />
            </div>
            <div key='h4' scope="col">
                <label htmlFor={`kills_${user.kills}${user.uid}${user.uid}`} >Kills</label>
                 <input   required type='text' id={`kills_${user.kills}${user.uid}${user.uid}`} name='kills' defaultValue={`${user.kills}`} />
            </div>
          </div>

          <div key={`dh4${idx}`} className='wrapper-double'>
            <div key='h5' scope="col">
                <label htmlFor={`mkills_${user.modern_kills}${user.uid}`}>Modern Kills</label>
                 <input   required type='text' id={`mkills_${user.modern_kills}${user.uid}`} name='mkills' defaultValue={`${user.modern_kills}`} />
            </div>
            <div key='h6' scope="col">
                <label htmlFor={`lost_${user.lost}${user.uid}`}>Lost</label>
                 <input   required type='text' id={`lost_${user.lost}${user.uid}`} name='lost' defaultValue={`${user.lost}`} />
            </div>
          </div>

          <div key={`dh5${idx}`} className='wrapper-double'>
            <div key='h7' scope="col">
                <label htmlFor={`resources_${user.collected}${user.uid}`}>Resources</label>
                 <input   required type='text' htmlFor={`resources_${user.collected}${user.uid}`} name='resources' defaultValue={`${user.collected}`} />
            </div>
            <div key='h8' scope="col">
                <label htmlFor={`tech_${user.contributed}${user.uid}`}>Tech</label>
                 <input readOnly={false}   required type='text' id={`tech_${user.contributed}${user.uid}`} name='tech' defaultValue={`${user.contributed}`} />
            </div>
        </div>
        
        <div key={`dh6${idx}`} className='wrapper-double'>
          <div key='h9' scope="col">
            <label htmlFor={`tech_${user.assisted}${user.uid}`}>Assists</label>
             <input   required type='text' id={`tech_${user.assisted}${user.uid}`} name='assists' defaultValue={`${user.assisted}`} />
          </div>
          <div key='actions' scope="col" className='actions'>

                <div key='isave' scope="col"> 
                    <button type='submit' 
                    className="btn save w-100">Save</button>
                </div>
           </div>
          </div>

          <div key={`dh7${idx}`} className='wrapper-double'>
            <div key='h9' scope="col">
                {user.image 
                ? <Image src={user.image.replace('public/', '/')} width={500} height={500} alt='Image' style={{ width: '100%', height: 'auto' }} />
                : ''}
            </div>
            <div key='h10' scope="col">
                 {user.additional 
                ? <Image src={user.additional.replace('public/', '/')} width={500} height={500} alt='Aditional' style={{ width: '100%', height: 'auto' }} />
                : ''}   
            </div>
        </div>
        </form>
          )
      })}
    </div>
  )
}

export default EditForm