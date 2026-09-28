import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

import usePersist from '../../hooks/usePersist'

const Login = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, password])
    const errClass = errMsg ? "errmsg" : "offscreen"

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response')
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(err.data?.message)
            }
            errRef.current.focus()
        }
    }

    if (isLoading) return <p>Loading...</p>

    const content = (
        <main className="main-centre">
            <h1 className='centre'>User Login</h1>
            <p ref={errRef} className='errClass' aria-live="assertive">{errMsg}</p>
            <form action="" method="post">
                <label htmlFor="login-form-input">Username:</label>
                <input
                    className="login-form-input"
                    id="login-form-input"
                    type="text"
                    ref={userRef}
                    value={username}
                    onChange={handleUserInput}
                    autoComplete='off'
                    required
                />
                <label htmlFor="login-form-input">Password:</label>
                <input
                    className="login-form-input"
                    id="login-form-input"
                    type="text"
                    value={password}
                    onChange={handlePwdInput}
                    required
                />
                <button type="submit" onClick={handleSubmit}>Log in</button>
                <label htmlFor="persist" className='login-form-persist'>
                    <input type="checkbox"
                        className='login-form-checkbox'
                        id="persist"
                        onChange={handleToggle}
                        checked={persist}
                    />
                    Trust This Device
                </label>
            </form>
        </main>

    )

    return content
}

export default Login