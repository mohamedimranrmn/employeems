import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const employeeProjectSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const salaryLogSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    old_salary: {
        type: Number,
        required: true
    },
    new_salary: {
        type: Number,
        required: true
    },
    change_date: {
        type: Date,
        default: Date.now
    },
    changed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
    },
    reason: {
        type: String,
        default: 'Salary Update'
    }
}, {
    timestamps: true
});

const salarySchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {
    timestamps: true
});

export const Admin = mongoose.model('Admin', adminSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Employee = mongoose.model('Employee', employeeSchema);
export const Project = mongoose.model('Project', projectSchema);
export const EmployeeProject = mongoose.model('EmployeeProject', employeeProjectSchema);
export const SalaryLog = mongoose.model('SalaryLog', salaryLogSchema);
export const Salary = mongoose.model('Salary', salarySchema);