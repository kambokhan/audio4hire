import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateListingMutation } from "../listings/listingsApiSlice"
import useAuth from "../../hooks/useAuth"
import MapSection from "../map/MapSection"

const CreateListing = () => {

    const { userId } = useAuth()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [images, setImages] = useState([])
    const [latitude, setLatitude] = useState(42.69)
    const [longitude, setLongitude] = useState(23.31)

    const [createListing, { isLoading }] = useCreateListingMutation()

    const onTitleChanged = e => setTitle(e.target.value)
    const onDescriptionChanged = e => setDescription(e.target.value)
    const onPriceChanged = e => setPrice(e.target.value)

    const navigate = useNavigate()

    const handleFileUpload = async (e) => {
        const files = [...e.target.files]
        console.log(files)
        /* const base64 = files.map(async (file) => await convertToBase64(file)) */
        let base64 = []
        for (const file of files) {
            const convertedFile = await convertToBase64(file)
            base64 = [...base64, convertedFile]
        }

        console.log(base64)
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

    const onCreateButtonClicked = async () => {
        if (canSave) {
            try {
                await createListing({ title, description, price, userId: userId, images, latitude, longitude }).unwrap()
                setTitle('')
                setDescription('')
                setPrice('')
                setImages([''])
                setLatitude('')
                setLongitude('')
            } catch (error) {
                console.error('Failed to post listing', error)
            }
            navigate('/')
        }
    }

    /* console.log(`lat: ${latitude}, lng:${longitude}`) */

    return (

        <main className="main-grid">

            <section className="section-left">
                <form>
                    <label htmlFor="title">Title</label>
                    <input
                        className="login-form-input"
                        id="title"
                        type="text"
                        onChange={onTitleChanged}
                    />
                    <label htmlFor="description">Description</label>
                    <input
                        className="login-form-input"
                        id="description"
                        type="text"
                        onChange={onDescriptionChanged}
                    />
                    <label htmlFor="price">Price per Day</label>
                    <input
                        className="login-form-input"
                        id="price"
                        type="text"
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
                        onClick={onCreateButtonClicked}
                        disabled={!canSave}
                    >Create Listing</button>
                    <button onClick={backButtonHandler}>Go Back</button>
                </form>
            </section>
            <section className="section-right">
                <MapSection
                    latitude={latitude}
                    longitude={longitude}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                />
            </section>


        </main>
    )
}

export default CreateListing    