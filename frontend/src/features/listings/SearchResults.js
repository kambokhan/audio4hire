import React from 'react'
import ListingResult from './ListingResult'

const SearchResults = ({ searchText, listings, isLoading, isSuccess, isError, error, setHoveredListingId }) => {

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {


        const { entities } = listings
        const entitiesArray = Object.values(entities)

        let filteredListings = []

        if (searchText) {
            filteredListings = entitiesArray?.length
                ? entitiesArray.map(listing => {
                    if (listing.title.toLowerCase().includes(searchText)
                        || listing.description.toLowerCase().includes(searchText))
                        return <div className='grid-cell'
                            key={listing.id}
                            onMouseEnter={() => setHoveredListingId(listing.id)}
                            onMouseLeave={() => setHoveredListingId(null)}
                        >
                            <ListingResult listing={listing} />
                        </div>
                })
                : null
        } else {
            filteredListings = entitiesArray?.length
                ? entitiesArray.map(listing => {
                    return <div className='grid-cell'
                        key={listing.id}
                        onMouseEnter={() => setHoveredListingId(listing.id)}
                        onMouseLeave={() => setHoveredListingId(null)}
                    >
                        <ListingResult listing={listing} />
                    </div>
                })
                : null
        }


        content = (

            <section className='results-grid'>
                {filteredListings}
            </section>
        )
        return content

    }
}

export default SearchResults
