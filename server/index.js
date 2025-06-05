import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import "./utils/db.js";

dotenv.config();

const port= process.env.PORT;

const app = express();

app.use(cors({
    origin: true, // Allow all origins for development; adjust for production
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use(express.static('Public'));

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        // Use the same JWT secret as in AdminRoute
        Jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`JWT Secret configured: ${process.env.JWT_SECRET_KEY ? 'Yes' : 'No'}`);
});