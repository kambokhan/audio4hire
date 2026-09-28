import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterUserMutation } from "../users/usersApiSlice"
const Register = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')

    const [registerUser, { isLoading }] = useRegisterUserMutation()

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setAvatar(base64)
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    const navigate = useNavigate()
    const onBackButtonClicked = (e) => {
        navigate('/')
        e.preventDefault()
    }

    const canSave = [username, email, password, avatar].every(Boolean) && !isLoading;



    const onRegisterButtonClicked = async (e) => {


        if (canSave) {
            try {
                await registerUser({ username, email, password, roles: ["User"], avatar }).unwrap();
                //todo: fix roles and profile pic
                setUsername('')
                setEmail('')
                setPassword('')
                setAvatar('')
            } catch (error) {
                console.error('Failed to register', error)
            }
        }
        navigate('/')

    }

    return (
        <main className="main-centre">
            <form>
                <label htmlFor="username">Username</label>
                <input
                    className="login-form-input"
                    id="username"
                    value={username}
                    type="text"
                    onChange={onUsernameChanged}
                />
                <label htmlFor="password">Password</label>
                <input
                    className="password"
                    id="password"
                    value={password}
                    type="text"
                    onChange={onPasswordChanged}
                />
                {/*                 <label htmlFor="password-repeat">Repeat Password</label>
                <input className="login-form-input" id="password-repeat" type="text" /> */}
                <label htmlFor="email">Email</label>
                <input
                    className="login-form-input"
                    id="email"
                    value={email}
                    type="text"
                    onChange={onEmailChanged}
                />
                <label htmlFor="avatar">Upload a profile picture</label>
                <input
                    className="login-form-input"
                    id="avatar"
                    type="file"
                    accept=".jpeg, .png, .jpg"
                    onChange={handleFileUpload}
                />
                <button
                    type="submit"
                    onClick={onRegisterButtonClicked}
                    disabled={!canSave}
                >Register</button>
                <button onClick={onBackButtonClicked}>Go Back</button>
            </form>
        </main>
    )
}

export default Register