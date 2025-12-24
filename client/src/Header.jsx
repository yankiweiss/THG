import logo from '../src/assets/logo.png'

function Header () {
    return (
        <>
        <img src={logo} alt="logo" style={{display: 'block', margin: '50px auto'}}/>
        </>
    )
}

export default Header