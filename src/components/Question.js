import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    QUESTIONS_ASC,
    QUESTIONS_DESC,
    EDIT_QUESTION,
    UPDATE_QUESTION_ORDER,
} from "./queries";

export default function Question(props) {
    const [formState, setFormsState] = useState({
        question: "",
        order: "",
        video: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [ids, setIds] = useState({ order: "", swap: "" });
    const [orderDone, setOrderDone] = useState(false);
    const [swapDone, setSwapDone] = useState(false);
    const [getQuestionsDesc] = useLazyQuery(QUESTIONS_DESC);
    const [getQuestionsAsc] = useLazyQuery(QUESTIONS_ASC);
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    const [updateQuestionSwap] = useMutation(UPDATE_QUESTION_ORDER);
    const [updateQuestion] = useMutation(EDIT_QUESTION, {
        variables: {
            id: props.question.id,
            question: formState.question,
            order: parseInt(formState.order),
            video: formState.video,
        },
    });
    function handleClick(id, swapId, order, swapOrder) {
        document.getElementById(id).classList.replace("fade-in", "fade-out");
        document
            .getElementById(swapId)
            .classList.replace("fade-in", "fade-out");
        setIds({ order: id, swap: swapId });
        document.getElementById("loader-dialog").showModal();
        document.body.style.overflow = "hidden";
        updateQuestionOrder({ variables: { id: id, order: swapOrder } })
            .then(() => {
                setOrderDone(true);
                updateQuestionSwap({
                    variables: { id: swapId, order: order },
                }).catch((e) => console.log(e));
            })
            .then((v) => setSwapDone(true))
            .catch((e) => console.log(e));
    }
    function handleSwap(oldOrder) {
        document.getElementById("loader-dialog").showModal();
        document.body.style.overflow = "hidden";
        updateQuestion().then(() => {
            getQuestionsAsc().then((e) => {
                for (let i = 0; i < e.data.questions.data.length; i++) {
                    if (
                        e.data.questions.data[i].attributes.order ===
                            parseInt(formState.order) &&
                        e.data.questions.data[i].id !== props.question.id
                    )
                        updateQuestionOrder({
                            variables: {
                                id: e.data.questions.data[i].id,
                                order: parseInt(oldOrder),
                            },
                        });
                }
                setIsEdit(false);
                setTimeout(() => {
                    document.getElementById("loader-dialog").close();
                    document.body.style.overflow = null;
                }, 1500);
            });
        });
    }
    function handleSubmit() {
        document.getElementById("loader-dialog").showModal();
        document.body.style.overflow = "hidden";
        updateQuestion().then(() => {
            if (formState.order < props.question.attributes.order) {
                getQuestionsDesc().then((e) => {
                    for (let i = 0; i < e.data.questions.data.length; i++) {
                        updateQuestionOrder({
                            variables: {
                                id: e.data.questions.data[i].id,
                                order: i + 1,
                            },
                        });
                    }
                    setIsEdit(false);
                    setTimeout(() => {
                        document.getElementById("loader-dialog").close();
                        document.body.style.overflow = null;
                    }, 1500);
                });
            } else if (formState.order > props.question.attributes.order) {
                getQuestionsAsc().then((e) => {
                    for (let i = 0; i < e.data.questions.data.length; i++) {
                        updateQuestionOrder({
                            variables: {
                                id: e.data.questions.data[i].id,
                                order: i + 1,
                            },
                        });
                    }
                    setIsEdit(false);
                    setTimeout(() => {
                        document.getElementById("loader-dialog").close();
                        document.body.style.overflow = null;
                    }, 1500);
                });
            } else {
                setIsEdit(false);
                setTimeout(() => {
                    document.getElementById("loader-dialog").close();
                    document.body.style.overflow = null;
                }, 1500);
            }
        });
    }
    useEffect(() => {
        if (orderDone && swapDone) {
            setTimeout(() => {
                document
                    .getElementById(ids.order)
                    .classList.replace("fade-out", "fade-in");
                document
                    .getElementById(ids.swap)
                    .classList.replace("fade-out", "fade-in");
                document.getElementById("loader-dialog").close();
                document.body.style.overflow = null;
                setOrderDone(false);
                setSwapDone(false);
                setIds({ order: "", swap: "" });
            }, 1000);
        }
    }, [orderDone, swapDone, setOrderDone, setSwapDone, ids, setIds]);
    return (
        <div id={props.question.id} className="row fade-in mb-3">
            <div
                className={
                    props.current
                        ? "col-10 offset-1 response-card-current"
                        : "col-10 offset-1 response-card"
                }>
                <div className="row">
                    {isEdit ? (
                        <>
                            <div className="col-9">
                                <div className="col-12 cw-response-info-bold">
                                    <strong>Question: </strong>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <textarea
                                            style={{ height: "200px" }}
                                            value={formState.question}
                                            onChange={(e) => {
                                                setFormsState({
                                                    ...formState,
                                                    question: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row text-center mt-2 mb-2">
                                    {formState.order === "" ||
                                    formState.question === "" ? (
                                        ""
                                    ) : props.question.attributes.order ===
                                      parseInt(formState.order) ? (
                                        <div className="col-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSubmit();
                                                }}
                                                className="btn btn-climate">
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleSubmit();
                                                    }}
                                                    className="btn btn-climate">
                                                    Drop In
                                                </button>
                                            </div>
                                            <div className="col-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleSwap(
                                                            props.question
                                                                .attributes
                                                                .order
                                                        );
                                                    }}
                                                    className="btn btn-climate">
                                                    Swap
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    <div className="col-4">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEdit(false);
                                            }}
                                            className="btn btn-climate-red">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="col-12 cw-response-info-bold">
                                    <strong>Order: </strong>
                                </div>
                                <div className="row">
                                    <div className="col-10">
                                        <input
                                            onChange={(e) => {
                                                setFormsState({
                                                    ...formState,
                                                    order: e.target.value,
                                                });
                                            }}
                                            value={formState.order}
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 cw-response-info-bold">
                                    <strong>BG Tag: </strong>
                                </div>
                                <div className="row">
                                    <div className="col-10">
                                        <input
                                            onChange={(e) => {
                                                setFormsState({
                                                    ...formState,
                                                    video: e.target.value,
                                                });
                                            }}
                                            value={formState.video}
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-10">
                                <div className="col-12 cw-response-info-bold">
                                    <strong>Question: </strong>
                                </div>
                                <div className="row">
                                    <div className="col-12 cw-response-text mb-2">
                                        {props.question.attributes.question}
                                    </div>
                                </div>
                                <div className="col-12 cw-response-info-bold">
                                    <strong>Background Tag: </strong>
                                </div>
                                <div className="row">
                                    <div className="col-12 cw-response-text mb-2">
                                        {props.videoId}
                                    </div>
                                </div>
                                {!props.current ? (
                                    <>
                                        <div className="row text-center mt-2 mb-2">
                                            <div className="col-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        props.setId(
                                                            props.question.id
                                                        );
                                                        props.setOrder(
                                                            props.question
                                                                .attributes
                                                                .order
                                                        );
                                                        document
                                                            .getElementById(
                                                                "deleteQuestion"
                                                            )
                                                            .showModal();
                                                        document.body.style.overflow =
                                                            "hidden";
                                                    }}
                                                    className="btn btn-climate">
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="col-4">
                                                <button
                                                    onClick={(e) => {
                                                        setFormsState({
                                                            question:
                                                                props.question
                                                                    .attributes
                                                                    .question,
                                                            order: props
                                                                .question
                                                                .attributes
                                                                .order,
                                                            video: props.videoId,
                                                        });
                                                        setIsEdit(true);
                                                    }}
                                                    className="btn btn-climate">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                            {!props.current ? (
                                <>
                                    <div className="col-2 m-auto">
                                        {!props.first && !props.next ? (
                                            <div className="row">
                                                <div className="col-12 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleClick(
                                                                props.question
                                                                    .id,
                                                                props.prevId,
                                                                props.question
                                                                    .attributes
                                                                    .order,
                                                                props.question
                                                                    .attributes
                                                                    .order - 1
                                                            );
                                                        }}
                                                        className="btn mb-2 btn-climate-move">
                                                        &#8593;
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="row text-center">
                                            <div className="col-12 mb-2 cw-response-text text-center">
                                                {
                                                    props.question.attributes
                                                        .order
                                                }
                                            </div>
                                        </div>
                                        {!props.last && !props.prev ? (
                                            <div className="row">
                                                <div className="col-12 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleClick(
                                                                props.question
                                                                    .id,
                                                                props.nextId,
                                                                props.question
                                                                    .attributes
                                                                    .order,
                                                                props.question
                                                                    .attributes
                                                                    .order + 1
                                                            );
                                                        }}
                                                        className="btn mb-2 btn-climate-move">
                                                        &#8595;
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
