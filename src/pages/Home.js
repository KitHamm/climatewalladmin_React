import { useState } from "react";
import { useMutation } from "@apollo/client";
import Words from "../components/Words";
import Questions from "../components/Questions";
import { ADD_QUESTION, ADD_WORD } from "../components/queries";
export default function Home() {
    const [question, setQuestion] = useState("");
    const [word, setWord] = useState("");
    /* eslint-disable no-unused-vars */
    const [
        addWord,
        { loading: loadingWord, error: errorWord, data: dataWord },
    ] = useMutation(ADD_WORD, { variables: { word: word } });
    const [
        addQuestion,
        { loading: loadingQuestion, error: errorQuestion, data: dataQuestion },
    ] = useMutation(ADD_QUESTION, { variables: { question: question } });
    /* eslint-enable no-unused-vars */

    function handleAddWord(e) {
        e.preventDefault();
        addWord();
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    }
    function handleAddQuestion(e) {
        e.preventDefault();
        addQuestion();
        setTimeout(function () {
            window.location.reload();
        }, 1000);
    }

    return (
        <div className="container">
            <div className="row text-center mt-5">
                <div className="col-12">
                    <h1>Questions</h1>
                </div>
            </div>
            <Questions />
            <input
                type="text"
                placeholder="Add a new question"
                onChange={(e) => {
                    e.preventDefault();
                    setQuestion(e.target.value);
                }}
            />
            <div className="row text-center">
                <div className="col-12">
                    <button
                        className="btn btn-success"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddQuestion(e);
                        }}>
                        Add Question
                    </button>
                </div>
            </div>
            <div className="row text-center mt-5">
                <div className="col-12">
                    <h1>Words</h1>
                </div>
            </div>
            <Words />
            <input
                type="text"
                placeholder="Add a new word"
                onChange={(e) => {
                    setWord(e.target.value);
                }}
            />
            <div className="row text-center">
                <div className="col-12">
                    <button
                        className="btn btn-success"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddWord(e);
                        }}>
                        Add Word
                    </button>
                </div>
            </div>
            <div className="row mb-5"></div>
        </div>
    );
}
