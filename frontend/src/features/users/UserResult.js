import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from "./usersApiSlice";

import React from 'react'

const User = ({ userId }) => {
    /* const user = useSelector(state => selectUserById(state, userId)) */
    const user = useGetUserByIdQuery(userId)
    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/users/${userId}`) // CHECK

        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        return (
            <tr>
                <td className={'table__cell'}>{user.username}</td>
                <td className={'table__cell'}>{userRolesString}</td>
                <td className={'table__cell'}>
                    <button className='icon-button table__button' onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>

                </td>
            </tr>
        )
    } else return null
}

export default User