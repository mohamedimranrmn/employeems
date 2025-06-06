import express from 'express';
import jwt from "jsonwebtoken";
import { Employee, EmployeeProject } from "../models/index.js";

const router = express.Router();

router.post("/employee_login", async (req, res) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });

        if (!employee) {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }

        // Direct password comparison (plain text)
        if (req.body.password !== employee.password) {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }

        const token = jwt.sign(
            { role: "employee", email: employee.email, id: employee._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie('token', token);
        return res.json({
            loginStatus: true,
            id: employee._id
        });

    } catch (err) {
        console.error("Employee Login Error:", err);
        return res.json({ loginStatus: false, Error: "Query error" });
    }
});

router.get("/detail/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('category_id', 'name');
        if (!employee) {
            return res.json({ Status: false, Error: "Employee not found" });
        }
        return res.json({ Status: true, Result: employee });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

router.get('/employee_logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as EmployeeRouter };
