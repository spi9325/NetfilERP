import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import { prisma } from './prismaClient.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.get('/api/customers',async (req, res) => {
 try {
  const result = await prisma.customer.findMany({});
  res.json({result})
 } catch (error) {
  console.log(error);
 }
});

app.post("/api/customers", async (req, res) => {
  try {
    const { customerName, customerCode, email, mobileNumber, contactPerson, gstNumber, address, state, status } = req.body;

   
    if (!customerName || !customerCode || !email) {
      return res.status(400).json({ error: "customerName, customerCode and email are required" });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    
    if (mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Mobile number must be 10 digits" });
    }

    
    const existing = await prisma.customer.findUnique({
      where: { customerCode },
    });
    if (existing) {
      return res.status(409).json({ error: "Customer code already exists" });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        customerName,
        customerCode,
        email,
        mobileNumber,
        contactPerson,
        gstNumber,
        address,
        state,
        status: status || "Active",
      },
    });

    return res.status(201).json(newCustomer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong while saving the customer" });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerCode, email, mobileNumber, contactPerson, gstNumber, address, state, status } = req.body;

    
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Customer not found" });
    }

    
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    
    if (mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Mobile number must be 10 digits" });
    }

    
    if (customerCode && customerCode !== existing.customerCode) {
      const codeTaken = await prisma.customer.findUnique({ where: { customerCode } });
      if (codeTaken) {
        return res.status(409).json({ error: "Customer code already exists" });
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        customerName,
        customerCode,
        email,
        mobileNumber,
        contactPerson,
        gstNumber,
        address,
        state,
        status,
      },
    });

    return res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong while updating the customer" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});