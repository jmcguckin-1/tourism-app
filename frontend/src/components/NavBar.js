import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faUser, faBuilding} from '@fortawesome/free-solid-svg-icons';
import {NavLink} from 'react-router-dom';

function NavBar(){

    return (
        <div id='navbar'>
        <ul>
           <NavLink to='/bookings' className='navlink'><li><FontAwesomeIcon icon={faBuilding} className='icons'/> <br/> Hotels</li></NavLink>
           <NavLink to='/profile' className='navlink'><li><FontAwesomeIcon icon={faUser} className='icons' /> <br/> Profile</li></NavLink>
           <NavLink to='/flights' className='navlink'><li><FontAwesomeIcon icon={faPlane}  className='icons'/> <br/> Flights</li></NavLink>
        </ul>
        </div>
    );
}

export default NavBar;