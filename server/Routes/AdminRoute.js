import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import mongoose from 'mongoose';
import { Admin, Category, Employee, Project, EmployeeProject, SalaryLog } from "../models/index.js";

const router = express.Router();

router.post("/adminlogin", async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            return res.json({ loginStatus: false, Error: "wrong email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, admin.password);

        if (!isPasswordMatch) {
            return res.json({ loginStatus: false, Error: "wrong email or password" });
        }

        const token = jwt.sign(
            { role: "admin", email: admin.email, id: admin._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );
        res.cookie('token', token);
        return res.json({ loginStatus: true });

    } catch (err) {
        console.error("Login Error:", err);
        return res.json({ loginStatus: false, Error: "Query error" });
    }
});

router.get('/category', async (req, res) => {
    try {
        const categories = await Category.find();
        return res.json({ Status: true, Result: categories });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

// UPDATED: Get salary log history
router.get('/salary', async (req, res) => {
    try {
        const salaryLogs = await SalaryLog.find()
            .sort({ change_date: -1 }) // Sort by most recent first
            .populate('employee_id', 'name email');

        return res.json({ Status: true, Result: salaryLogs });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

// NEW: Get salary logs for a specific employee
router.get('/salary/:employee_id', async (req, res) => {
    try {
        const salaryLogs = await SalaryLog.find({ employee_id: req.params.employee_id })
            .sort({ change_date: -1 })
            .populate('employee_id', 'name email');

        return res.json({ Status: true, Result: salaryLogs });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

router.post('/add_category', async (req, res) => {
    try {
        const newCategory = new Category({ name: req.body.category });
        await newCategory.save();
        return res.json({ Status: true });
    } catch (err) {
        return res.json({ Status: false, Error: "This department already exists" });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            salary: req.body.salary,
            image: req.file.filename,
            category_id: req.body.category_id
        });

        await newEmployee.save();
        return res.json({ Status: true });
    } catch (err) {
        return res.json({ Status: false, Error: err.message });
    }
});

router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find().populate('category_id', 'name');
        return res.json({ Status: true, Result: employees });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

router.get('/employee/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('category_id', 'name');
        if (!employee) {
            return res.json({ Status: false, Error: "Employee not found" });
        }
        return res.json({ Status: true, Result: [employee] });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error" });
    }
});

// UPDATED: Edit employee with salary logging
router.put('/edit_employee/:id', async (req, res) => {
    try {
        // First, get the current employee data to compare salary
        const currentEmployee = await Employee.findById(req.params.id);

        if (!currentEmployee) {
            return res.json({ Status: false, Error: "Employee not found" });
        }

        const oldSalary = currentEmployee.salary;
        const newSalary = parseFloat(req.body.salary);

        // Update the employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                salary: newSalary,
                address: req.body.address,
                category_id: req.body.category_id
            },
            { new: true }
        );

        // If salary changed, log it
        if (oldSalary !== newSalary) {
            const salaryLog = new SalaryLog({
                employee_id: req.params.id,
                name: req.body.name, // Store name for easy access
                old_salary: oldSalary,
                new_salary: newSalary,
                change_date: new Date(),
                reason: 'Admin Updated Salary'
            });

            await salaryLog.save();
            console.log(`Salary change logged for employee ${req.body.name}: ${oldSalary} -> ${newSalary}`);
        }

        return res.json({
            Status: true,
            Result: updatedEmployee,
            SalaryChanged: oldSalary !== newSalary
        });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.delete('/delete_employee/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.json({ Status: false, Error: "Employee not found" });
        }

        // Optional: Also delete salary logs for this employee
        await SalaryLog.deleteMany({ employee_id: req.params.id });

        return res.json({ Status: true, Result: deletedEmployee });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/admin_count', async (req, res) => {
    try {
        const count = await Admin.countDocuments();
        return res.json({ Status: true, Result: [{ admin: count }] });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.post('/add_admin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });

        const result = await newAdmin.save();
        return res.json({ Status: true, Result: result });

    } catch (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ Status: false, Error: err.message });
    }
});


router.delete('/delete_admin/:id', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.json({ Status: false, Error: "Admin not found" });
        }
        return res.json({ Status: true, Result: deletedAdmin });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.delete('/delete_category/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.json({ Status: false, Error: "Category not found" });
        }
        return res.json({ Status: true, Result: deletedCategory });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/employee_count', async (req, res) => {
    try {
        const count = await Employee.countDocuments();
        return res.json({ Status: true, Result: [{ Employee_Count: count }] });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/salary_count', async (req, res) => {
    try {
        const result = await Employee.aggregate([
            { $group: { _id: null, salaryOFEmp: { $sum: "$salary" } } }
        ]);
        const totalSalary = result.length > 0 ? result[0].salaryOFEmp : 0;
        return res.json({ Status: true, Result: [{ salaryOFEmp: totalSalary }] });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/admin_records', async (req, res) => {
    try {
        const admins = await Admin.find();
        return res.json({ Status: true, Result: admins });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.post('/add_project', async (req, res) => {
    try {
        const newProject = new Project({
            name: req.body.name,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        });
        const result = await newProject.save();
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: err.message });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        return res.json({ Status: true, Result: projects });
    } catch (err) {
        return res.json({ Status: false, Error: err.message });
    }
});

router.get('/project/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.json({ Status: false, Error: "Project not found" });
        }
        return res.json({ Status: true, Result: [project] });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.put('/update_project/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                start_date: req.body.start_date,
                end_date: req.body.end_date
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.json({ Status: false, Error: "Project not found" });
        }

        return res.json({ Status: true, Result: updatedProject });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.delete('/delete_project/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.json({ Status: false, Error: "Project not found" });
        }
        return res.json({ Status: true, Result: deletedProject });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.post('/assign_employee', async (req, res) => {
    try {
        const newAssignment = new EmployeeProject({
            employee_id: req.body.id,
            project_id: req.body.project_id,
            role: req.body.role
        });
        const result = await newAssignment.save();
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/assignments', async (req, res) => {
    try {
        const assignments = await EmployeeProject.find()
            .populate('employee_id', 'name email')
            .populate('project_id', 'name');
        return res.json({ Status: true, Result: assignments });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/assignments/project/:project_id', async (req, res) => {
    try {
        const assignments = await EmployeeProject.find({ project_id: req.params.project_id })
            .populate('employee_id', 'name email')
            .populate('project_id', 'name');
        return res.json({ Status: true, Result: assignments });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/assignments/employee/:id', async (req, res) => {
    try {
        const assignments = await EmployeeProject.find({ employee_id: req.params.id })
            .populate('employee_id', 'name email')
            .populate('project_id', 'name start_date end_date');

        return res.json({ Status: true, Result: assignments });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.delete('/remove_assignment/:id/:project_id', async (req, res) => {
    try {
        const { id, project_id } = req.params;
        const deletedAssignment = await EmployeeProject.findOneAndDelete({
            employee_id: id,
            project_id: project_id
        });

        if (!deletedAssignment) {
            return res.json({ Status: false, Error: "Assignment not found" });
        }

        return res.json({ Status: true, Result: deletedAssignment });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/employee_projects', async (req, res) => {
    try {
        const employeeProjects = await EmployeeProject.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employee_id',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'project_id',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $unwind: '$project'
            },
            {
                $project: {
                    employee_name: '$employee.name',
                    employee_email: '$employee.email',
                    project_name: '$project.name',
                    project_start_date: '$project.start_date',
                    project_end_date: '$project.end_date',
                    role: 1
                }
            }
        ]);

        return res.json({ Status: true, Result: employeeProjects });
    } catch (err) {
        return res.json({ Status: false, Error: err.message });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };