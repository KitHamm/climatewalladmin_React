import { useEffect, useState, createContext } from "react";
import { cookies } from "../App";
import Load from "../images/load.png";
import {
    GET_APPROVED,
    GET_AWAITING,
    GET_DENIED,
    APPROVE,
    DENY,
    DELETE,
    QUESTIONS,
    QUESTIONS_ASC,
    QUESTIONS_DESC,
    UPDATE_QUESTION_ORDER,
    CURRENT_QUESTION,
    ADD_QUESTION,
    DELETE_QUESTION,
    EDIT_QUESTION,
} from "../components/queries";
import Login from "../components/Login";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
export const loggedInContext = createContext();
export const superUserContext = createContext();
export default function Home() {
    const [view, setView] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (cookies.get("jwt")) {
            setLoggedIn(true);
            cookies.set("jwt", cookies.get("jwt"), {
                maxAge: 21600,
                path: "/climatewalladmin",
            });
        }
    }, []);
    if (!loggedIn) {
        return (
            <loggedInContext.Provider value={[loggedIn, setLoggedIn]}>
                <Login />
            </loggedInContext.Provider>
        );
    }
    return (
        <div className="container">
            <div className="row text-center mt-5">
                <div className="col-12">
                    <div className="cw-title">#ClimateWall</div>
                    <div className="cw-response-info-text mb-3">
                        Logged In as{" "}
                        <div
                            className="cw-response-info-green"
                            style={{ display: "inline-flex" }}>
                            {cookies.get("user")}
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                cookies.remove("jwt", {
                                    path: "/climatewalladmin",
                                });
                                cookies.remove("user", {
                                    path: "/climatewalladmin",
                                });
                                cookies.remove("superuser", {
                                    path: "/climatewalladmin",
                                });
                                setLoggedIn(false);
                                window.location.reload();
                            }}
                            className="btn btn-climate-red">
                            Log Out
                        </button>
                    </div>
                    {cookies.get("superuser") === true && view === 0 ? (
                        <div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setView(1);
                                }}
                                className="mt-3 btn btn-climate">
                                Questions
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {view === 0 ? (
                <>
                    <Awaiting />
                    <Approved />
                    <Denied />
                </>
            ) : (
                <Questions setView={setView} />
            )}
        </div>
    );
}

