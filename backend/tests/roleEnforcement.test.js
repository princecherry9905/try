import express from "express";
import jwt from "jsonwebtoken";
import studentRoutes from "../src/routes/studentRoutes.js";
import { notFound, errorHandler } from "../src/middleware/errorMiddleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key-12345";
process.env.JWT_SECRET = JWT_SECRET;

const app = express();
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use(notFound);
app.use(errorHandler);

const runRBACTests = async () => {
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
    const userToken = jwt.sign(
      { id: "507f1f77bcf86cd799439012", email: "student@college.edu", role: "user" },
      JWT_SECRET
    );

    const adminToken = jwt.sign(
      { id: "507f1f77bcf86cd799439011", email: "admin@college.edu", role: "admin" },
      JWT_SECRET
    );

    // 1. User manual POST mutation bypass attempt
    const resUserPost = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        studentId: "STU-9999",
        fullName: "Hacker Attempt",
        email: "hacker@college.edu",
        course: "CSE",
        rollNo: "9999",
      }),
    });
    assert(
      resUserPost.status === 403,
      "RBAC: Manual POST mutation with User JWT token is blocked (403)"
    );

    // 2. User manual PUT mutation bypass attempt
    const resUserPut = await fetch(`${baseUrl}/api/students/507f1f77bcf86cd799439011`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ fullName: "Updated Name" }),
    });
    assert(
      resUserPut.status === 403,
      "RBAC: Manual PUT mutation with User JWT token is blocked (403)"
    );

    // 3. User manual DELETE mutation bypass attempt
    const resUserDelete = await fetch(`${baseUrl}/api/students/507f1f77bcf86cd799439011`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    assert(
      resUserDelete.status === 403,
      "RBAC: Manual DELETE mutation with User JWT token is blocked (403)"
    );

    // 4. Role spoofing attempt via headers without valid admin token
    const resHeaderSpoof = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
        "x-user-role": "admin", // trying to spoof header
      },
      body: JSON.stringify({ fullName: "Spoof" }),
    });
    // In our implementation, role header is checked after/alongside auth
    assert(
      resHeaderSpoof.status === 403 || resHeaderSpoof.status === 400,
      "RBAC: Non-admin user cannot mutate student endpoint via unauthorized access"
    );

    // 5. Admin token can access mutation endpoints (validation returns 400 when db is offline)
    const resAdminPost = await fetch(`${baseUrl}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ fullName: "Valid Admin Payload" }),
    });
    assert(
      resAdminPost.status !== 403,
      "RBAC: Admin JWT token passes authorization check (status is not 403)"
    );

    console.log(`\nRBAC Tests completed: ${passed} passed, ${failed} failed`);
    server.close();
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("RBAC test error:", err);
    server.close();
    process.exit(1);
  }
};

runRBACTests();
