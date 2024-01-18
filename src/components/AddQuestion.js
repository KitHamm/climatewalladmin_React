// Add a question to the pool of questions that will appear on the wall

// Apollo imports
import { useMutation } from "@apollo/client";
// gql query imports
import { UPDATE_QUESTION_ORDER, ADD_QUESTION } from "./queries";
// React imports
import { useState } from "react";
// Library imports
import TextareaAutosize from "react-textarea-autosize";
// component imports
import Load from "../images/load.png";

export default function AddQuestion(props) {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [order, setOrder] = useState("");
    const [videoTag, setVideoTag] = useState("");
    const [words, setWords] = useState("");
    // GraphQL mutations
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    const [addQuestion] = useMutation(ADD_QUESTION, {
        variables: {
            question: question,
            order: parseInt(order),
            video: videoTag,
            words: words,
        },
    });
    // Handle adding the new question and where it should be placed in the order
    function handleSubmit() {
        setIsLoading(true);
        addQuestion()
            .then(() => {
                for (let i = 0; i < props.data.questions.data.length; i++) {
                    if (i > order - 2) {
                        updateQuestionOrder({
                            variables: {
                                id: props.data.questions.data[i].id,
                                order:
                                    props.data.questions.data[i].attributes
                                        .order + 1,
                            },
                        });
                    }
                }
            })
            .then(() => {
                setTimeout(() => {
                    setIsLoading(false);
                    document.getElementById("addQuestion").close();
                    document.body.style.overflow = null;
                }, 1000);
            })
            .catch((e) => {
                console.log(e);
            });
        setOrder("");
        setQuestion("");
    }
    // form dialog for adding question
    return (
        <dialog
            style={
                isLoading
                    ? { backgroundColor: "black" }
                    : { backgroundColor: "white" }
            }
            id="addQuestion">
            {isLoading ? (
                <img className="loader" src={Load} alt="Load" />
            ) : (
                <>
                    <div className="row"></div>
                    <div className="row">
                        <form className="row">
                            <div className="col-12">
                                <div className="cw-title">Add Question</div>
                            </div>
                            <div className="col-12">
                                <TextareaAutosize
                                    minRows={2}
                                    value={question}
                                    onChange={(e) => {
                                        setQuestion(e.target.value);
                                    }}
                                    style={{ width: "75vw" }}
                                />
                            </div>
                            <div className="col-12">
                                <div className="cw-title">Words</div>
                            </div>
                            <div className="col-12">
                                <TextareaAutosize
                                    minRows={2}
                                    value={words}
                                    onChange={(e) => {
                                        setWords(e.target.value);
                                    }}
                                    style={{ width: "75vw" }}
                                />
                            </div>
                            <div className="col-2">
                                <div className="cw-title">Order</div>
                            </div>
                            <div className="col-10">
                                <div className="cw-title">Video Tag</div>
                            </div>
                            <div className="col-2">
                                <input
                                    onChange={(e) => {
                                        setOrder(e.target.value);
                                    }}
                                    value={order}
                                    type="number"
                                />
                            </div>
                            <div className="col-2">
                                <input
                                    onChange={(e) => {
                                        setVideoTag(e.target.value);
                                    }}
                                    value={videoTag}
                                    type="text"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                                className="btn btn-climate">
                                Submit
                            </button>
                            <button
                                style={{ float: "inline-end" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("addQuestion")
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