function AddQuestion(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [order, setOrder] = useState("");
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    const [addQuestion] = useMutation(ADD_QUESTION, {
        variables: { question: question, order: parseInt(order) },
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
                    <div className="row">
                        <div className="col-12">
                            <div className="cw-title">Add Question</div>
                        </div>
                    </div>
                    <div className="row">
                        <form className="row">
                            <div className="col-12">
                                <textarea
                                    value={question}
                                    onChange={(e) => {
                                        setQuestion(e.target.value);
                                    }}
                                    style={{ width: "75vw" }}
                                />
                            </div>
                            <div className="col-12">
                                <div className="cw-title">Order</div>
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

function DeleteQuestion(props) {
    const [loading, setLoading] = useState(false);
    const [updateQuestionOrder] = useMutation(UPDATE_QUESTION_ORDER);
    const [deleteQuestion] = useMutation(DELETE_QUESTION, {
        variables: { id: props.id },
    });
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

function Questions(props) {
    const [order, setOrder] = useState(0);
    const [id, setId] = useState(0);
    const { data } = useQuery(QUESTIONS, {
        pollInterval: 1000,
    });
    const { data: currentQ } = useQuery(CURRENT_QUESTION, {
        pollInterval: 1000,
    });
    if (data && currentQ) {
        return (
            <>
                <div className="row mt-3">
                    <div className="col-10 offset-1">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById("addQuestion")
                                    .showModal();
                                document.body.style.overflow = "hidden";
                            }}
                            className="mt-3 btn btn-climate">
                            Add Question
                        </button>
                        <button
                            style={{ float: "inline-end" }}
                            onClick={(e) => {
                                e.preventDefault();
                                props.setView(0);
                            }}
                            className="mt-3 btn btn-climate-red">
                            Back
                        </button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-10 offset-1 text-center">
                        <div className="cw-title-green">Questions</div>
                    </div>
                </div>
                {data.questions.data.map((question, index) => {
                    return (
                        <Question
                            videoId={question.attributes.video_id}
                            setId={setId}
                            setOrder={setOrder}
                            current={
                                currentQ.currentQuestion.data.attributes
                                    .number ===
                                question.attributes.order - 1
                                    ? true
                                    : false
                            }
                            key={index}
                            question={question}
                            prevId={
                                index > 0
                                    ? data.questions.data[index - 1].id
                                    : 0
                            }
                            nextId={
                                index < data.questions.data.length - 1
                                    ? data.questions.data[index + 1].id
                                    : 0
                            }
                            first={index === 0 ? true : false}
                            last={
                                index === data.questions.data.length - 1
                                    ? true
                                    : false
                            }
                        />
                    );
                })}
                <Loader />
                <AddQuestion data={data} amount={data.questions.data.length} />
                <DeleteQuestion
                    order={order}
                    id={id}
                    data={data}
                    amount={data.questions.data.length}
                />
            </>
        );
    }
}

function Question(props) {
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
                                    <div className="col-3">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit();
                                            }}
                                            className="btn btn-climate">
                                            Save
                                        </button>
                                    </div>
                                    <div className="col-3">
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
                                            type="number"
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
                                <div className="row text-center mt-2 mb-2">
                                    <div className="col-4">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                props.setId(props.question.id);
                                                props.setOrder(
                                                    props.question.attributes
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
                                                    order: props.question
                                                        .attributes.order,
                                                    video: props.videoId,
                                                });
                                                setIsEdit(true);
                                            }}
                                            className="btn btn-climate">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 m-auto">
                                {!props.first ? (
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleClick(
                                                        props.question.id,
                                                        props.prevId,
                                                        props.question
                                                            .attributes.order,
                                                        props.question
                                                            .attributes.order -
                                                            1
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
                                        {props.question.attributes.order}
                                    </div>
                                </div>
                                {!props.last ? (
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleClick(
                                                        props.question.id,
                                                        props.nextId,
                                                        props.question
                                                            .attributes.order,
                                                        props.question
                                                            .attributes.order +
                                                            1
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
                    )}
                </div>
            </div>
        </div>
    );
}

function Loader() {
    return (
        <dialog className="loader-dialog" id="loader-dialog">
            <img className="loader" src={Load} alt="Load" />
        </dialog>
    );
}

function Awaiting() {
    const { loading, error, data } = useQuery(GET_AWAITING, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Awaiting Approval</div>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Awaiting Approval</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">
                            Awaiting Approval ({data.responses.data.length})
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />

                {data.responses.data.length > 0 ? (
                    data.responses.data.map((response, index) => {
                        return (
                            <Response
                                type="awaiting"
                                index={index}
                                question={response.attributes.question}
                                response={response.attributes.response}
                                key={response.id}
                                id={response.id}
                            />
                        );
                    })
                ) : (
                    <Empty text="Nothing to show." />
                )}
            </>
        );
    }
}
function Approved() {
    const { loading, error, data } = useQuery(GET_APPROVED, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Approved</div>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Approved</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        return (
            <>
                <div className="col-12 mt-5 mb-4">
                    <div className="col-12">
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
                                var arrow =
                                    document.getElementById("arrow-approved");
                                var el =
                                    document.getElementById(
                                        "approved-container"
                                    );
                                arrow.classList.contains("down")
                                    ? arrow.classList.replace("down", "up")
                                    : arrow.classList.replace("up", "down");
                                el.classList.contains("fade-out")
                                    ? el.classList.replace(
                                          "fade-out",
                                          "fade-in"
                                      )
                                    : el.classList.replace(
                                          "fade-in",
                                          "fade-out"
                                      );
                                el.style.maxHeight === "0px"
                                    ? (el.style.maxHeight =
                                          el.scrollHeight + 1000 + "px")
                                    : (el.style.maxHeight = "0px");
                            }}>
                            Approved ({data.responses.data.length})
                            <span id="arrow-approved" className="arrow down" />
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />
                <div
                    className="approved-container fade-out"
                    id="approved-container"
                    style={{ maxHeight: "0px" }}>
                    {data.responses.data.length > 0 ? (
                        data.responses.data.map((response, index) => {
                            return (
                                <Response
                                    type="approved"
                                    question={response.attributes.question}
                                    response={response.attributes.response}
                                    key={response.id}
                                    id={response.id}
                                    user={response.attributes.approvedBy}
                                />
                            );
                        })
                    ) : (
                        <Empty text="Nothing to show." />
                    )}
                </div>
            </>
        );
    }
}
function Denied() {
    const { loading, error, data } = useQuery(GET_DENIED, {
        pollInterval: 1000,
    });
    if (loading)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Denied</div>
                    </div>
                </div>
                <Empty text="Loading..." />
            </>
        );
    if (error)
        return (
            <>
                <div className="row mt-4 mb-4">
                    <div className="col-12">
                        <div className="cw-title-green">Denied</div>
                    </div>
                </div>
                <Empty text="Error." />
            </>
        );
    if (data) {
        return (
            <>
                <div className="col-12 mt-4 mb-4">
                    <div className="col-12">
                        <div
                            style={{ cursor: "pointer" }}
                            className="cw-title-green"
                            onClick={() => {
                                var arrow =
                                    document.getElementById("arrow-denied");
                                var el =
                                    document.getElementById("denied-container");
                                arrow.classList.contains("down")
                                    ? arrow.classList.replace("down", "up")
                                    : arrow.classList.replace("up", "down");
                                el.classList.contains("fade-out")
                                    ? el.classList.replace(
                                          "fade-out",
                                          "fade-in"
                                      )
                                    : el.classList.replace(
                                          "fade-in",
                                          "fade-out"
                                      );
                                el.style.maxHeight === "0px"
                                    ? (el.style.maxHeight =
                                          el.scrollHeight + 1000 + "px")
                                    : (el.style.maxHeight = "0px");
                            }}>
                            Denied ({data.responses.data.length}){" "}
                            <span id="arrow-denied" className="arrow down" />
                        </div>
                    </div>
                </div>
                <hr className="cw-line" />
                <div
                    className="denied-container fade-out mb-5"
                    id="denied-container"
                    style={{ maxHeight: "0px" }}>
                    {data.responses.data.length > 0 ? (
                        data.responses.data.map((response, index) => {
                            return (
                                <Response
                                    type="denied"
                                    question={response.attributes.question}
                                    response={response.attributes.response}
                                    key={response.id}
                                    id={response.id}
                                    reason={response.attributes.reason}
                                    user={response.attributes.approvedBy}
                                />
                            );
                        })
                    ) : (
                        <Empty text="Nothing to show." />
                    )}
                </div>
            </>
        );
    }
}
function Response(props) {
    /* eslint-disable no-unused-vars */
    const [formState, setFormState] = useState({
        reason: "",
    });
    const [
        approveResponse,
        { data: dataApprove, loading: loadingApprove, error: errorApprove },
    ] = useMutation(APPROVE);
    const [
        denyResponse,
        { data: dataDeny, loading: loadingDeny, error: errorDeny },
    ] = useMutation(DENY);
    const [
        deleteResponse,
        { data: dataDelete, loading: loadingDelete, error: errorDelete },
    ] = useMutation(DELETE);
    /* eslint-enable no-unused-vars */
    function handleClick(e, type, id) {
        e.preventDefault();
        if (type !== "deny") {
            document.getElementById(id).classList.add("fade-out");
        }
        switch (type) {
            case "approve":
                approveResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has been approved and should appear on the wall shortly.",
                    },
                });
                break;
            case "deny":
                //denyResponse({ variables: { id: props.id } });
                document.getElementById("deny-modal").showModal();
                document.body.style.overflow = "hidden";
                break;
            case "delete":
                deleteResponse({ variables: { id: props.id } });
                break;
            default:
                break;
        }
    }
    function modalClick(e, type) {
        e.preventDefault();
        document.body.style.overflow = "auto";
        switch (type) {
            case 1:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved due to the use of inappropriate language.",
                    },
                });
                break;
            case 2:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved due to the extremist nature of the content.",
                    },
                });
                break;
            case 3:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: "Your response has not been approved as it is not appropriate or suitable for this work.",
                    },
                });
                break;
            case 4:
                denyResponse({
                    variables: {
                        id: props.id,
                        user: cookies.get("user"),
                        reason: formState.reason,
                    },
                });
                break;
            default:
                break;
        }
    }
    return (
        <>
            <div id={props.id} className="col-12 fade-in mb-2 response-card">
                <div className="col-12 cw-response-info-bold">
                    <strong>Question: </strong>
                </div>
                <div className="col-12 cw-response-text mb-2">
                    {props.question}
                </div>
                <div className="col-12 cw-response-info-bold">
                    <strong>Response: </strong>
                </div>
                <div className="col-12 cw-response-text mb-3">
                    {props.response}
                </div>
                {props.type === "denied" ? (
                    <>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Reason: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.reason}
                        </div>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Denied by: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.user}
                        </div>
                    </>
                ) : props.type === "approved" ? (
                    <>
                        <div className="col-12 cw-response-info-bold">
                            <strong>Approved by: </strong>
                        </div>
                        <div className="col-12 cw-response-text mb-2">
                            {props.user}
                        </div>
                    </>
                ) : (
                    ""
                )}
                <div className="col-12 text-end mb-3">
                    {props.type !== "awaiting" && props.type !== "approved" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                onClick={(e) => {
                                    handleClick(e, "delete", props.id);
                                }}
                                className="btn btn-climate-red">
                                Delete
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {props.type === "awaiting" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                disabled={props.index === 0 ? false : true}
                                onClick={(e) => {
                                    handleClick(e, "approve", props.id);
                                }}
                                className="btn btn-climate">
                                Approve
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    {props.type === "awaiting" ? (
                        <div
                            className="ms-2"
                            style={{ display: "inline-block" }}>
                            <button
                                disabled={props.index === 0 ? false : true}
                                onClick={(e) => {
                                    handleClick(e, "deny", props.id);
                                }}
                                className="btn btn-climate-red">
                                Deny
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <dialog className="fade-in" id="deny-modal">
                {loadingDeny || dataDeny ? (
                    <div className="fade-in row">
                        <div className="col-12">
                            <span className="loader m-5"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h4>Please choose a reason</h4>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 1);
                                }}
                                className="btn btn-climate">
                                Inappropriate Language
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 2);
                                }}
                                className="btn btn-climate">
                                Extremist nature of the content
                            </button>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    modalClick(e, 3);
                                }}
                                className="btn btn-climate">
                                Not appropriate or suitable for this work
                            </button>
                        </div>
                        <div className="mt-3">
                            <label>Custom Response</label>
                            <input
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        reason: e.target.value,
                                    })
                                }
                                value={formState.reason}
                                type="text"
                            />
                        </div>
                        <div className="col mt-3 text-start">
                            {formState.reason !== "" ? (
                                <button
                                    onClick={(e) => {
                                        modalClick(e, 4);
                                    }}
                                    className="btn fade-in btn-climate">
                                    Submit
                                </button>
                            ) : (
                                ""
                            )}
                            <button
                                style={{ float: "inline-end" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("deny-modal")
                                        .close();
                                    document.body.style.overflow = "auto";
                                }}
                                className="btn btn-climate">
                                Close
                            </button>
                        </div>
                    </>
                )}
            </dialog>
        </>
    );
}
function Empty(props) {
    return (
        <div className="col-12 fade-in response-card">
            <div className="col-12 mb-3 cw-response-info-text">
                {props.text}
            </div>
        </div>
    );
}
