import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Carroussel = ({ images }) => {

    const [imageIndex, setImageIndex] = useState(0)

    const showNextImage = () => {
        setImageIndex(index => {
            if (index === images.length - 1) return 0
            return index + 1
        })
    }

    const showPrevImage = () => {
        setImageIndex(index => {
            if (index === 0) return images.length - 1
            return index - 1
        })
    }

    return (
        <div>
            <img className='carroussel-img' src={images[imageIndex]} alt="none found" />
            {images.length > 1 && (
                <>
                    <button
                        className='carroussel-btn'
                        onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                        style={{ left: 0 }}
                    >
                        <FontAwesomeIcon className="chevron" icon={faChevronLeft} />
                    </button>
                    <button
                        className='carroussel-btn'
                        onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                        style={{ right: 0 }}
                    >
                        <FontAwesomeIcon className="chevron" icon={faChevronRight} />
                    </button>
                </>
            )}

        </div>
    )
}

export default Carroussel