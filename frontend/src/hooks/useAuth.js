import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {

    const token = useSelector(selectCurrentToken)
    console.log(`token:${token}`)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles, userId } = decoded.UserInfo

        isAdmin = roles.includes('Admin')
        if (isAdmin) status = "Admin"

        return { username, roles, status, isAdmin, userId }
    }

    return { username: '', roles: [], isAdmin, status, userId: '' }
}

export default useAuth