import { useQuery, useMutation } from "@apollo/client";
import { WORDS, APPROVE_WORD, DELETE_WORD } from "./queries";

export default function Questions() {
    /* eslint-disable no-unused-vars */
    const [
        approveWord,
        { loading: approveLoading, error: approveError, data: approveData },
    ] = useMutation(APPROVE_WORD);
    const [
        deleteWord,
        { loading: deleteLoading, error: deleteError, data: deleteData },
    ] = useMutation(DELETE_WORD);

    /* eslint-enable no-unused-vars */
    const { loading, error, data } = useQuery(WORDS);
    if (loading)
        return (
            <div className="row text-center">
                <div className="col-12">
                    <h5>Loading</h5>
                </div>
            </div>
        );
    if (error)
        return (
            <div className="row text-center">
                <div className="col-12">
                    <h5>Error</h5>
                </div>
            </div>
        );
    const words = data.words.data;

    function handleApproveWord(word) {
        approveWord({
            variables: {
                id: word.id,
                approved: true,
            },
        });
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    }

    function handleDeleteWord(word) {
        deleteWord({ variables: { id: word.id } });
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    }

    return (
        <>
            <div className="row text-center">
                <div className="col-12">
                    <h5>Pending</h5>
                </div>
            </div>
            {words.map((word, index) => {
                if (word.attributes.approved !== true) {
                    return (
                        <div key={"word-" + index} className="row mt-2 mb-2">
                            <div className="col-6 text-center">
                                <p>{word.attributes.word}</p>
                            </div>
                            <div className="col-3 text-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleApproveWord(word);
                                    }}
                                    className="btn btn-success">
                                    Approve
                                </button>
                            </div>
                            <div className="col-3 text-start">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteWord(word);
                                    }}
                                    className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                } else {
                    return <></>;
                }
            })}
            <div className="row text-center">
                <div className="col-12">
                    <h5>Approved</h5>
                </div>
            </div>
            {words.map((word, index) => {
                if (word.attributes.approved === true) {
                    return (
                        <div key={"word-" + index} className="row mt-2 mb-2">
                            <div className="col-6 text-end">
                                <p>{word.attributes.word}</p>
                            </div>
                            <div className="col-6 text-start">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteWord(word);
                                    }}
                                    className="btn btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                } else {
                    return <></>;
                }
            })}
        </>
    );
}
