import { AdvancedMarker } from "@vis.gl/react-google-maps";

const CustomMarker = ({ position, listing, isHovered }) => {

    if (listing) {
        return (
            <AdvancedMarker position={position}>
                <div className="advanced-marker-container"
                    style={{
                        border: isHovered ? "3px solid rgb(59, 118, 177)" : "none", // Highlight border when hovered
                        transition: "border 0.1s ease",
                    }}
                >
                    <img className="advanced-marker-img"
                        src={listing.images?.[0]}
                        alt={listing.title}
                    />
                    <div className="advanced-marker-price">
                        {listing.price} BGN/Day
                    </div>
                </div>
            </AdvancedMarker>
        );
    }

};

export default CustomMarker;