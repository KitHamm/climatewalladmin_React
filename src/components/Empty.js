// component to display if responses are empty

export default function Empty(props) {
    return (
        <div className="col-12 fade-in response-card">
            <div className="col-12 mb-3 cw-response-info-text">
                {props.text}
            </div>
        </div>
    );
}
