import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetListingByIDQuery } from './listingsApiSlice'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import MapSection from '../map/MapSection'
import Carroussel from './Carroussel'
import { useGetUserByIdQuery } from '../users/usersApiSlice'

const ListingPage = () => {
    const { isAdmin, userId: loggedId } = useAuth()
    const { listingId } = useParams()
    const { data: listing, isSuccess } = useGetListingByIDQuery(listingId)

    const authorId = listing?.userId
    console.log(authorId)
    const { data: user } = useGetUserByIdQuery(authorId, { skip: !authorId })

    const images = listing?.images || [];

    if (!isSuccess) {
        return <div>Loading...</div>;
    }
    console.log(`user: ${user}`)
    let content = (
        <main className="main-grid">
            <section className="section-left">
                <div className='listing-page-container'>
                    <div className="listing-page-carroussel relative">
                        <Carroussel images={images} />
                    </div>
                    <div className='listing-page-caption'>
                        <div className='listing-page-info'>
                            <h1>{listing?.title}</h1>
                            <br />
                            <h2>{listing?.price} BGN/Day</h2>
                        </div>
                        <div className='contact-info'>
                            <b>Submited By:</b> {user ? <>{user.username} <Link to={`/users/${authorId}`}><button>See Profile</button></Link></> : "Loading user info..."}
                            <br />
                            <b>Email: </b> {user ? user.email : "Loading user info..."}
                        </div>

                        {(listing?.userId === loggedId || isAdmin) && <button className='edit-button'><Link to={`/listings/edit/${listingId}`}>Edit Post</Link></button>}

                    </div>
                </div>
                <div className='listing-page-description'>
                    <h3>Description:</h3>
                    <br />
                    {listing?.description}
                </div>
            </section>

            <section className="section-right">
                {isSuccess && listing ? <MapSection listing={listing} isSuccess={isSuccess} /> : <p>Loading map...</p>}
            </section>
        </main>
    )

    return content
}

export default ListingPage