import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary', (req, res) => {
    const sql = "SELECT * FROM salary";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "This department already exists"})
        return res.json({Status: true})
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from employee Where id = ?`
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


router.post('/add_admin',(req, res) => {
    const { email, password } = req.body;

    const sql = `INSERT INTO admin (email, password) VALUES (?, ?)`;
    const values = [email, password];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ Status: false, Error: err.message });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.delete('/delete_admin/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from admin Where id = ?`
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_category/:id', (req, res) => {
    const id = req.params.id;
    const sql = `delete from category Where id = ?`
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})



router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as Employee_Count from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_project', (req, res) => {
    const sql = `INSERT INTO projects (name, start_date, end_date) VALUES (?, ?, ?)`;
    const values = [req.body.name, req.body.start_date, req.body.end_date];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/projects', (req, res) => {
    const sql = `SELECT * FROM projects`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/project/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM projects WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.put('/update_project/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE projects SET name = ?, start_date = ?, end_date = ? WHERE id = ?`;
    const values = [req.body.name, req.body.start_date, req.body.end_date, id];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.delete('/delete_project/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM projects WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.post('/assign_employee', (req, res) => {
    const sql = `INSERT INTO employee_projects (id, project_id, role) VALUES (?, ?, ?)`;
    const values = [req.body.id, req.body.project_id, req.body.role];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/assignments', (req, res) => {
    const sql = `SELECT * FROM employee_projects`;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/assignments/project/:project_id', (req, res) => {
    const project_id = req.params.project_id;
    const sql = `SELECT * FROM employee_projects WHERE project_id = ?`;
    con.query(sql, [project_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.get('/assignments/employee/:id', (req, res) => {
    const id = req.params.employee_id;
    const sql = `SELECT * FROM employee_projects WHERE id = ?`;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});

router.delete('/remove_assignment/:id/:project_id', (req, res) => {
    const { id, project_id } = req.params;
    const sql = `DELETE FROM employee_projects WHERE id = ? AND project_id = ?`;
    con.query(sql, [id, project_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error: " + err });
        return res.json({ Status: true, Result: result });
    });
});


router.get('/employee_projects', (req, res) => {
    const sql = 'SELECT * FROM project_details';
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    });
});


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
});



export { router as adminRouter };