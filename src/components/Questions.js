import { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUESTIONS, CURRENT_QUESTION } from "./queries";
import Question from "./Question";
import Loader from "./Loader";
import AddQuestion from "./AddQuestion";
import DeleteQuestion from "./DeleteQuestion";

export default function Questions(props) {
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
                            next={
                                currentQ.currentQuestion.data.attributes
                                    .number ===
                                question.attributes.order - 2
                                    ? true
                                    : false
                            }
                            prev={
                                currentQ.currentQuestion.data.attributes
                                    .number === question.attributes.order
                                    ? true
                                    : false
                            }
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
