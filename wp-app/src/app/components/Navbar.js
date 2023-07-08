'use client'
import './styles/Navbar.css'

const Navbar = ({items}) => {
    return (
        <section id='navbar'>
            <ul>
                {items.map(item => {
                    return (
                        <li key={item.label}>
                            <button 
                                type='button'
                                onClick={item.onClick}
                            >
                                <span>{item.icon}</span>
                                <label>{item.label}</label>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default Navbar