import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from './usersApiSlice'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import MapSection from '../map/MapSection'
import SearchResults from '../listings/SearchResults'
import { useGetListingsByUserIdQuery } from '../listings/listingsApiSlice'

const UserPage = () => {
    const { isAdmin, userId: loggedId } = useAuth()
    const { userId } = useParams()
    const { data: user } = useGetUserByIdQuery(userId, { skip: !userId })
    const { data: listings, isSuccess, isLoading, isError, error } = useGetListingsByUserIdQuery(userId, { skip: !userId })
    const [hoveredListingId, setHoveredListingId] = useState(null)

    if (!user) return <p>Loading user...</p>
    else {
        console.log(listings)
        let content = (
            <main className="main-grid">
                <section className="section-left">
                    <div className='user-info-container'>
                        <div className="user-avatar">
                            <img src={user?.avatar} className="avatar" alt="no profile pic :c" />
                        </div>
                        <div className='user-caption'>
                            <div className='user-page-info'>
                                <h1>{user?.username}</h1>
                            </div>
                            {(userId === loggedId || isAdmin) && <button className='edit-button'><Link to={`/users/edit/${userId}`}>Edit User</Link></button>}
                        </div>

                    </div>
                    <div className='user-listings'>
                        <h3>{user?.username}'s Listings:</h3>
                        <br />
                        {isSuccess && listings ? <SearchResults listings={listings} isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} setHoveredListingId={setHoveredListingId}></SearchResults> : <p>No listings found...</p>}
                    </div>
                </section>

                <section className="section-right">
                    {isSuccess && listings ? <MapSection listings={listings} isSuccess={isSuccess} isLoading={isLoading} hoveredListingId={hoveredListingId} searchText={''} /> : <MapSection isSuccess={isSuccess} isLoading={isLoading} hoveredListingId={hoveredListingId} searchText={''} />}
                </section>
            </main>
        )

        return content
    }

}

export default UserPage