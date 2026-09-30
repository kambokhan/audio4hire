import React from 'react'

import {
    APIProvider, Map
} from "@vis.gl/react-google-maps"
import MarkerContainer from './MarkerContainer'

const MapSection = ({ listing, listings, isSuccess, isLoading, searchText, hoveredListingId, latitude, longitude, setLatitude, setLongitude }) => {
    const initialPosition = { lat: 42.69, lng: 23.31 }

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <Map
                defaultZoom={12}
                defaultCenter={initialPosition}
                streetViewControl={false}
                fullscreenControl={false}
                mapId='4d0b718914b81fb5'
            >

                <MarkerContainer
                    listing={listing}
                    listings={listings}
                    isSuccess={isSuccess}
                    isLoading={isLoading}
                    searchText={searchText}
                    hoveredListingId={hoveredListingId}
                    latitude={latitude ?? 42.69}
                    longitude={longitude ?? 23.31}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                ></MarkerContainer>
            </Map>
        </APIProvider>
    )
}

export default MapSection