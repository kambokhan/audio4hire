import { Link } from "react-router-dom"
const NotFoundPage = () => {
    return (
        <main className="main-centre">
            <h1>404 - Page Not Found</h1>
            <br />
            <p>The page you are looking for does not exist.</p>
            <p ><Link to={`/`}>Return Home</Link></p>
        </main>
    )
}

export default NotFoundPage