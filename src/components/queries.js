import { gql } from "@apollo/client";

export const GET_APPROVED = gql`
    query responses {
        responses(filters: { approved: { eq: true } }) {
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

export const GET_DENIED = gql`
    query responses {
        responses(filters: { approved: { eq: false } }) {
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

export const GET_AWAITING = gql`
    query responses {
        responses(filters: { approved: { eq: null } }) {
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
    mutation updateResponse($id: ID!, $reason: String) {
        updateResponse(id: $id, data: { approved: true, reason: $reason }) {
            data {
                id
            }
        }
    }
`;

export const DENY = gql`
    mutation updateResponse($id: ID!, $reason: String) {
        updateResponse(id: $id, data: { approved: false, reason: $reason }) {
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
