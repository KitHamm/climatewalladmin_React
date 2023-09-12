import { gql } from "@apollo/client";

export const DATA = gql`
    query {
        climatewall {
            data {
                attributes {
                    Words {
                        word
                    }
                    Questions {
                        question
                    }
                }
            }
        }
    }
`;

export const WORDS = gql`
    query {
        words {
            data {
                id
                attributes {
                    word
                    approved
                }
            }
        }
    }
`;

export const QUESTIONS = gql`
    query {
        questions {
            data {
                id
                attributes {
                    question
                    approved
                }
            }
        }
    }
`;

export const APPROVE_WORD = gql`
    mutation approveWord($id: ID!, $approved: Boolean) {
        updateWord(id: $id, data: { approved: $approved }) {
            data {
                attributes {
                    approved
                }
            }
        }
    }
`;

export const APPROVE_QUESTION = gql`
    mutation approveQuestion($id: ID!, $approved: Boolean) {
        updateQuestion(id: $id, data: { approved: $approved }) {
            data {
                attributes {
                    approved
                }
            }
        }
    }
`;

export const ADD_WORD = gql`
    mutation addWord($word: String!) {
        createWord(data: { word: $word }) {
            data {
                id
                attributes {
                    word
                    approved
                }
            }
        }
    }
`;

export const ADD_QUESTION = gql`
    mutation addQuestion($question: String!) {
        createQuestion(data: { question: $question }) {
            data {
                id
                attributes {
                    question
                    approved
                }
            }
        }
    }
`;

export const DELETE_WORD = gql`
    mutation deleteWord($id: ID!) {
        deleteWord(id: $id) {
            data {
                id
            }
        }
    }
`;

export const DELETE_QUESTION = gql`
    mutation deleteQuestion($id: ID!) {
        deleteQuestion(id: $id) {
            data {
                id
            }
        }
    }
`;
