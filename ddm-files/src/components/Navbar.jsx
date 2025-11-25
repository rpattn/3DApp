// NavBar.js
import { SignOutForm } from './sign-out-form';

const Navbar = ({appVersion, userName}) => {
    return (
        <nav className='navbar'>
            <ul className='w-full max-w-screen-2xl mx-auto'>
                <li><p></p></li>
                <li>Digital Design Manager: Demo <span style={{fontSize: "small", color: "gray"}}>(V{appVersion})</span></li>
                <div className='right top-0 right-0 relative m-auto mr-0'>
                    <SignOutForm />
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;