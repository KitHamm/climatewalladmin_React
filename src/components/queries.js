import { gql } from "@apollo/client";

export const QUESTIONS = gql`
    query questions {
        questions(filters: { approved: { eq: true } }, sort: ["order:asc"]) {
            data {
                id
                attributes {
                    question
                    order
                }
            }
        }
    }
`;

export const ADD_QUESTION = gql`
    mutation addQuestion($question: String!, $order: Int) {
        createQuestion(
            data: { question: $question, order: $order, approved: true }
        ) {
            data {
                id
                attributes {
                    question
                    order
                }
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

export const CURRENT_QUESTION = gql`
    query {
        currentQuestion {
            data {
                attributes {
                    number
                    updatedAt
                }
            }
        }
    }
`;

export const UPDATE_QUESTION_ORDER = gql`
    mutation updateQuestionOrder($id: ID!, $order: Int) {
        updateQuestion(id: $id, data: { order: $order }) {
            data {
                id
                attributes {
                    question
                    order
                }
            }
        }
    }
`;

export const GET_APPROVED = gql`
    query responses {
        responses(
            filters: { approved: { eq: true } }
            sort: ["createdAt:desc"]
        ) {
            data {
                id
                attributes {
                    response
                    createdAt
                    approved
                    question
                    approvedBy
                }
            }
        }
    }
`;

export const GET_DENIED = gql`
    query responses {
        responses(
            filters: { approved: { eq: false } }
            sort: ["createdAt:desc"]
        ) {
            data {
                id
                attributes {
                    response
                    createdAt
                    approved
                    question
                    reason
                    approvedBy
                }
            }
        }
    }
`;

export const GET_AWAITING = gql`
    query responses {
        responses(
            filters: { approved: { eq: null } }
            sort: ["createdAt:asc"]
        ) {
            data {
                id
                attributes {
                    response
                    createdAt
                    approved
                    question
                }
            }
        }
    }
`;

export const APPROVE = gql`
    mutation updateResponse($id: ID!, $reason: String, $user: String) {
        updateResponse(
            id: $id
            data: { approved: true, reason: $reason, approvedBy: $user }
        ) {
            data {
                id
            }
        }
    }
`;

export const DENY = gql`
    mutation updateResponse($id: ID!, $reason: String, $user: String) {
        updateResponse(
            id: $id
            data: { approved: false, reason: $reason, approvedBy: $user }
        ) {
            data {
                id
            }
        }
    }
`;

export const DELETE = gql`
    mutation updateResponse($id: ID!) {
        deleteResponse(id: $id) {
            data {
                id
            }
        }
    }
`;

export const LOGIN = gql`
    mutation LogIn($username: String!, $password: String!) {
        login(input: { identifier: $username, password: $password }) {
            jwt
            user {
                id
                username
            }
        }
    }
`;

export const FULL_NAME = gql`
    query fullName($id: ID) {
        usersPermissionsUser(id: $id) {
            data {
                attributes {
                    fullName
                    role {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
