import express from "express";
import jwt from "jsonwebtoken";
import studentRoutes from "../src/routes/studentRoutes.js";
import healthRoutes from "../src/routes/healthRoutes.js";
import { notFound, errorHandler } from "../src/middleware/errorMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "edge-cases-jwt-secret-key-12345";
process.env.JWT_SECRET = JWT_SECRET;

const app = express();
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/students", studentRoutes);
app.use(notFound);
app.use(errorHandler);

const runEdgeCaseTests = async () => {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`PASS: ${name}`);
      passed++;
    } else {
      console.error(`FAIL: ${name}`);
      failed++;
    }
  };

  try {
    // 1. Expired JWT Token
    const expiredToken = jwt.sign(
      { id: "507f1f77bcf86cd799439011", role: "admin" },
      JWT_SECRET,
      { expiresIn: "-10s" } // expired 10 seconds ago
    );

    const resExpired = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${expiredToken}`,
      },
      body: JSON.stringify({ fullName: "Test Student" }),
    });
    const dataExpired = await resExpired.json().catch(() => ({}));
    assert(
      resExpired.status === 401 && dataExpired.message === "Invalid or expired token",
      "Expired token returns HTTP 401 with 'Invalid or expired token' message"
    );

    // 2. Malformed JWT Token signature
    const malformedToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
    const resMalformed = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: malformedToken,
      },
      body: JSON.stringify({ fullName: "Test Student" }),
    });
    const dataMalformed = await resMalformed.json().catch(() => ({}));
    assert(
      resMalformed.status === 401 && dataMalformed.message === "Invalid or expired token",
      "Malformed token signature returns HTTP 401"
    );

    // 3. Invalid MongoDB ObjectId for GET /api/students/:id
    const resInvalidGetId = await fetch(`${baseUrl}/api/students/not-a-valid-id`);
    const dataInvalidGetId = await resInvalidGetId.json().catch(() => ({}));
    assert(
      resInvalidGetId.status === 400 && dataInvalidGetId.message.includes("Invalid student ID"),
      "Invalid student ID in GET returns HTTP 400"
    );

    // 4. Invalid MongoDB ObjectId for PUT /api/students/:id
    const resInvalidPutId = await fetch(`${baseUrl}/api/students/123-bad-id`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        role: "admin",
      },
      body: JSON.stringify({ fullName: "Test Name" }),
    });
    const dataInvalidPutId = await resInvalidPutId.json().catch(() => ({}));
    assert(
      resInvalidPutId.status === 400 && dataInvalidPutId.message.includes("Invalid student ID"),
      "Invalid student ID in PUT returns HTTP 400"
    );

    // 5. Invalid MongoDB ObjectId for DELETE /api/students/:id
    const resInvalidDeleteId = await fetch(`${baseUrl}/api/students/bad-id-xyz`, {
      method: "DELETE",
      headers: {
        role: "admin",
      },
    });
    const dataInvalidDeleteId = await resInvalidDeleteId.json().catch(() => ({}));
    assert(
      resInvalidDeleteId.status === 400 && dataInvalidDeleteId.message.includes("Invalid student ID"),
      "Invalid student ID in DELETE returns HTTP 400"
    );

    // 6. Missing required fields in POST
    const resMissingFields = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        role: "admin",
      },
      body: JSON.stringify({
        fullName: "Incomplete Record",
        // missing email, studentId, course, rollNo
      }),
    });
    const dataMissingFields = await resMissingFields.json().catch(() => ({}));
    assert(
      resMissingFields.status === 400 && dataMissingFields.message.includes("required"),
      "Missing required fields returns HTTP 400"
    );

    // 7. Unknown API Route (404 Not Found)
    const res404 = await fetch(`${baseUrl}/api/unregistered-path`);
    const data404 = await res404.json().catch(() => ({}));
    assert(
      res404.status === 404 && data404.message.toLowerCase().includes("not found"),
      "Unregistered route returns HTTP 404 Not Found"
    );

    console.log(`\nEdge Case Tests completed: ${passed} passed, ${failed} failed`);
    server.close();
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Edge case test error:", err);
    server.close();
    process.exit(1);
  }
};

runEdgeCaseTests();
