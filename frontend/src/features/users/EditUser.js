import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDeleteUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from "../users/usersApiSlice"
const EditUser = () => {

    const { userId } = useParams()
    const { data: user, isSuccess } = useGetUserByIdQuery(userId)
    console.log(user)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')


    let roles = []
    if (user.roles) roles = user.roles

    useEffect(() => {
        if (isSuccess) {
            setUsername(user.username)
            setPassword(user.password)
            setEmail(user.email)
            setAvatar(user.avatar)
        }
    }, [isSuccess, user?.username, user?.password, user?.email, user?.avatar])

    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onPasswordRepeatChanged = e => setPasswordRepeat(e.target.value)
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

    const canSave = [username, email, password, passwordRepeat, avatar].every(Boolean) && !isLoading;



    const onEditButtonClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            if (password === passwordRepeat) {
                try {
                    await updateUser({ id: userId, username, email, password, roles, avatar }).unwrap();
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    setAvatar('')
                    setPasswordRepeat('')
                    console.log('User Updated Successfully')
                    const path = '/users/' + userId
                    navigate(path)
                } catch (error) {
                    console.error('Failed to update', error)
                }
            } else {
                alert("Passwords don't match")
            }

        } else alert("All text fields are required!")
    }

    const onDeleteUserClicked = async () => {
        try {
            await deleteUser({ id: userId }).unwrap()

            setUsername('')
            setEmail('')
            setPassword('')
            setAvatar('')

        } catch (err) {
            console.error('Failed to delete the user', err)
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
                    type="text"
                    onChange={onPasswordChanged}
                />
                <label htmlFor="password-repeat">Repeat Password</label>
                <input className="login-form-input" id="password-repeat" type="text" onChange={onPasswordRepeatChanged} />
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
                    onClick={onEditButtonClicked}
                /* disabled={!canSave} */
                >Edit</button>
                <button onClick={onBackButtonClicked}>Go Back</button>
                <button onClick={onDeleteUserClicked}>DELETE User</button>

            </form>
        </main>
    )
}

export default EditUser