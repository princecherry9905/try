# API Edge Cases & HTTP Response Code Matrix

This document defines and verifies standard HTTP status codes, error messages, and payload schemas across the application for Issue #28.

## 1. Authentication & Authorization Errors

| Scenario | HTTP Status | Response Payload | Verification Method |
| :--- | :--- | :--- | :--- |
| **Expired JWT Token** | `401 Unauthorized` | `{"message": "Invalid or expired token"}` | Verified via `node tests/edgeCases.test.js` |
| **Malformed Signature** | `401 Unauthorized` | `{"message": "Invalid or expired token"}` | Verified via `node tests/edgeCases.test.js` |
| **Missing Auth Header** | `403 Forbidden` | `{"message": "Access denied. Admin only."}` | Verified via `node tests/api.test.js` |
| **Non-Admin Mutation** | `403 Forbidden` | `{"message": "Access denied. Admin only."}` | Verified via `node tests/api.test.js` |

## 2. Validation & Input Format Errors

| Scenario | HTTP Status | Response Payload | Verification Method |
| :--- | :--- | :--- | :--- |
| **Invalid MongoDB ObjectId** | `400 Bad Request` | `{"message": "Invalid student ID format: <id>"}` | Verified on GET/PUT/DELETE |
| **Missing Required Fields** | `400 Bad Request` | `{"message": "All fields are required"}` | Verified on POST `/api/students` |
| **Duplicate Key (E11000)** | `400 Bad Request` | `{"message": "...already exists"}` | Handled with clean frontend client banner |

## 3. Resource & Routing Errors

| Scenario | HTTP Status | Response Payload | Verification Method |
| :--- | :--- | :--- | :--- |
| **Unregistered Route** | `404 Not Found` | `{"message": "Route not found: <path>"}` | Handled by `notFound` middleware |
| **Non-Existent Student ID** | `404 Not Found` | `{"message": "Student not found"}` | Handled by student controller |

## Automated Test Command

Run the edge-case regression suite using:
```bash
npm run test:edge-cases
```
