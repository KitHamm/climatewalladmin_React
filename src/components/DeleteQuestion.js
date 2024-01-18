// Dialog to delete a question from the pool of questions

// Apollo imports
import { useMutation } from "@apollo/client";
// React imports
import { useState } from "react";
// gql query imports
import { UPDATE_QUESTION_ORDER, DELETE_QUESTION } from "./queries";
// component imports
import Load from "../images/load.png";

export default function DeleteQuestion(props) {
    const [loading, setLoading] = useState(false);
    // mutation to update the order that the questions will appear
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    // mutation to delete the question
    const [deleteQuestion] = useMutation(DELETE_QUESTION, {
        variables: { id: props.id },
    });
    // delete submission handler
    // deletes the question and then updates the order for each question after
    function handleSubmit() {
        setLoading(true);
        deleteQuestion()
            .then(() => {
                for (let i = 0; i < props.data.questions.data.length; i++) {
                    if (i > props.order - 1) {
                        updateQuestionOrder({
                            variables: {
                                id: props.data.questions.data[i].id,
                                order:
                                    props.data.questions.data[i].attributes
                                        .order - 1,
                            },
                        });
                    }
                }
            })
            .then(() => {
                setTimeout(() => {
                    setLoading(false);
                    document.getElementById("deleteQuestion").close();
                    document.body.style.overflow = null;
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
            });
    }
    return (
        <dialog
            style={
                loading
                    ? { backgroundColor: "black" }
                    : { backgroundColor: "white" }
            }
            id="deleteQuestion">
            {loading ? (
                <img className="loader" src={Load} alt="Load" />
            ) : (
                <>
                    <div className="row">
                        <div className="col-12">
                            <div className="cw-title">Are you sure?</div>
                        </div>
                        <div className="col-12 mb-4">
                            <div className="cw-response-info-text">
                                {props.order !== 0
                                    ? props.data.questions.data[props.order - 1]
                                          .attributes.question
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                                className="btn btn-climate-red">
                                Delete
                            </button>
                            <button
                                style={{ float: "inline-end" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("deleteQuestion")
                                        .close();
                                    document.body.style.overflow = null;
                                }}
                                className="btn btn-climate-red">
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </dialog>
    );
}
