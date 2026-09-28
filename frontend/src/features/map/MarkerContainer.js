import React from 'react'
import CustomMarker from './CustomMarker'
import { Link } from 'react-router-dom'
import { AdvancedMarker } from '@vis.gl/react-google-maps'


const MarkerContainer = ({ listing, listings, isSuccess, isLoading, searchText, hoveredListingId, latitude, longitude, setLatitude, setLongitude }) => {
    if (isSuccess) {
        if (listing) {
            const coords = listing.location?.coordinates;

            if (
                Array.isArray(coords) &&
                typeof coords[0] === 'number' &&
                typeof coords[1] === 'number'
            ) {
                const position = { lat: coords[0], lng: coords[1] };

                return <Link to={`/listings/${listing.id}`}><CustomMarker
                    key={listing.id}
                    position={position}
                    listing={listing}
                /></Link>
            } else {
                console.warn('Invalid coordinates for listing:', listing);
                return null;
            }
        } else if (listings) {

            const { entities } = listings
            const entitiesArray = Object.values(entities)
            const filteredPoints = entitiesArray?.length
                ? entitiesArray.map(listing => {
                    if (listing.title.toLowerCase().includes(searchText) || listing.description.toLowerCase().includes(searchText)) {
                        const isHovered = listing.id === hoveredListingId;
                        const coords = listing.location?.coordinates;

                        if (
                            Array.isArray(coords) &&
                            typeof coords[0] === 'number' &&
                            typeof coords[1] === 'number'
                        ) {
                            const position = { lat: coords[0], lng: coords[1] };

                            return <Link to={`/listings/${listing.id}`}><CustomMarker
                                key={listing.id}
                                position={position}
                                listing={listing}
                                isHovered={isHovered}
                            /></Link>
                        } else {
                            console.warn('Skipping marker — invalid coordinates for listing:', listing);
                            return null;
                        }
                    }
                }
                )
                : null
            return filteredPoints
        }
    }
    else if (!isLoading) {
        const handleDragEnd = (event) => {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            setLatitude(lat)
            setLongitude(lng)
        }


        return <AdvancedMarker position={{ lat: latitude, lng: longitude }} draggable={true} onDragEnd={handleDragEnd} />
    }
}

export default MarkerContainer