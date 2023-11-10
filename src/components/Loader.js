import Load from "../images/load.png";

export default function Loader() {
    return (
        <dialog className="loader-dialog" id="loader-dialog">
            <img className="loader" src={Load} alt="Load" />
        </dialog>
    );
}
