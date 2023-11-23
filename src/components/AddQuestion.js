import { useState } from "react";
import { useMutation } from "@apollo/client";
import TextareaAutosize from "react-textarea-autosize";
import { UPDATE_QUESTION_ORDER, ADD_QUESTION } from "./queries";
import Load from "../images/load.png";

export default function AddQuestion(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [order, setOrder] = useState("");
    const [videoTag, setVideoTag] = useState("");
    const [words, setWords] = useState("");
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    const [addQuestion] = useMutation(ADD_QUESTION, {
        variables: {
            question: question,
            order: parseInt(order),
            video: videoTag,
            words: words,
        },
    });
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
