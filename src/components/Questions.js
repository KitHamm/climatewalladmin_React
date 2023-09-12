import { useQuery, useMutation } from "@apollo/client";
import { QUESTIONS, APPROVE_QUESTION, DELETE_QUESTION } from "./queries";

export default function Questions() {
    /* eslint-disable no-unused-vars */
    const [
        approveQuestion,
        { loading: approveLoading, error: approveError, data: approveData },
    ] = useMutation(APPROVE_QUESTION);
    const [
        deleteQuestion,
        { loading: deleteLoading, error: deleteError, data: deleteData },
    ] = useMutation(DELETE_QUESTION);
    /* eslint-enable no-unused-vars */
    const { loading, error, data } = useQuery(QUESTIONS);
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
    const questions = data.questions.data;

    function handleApproveQuestion(question) {
        approveQuestion({
            variables: {
                id: question.id,
                approved: true,
            },
        });
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    }

    function handleDeleteQuestion(question) {
        deleteQuestion({ variables: { id: question.id } });
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
            {questions.map((question, index) => {
                if (question.attributes.approved !== true) {
                    return (
                        <div key={+index} className="row mt-2 mb-2">
                            <div className="col-12 text-center">
                                <p>{question.attributes.question}</p>
                            </div>
                            <div className="col-6 text-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleApproveQuestion(question);
                                    }}
                                    className="btn btn-success">
                                    Approve
                                </button>
                            </div>
                            <div className="col-6 text-start">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteQuestion(question);
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
            {questions.map((question, index) => {
                if (question.attributes.approved === true) {
                    return (
                        <div
                            key={"question-" + index}
                            className="row text-center mt-2 mb-2">
                            <div className="col-12">
                                <p>{question.attributes.question}</p>
                            </div>
                            <div className="col-12 text-center">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteQuestion(question);
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
