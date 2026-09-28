import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import React from 'react'
import Carroussel from './Carroussel'

const Listing = ({ listing }) => {
    const [hoveredListingId, setHoveredListingId] = useState(null);

    const navigate = useNavigate()

    if (listing) {
        const handleListingClicked = () => navigate(`/listings/${listing.id}`)

        const title = (listing.title.length <= 16) ? listing.title : (listing.title.slice(0, 16) + "..")
        const description = (listing.description.length <= 30) ? listing.description : (listing.description.slice(0, 30) + "...")

        const images = listing.images
        return (
            <article /* className='grid-cell' */ onClick={handleListingClicked}>
                <figure
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                >
                    <div className='grid-cell-image-container relative'>
                        <Carroussel images={images} />
                    </div>
                    <figcaption className='grid-cell-info'>
                        <div className='grid-cell-title'>{title}</div>
                        <div className='grid-cell-price'>{listing.price} BGN/Day</div>
                    </figcaption>
                    <div className='grid-cell-description'>{description}</div>
                </figure>

            </article>
        )
    } else return null
}

export default Listing