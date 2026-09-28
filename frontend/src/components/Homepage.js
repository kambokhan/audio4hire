import { useState } from "react"
import SearchResults from "../features/listings/SearchResults"
import MapSection from "../features/map/MapSection"
import { useGetListingsQuery } from '../features/listings/listingsApiSlice'

const Homepage = () => {

    const [searchText, setSearchText] = useState('')
    const [hoveredListingId, setHoveredListingId] = useState(null)

    const searchHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchText(lowerCase);
    }

    const {
        data: listings,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetListingsQuery('listingsList',
        {
            pollingInterval: 60000,
            refetchOnFocus: true,
            refetchonMountOrArgChange: true
        }
    )

    return (
        <main className="main-grid">
            <section className="section-left">
                <form className="search-field">
                    <input
                        type="text"
                        className="search-field-textbox"
                        id="search-field"
                        onChange={searchHandler} />
                    <label htmlFor="search-field" className="hidden">Listing search field</label>
                </form>
                <SearchResults searchText={searchText} listings={listings} isLoading={isLoading} isError={isError} isSuccess={isSuccess} error={error} setHoveredListingId={setHoveredListingId}></SearchResults>
            </section>
            <section className="section-right">
                <MapSection searchText={searchText} listings={listings} isSuccess={isSuccess} isLoading={isLoading} hoveredListingId={hoveredListingId}></MapSection>
            </section>
        </main>

    )
}

export default Homepage