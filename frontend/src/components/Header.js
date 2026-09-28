import React from 'react';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { useRefreshMutation } from '../features/auth/authApiSlice';
import { selectCurrentToken } from '../features/auth/authSlice';

const Header = () => {

    const { username, userId } = useAuth()
    const token = useSelector(selectCurrentToken);
    const [refresh, { refresIsLoading, refresIsError }] = useRefreshMutation();

    useEffect(() => {
        if (!token) {
            // Attempt to refresh the token if none exists
            refresh().catch((err) => console.error('Error refreshing token:', err));
        }
    }, [token, refresh]);

    const navigate = useNavigate()
    /* const { pathname } = useLocation() */

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    if (isLoading) return <p>Logging Out...</p>
    if (isError) return <p>Error: {error.data?.message}</p>

    const headerButtons = () => {
        if (refresIsLoading) {
            return <p>Loading...</p>;
        }
        if (refresIsError) {
            return (
                <div>
                    <p>Error logging in. Please refresh the page.</p>
                </div>
            );
        }
        if (username) {
            return (
                <div className="header-menu">
                    <button className='header-menu button' id="add-listing-button"><Link to={`/users/${userId}`} >My Profile</Link></button>
                    <button className='header-menu button' id="add-listing-button"><Link to={'/listings'} >Add Listing</Link></button>
                    <button className="header-menu button" title='Logout' onClick={sendLogout} >Logout</button>
                </div>
            )
        } else {
            return (
                <div className="header-menu">
                    <button className='header-menu button' id="login-button"><Link to={'/login'} >Log In</Link></button>
                    <button className='header-menu button' id="create-account-button"><Link to={'/register'} >Create Account</Link></button>
                </div>
            )
        }
    }


    /* let headerClass = null */

    return (
        <header>
            <nav>
                <div className="logo">
                    <Link to="/" >
                        AUDIO4HIRE
                    </Link>
                </div>
                {headerButtons()}
            </nav>
        </header>
    )
}

export default Header