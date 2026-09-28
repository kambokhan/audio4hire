import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDeleteListingMutation, useUpdateListingMutation, useGetListingByIDQuery } from "../listings/listingsApiSlice"
import useAuth from "../../hooks/useAuth"
import MapSection from "../map/MapSection"

const EditListing = () => {
    const { listingId } = useParams()
    const { data: listing, isSuccess, isError } = useGetListingByIDQuery(listingId)
    const { userId } = useAuth()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [images, setImages] = useState([])
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) {
            setTitle(listing.title)
            setDescription(listing.description)
            setPrice(listing.price)
            setImages(listing.images)
            setLatitude(listing?.location.coordinates[0])
            setLongitude(listing?.location.coordinates[1])
        }
        if (isError && !isDeleting) {
            navigate('/404', { replace: true })
        }
    }, [isSuccess, isError, listing?.title, listing?.description, listing?.price, listing?.images, listing?.location.coordinates[0], listing?.location.coordinates[1]])



    const [updateListing, { isLoading }] = useUpdateListingMutation()
    const [deleteListing] = useDeleteListingMutation()

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onPriceChanged = e => setPrice(e.target.value)





    const handleFileUpload = async (e) => {
        const files = [...e.target.files]
        console.log(files)
        /* const base64 = files.map(async (file) => await convertToBase64(file)) */
        let base64 = []
        for (const file of files) {
            const convertedFile = await convertToBase64(file)
            base64 = [...base64, convertedFile]
        }
        setImages(base64)


        //base64 returns promise https://stackoverflow.com/questions/69424796/promise-returns-after-awaiting-in-map-function-but-data-returns-when-awaiting-ou

    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    const backButtonHandler = (e) => {
        navigate('/')
        e.preventDefault()
    }
    const canSave = [title, description, price].every(Boolean) && !isLoading;

    const onUpdateButtonClicked = async (e) => {
        e.preventDefault()
        console.log(`the listing id is ${listingId}`)
        if (canSave) {
            try {
                await updateListing({ id: listingId, title, description, price, userId: userId, images, latitude, longitude });
                setTitle('')
                setDescription('')
                setPrice('')
                setImages([''])
                setLatitude('')
                setLongitude('')
                console.log('Edit Successful')
                const path = '/listings/' + listingId
                navigate(path)
            } catch (error) {
                console.error('Failed to update listing', error)
            }

        }

    }

    const onDeleteListingClicked = async () => {
        try {
            await deleteListing({ id: listingId }).unwrap()
            setIsDeleting(true)
            navigate('/', { replace: true });
            setTitle('')
            setDescription('')
            setPrice('')
            setImages([''])
            setLatitude('')
            setLongitude('')

            console.log('Delete Successful')
        } catch (err) {
            console.error('Failed to delete the listing', err)
        }
    }

    return (
        <main className="main-grid">
            <section className="section-left">
                <form>
                    <label htmlFor="title">Title</label>
                    <input
                        className="login-form-input"
                        id="title"
                        type="text"
                        value={title}
                        onChange={onTitleChanged}
                    />
                    <label htmlFor="description">Description</label>
                    <input
                        className="login-form-input"
                        id="description"
                        type="text"
                        value={description}
                        onChange={onDescriptionChanged}
                    />
                    <label htmlFor="price">Price</label>
                    <input
                        className="login-form-input"
                        id="price"
                        type="text"
                        value={price}
                        onChange={onPriceChanged}
                    />
                    <label htmlFor="photo">Upload photos</label>
                    <input
                        className="login-form-input"
                        id="images"
                        type="file"
                        accept=".jpeg, .png, .jpg"
                        onChange={handleFileUpload}
                        multiple
                    />
                    <button
                        type="submit"
                        onClick={onUpdateButtonClicked}
                    /* disabled={!canSave} */
                    >Update Listing</button>
                    <button onClick={onDeleteListingClicked}>DELETE Listing</button>
                    <button onClick={backButtonHandler}>Go Back</button>
                </form>
            </section>
            <section className="section-right">
                <MapSection
                    latitude={isNaN(Number(latitude)) ? 42.69 : Number(latitude)}
                    longitude={isNaN(Number(longitude)) ? 23.31 : Number(longitude)}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                />
            </section>
        </main>
    )
}

export default EditListing    