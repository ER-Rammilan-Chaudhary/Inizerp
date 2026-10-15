import ErrorPage from "./ErrorPage";


export default function Unauthorized() {

    return (
        <ErrorPage
            title="Access denied"
            message="You don't have permission to access this page."
        />
    );
}