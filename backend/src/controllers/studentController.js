import mongoose from "mongoose";
import Student from "../models/Student.js";

const getAllStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Invalid page or limit",
      });
    }

    const filter = {};

    if (req.query.course) {
      filter.course = req.query.course;
    }

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalStudents = await Student.countDocuments(filter);

    res.status(200).json({
      count: students.length,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      students,
    });
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      student,
    });
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const { studentId, fullName, email, course, rollNo } = req.body;

    if (!studentId || !fullName || !email || !course || !rollNo) {
      return res.status(400).json({
        message: "All fields are required (studentId, fullName, email, course, rollNo)",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [{ studentId }, { email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this studentId, email, or rollNo already exists",
      });
    }

    const student = await Student.create({
      studentId: studentId.trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      rollNo: rollNo.trim(),
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Student with this studentId, email, or rollNo already exists",
      });
    }
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const { studentId, fullName, email, course, rollNo } = req.body;

    const updates = {};
    if (studentId !== undefined) updates.studentId = studentId.trim();
    if (fullName !== undefined) updates.fullName = fullName.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (course !== undefined) updates.course = course.trim();
    if (rollNo !== undefined) updates.rollNo = rollNo.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    if (updates.studentId || updates.email || updates.rollNo) {
      const duplicateConditions = [];
      if (updates.studentId) duplicateConditions.push({ studentId: updates.studentId });
      if (updates.email) duplicateConditions.push({ email: updates.email });
      if (updates.rollNo) duplicateConditions.push({ rollNo: updates.rollNo });

      const existingStudent = await Student.findOne({
        _id: { $ne: id },
        $or: duplicateConditions,
      });

      if (existingStudent) {
        return res.status(400).json({
          message: "Student with this studentId, email, or rollNo already exists",
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Student with this studentId, email, or rollNo already exists",
      });
    }
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student,
    });
  } catch {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
