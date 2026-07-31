"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CustomerList } from "./components/CustomerList";

const customerSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerCode: z.string().min(1, "Customer code is required"),
  contactPerson: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  mobileNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10}$/.test(val), {
      message: "Mobile number must be 10 digits",
    }),
  gstNumber: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

const initialForm = {
  customerName: "",
  customerCode: "",
  contactPerson: "",
  email: "",
  mobileNumber: "",
  gstNumber: "",
  address: "",
  state: "",
  status: "Active",
};

export default function CustomerMasterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [id, setId] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaved(false);

    const result = customerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Customer update data:", result.data);
      try {
        await axios.put(`http://localhost:8080/api/customers/${id.id}`, {
          
              customerName: result.data?.customerName, customerCode: result.data?.customerCode, email:
              result.data?.email, mobileNumber: result.data?.mobileNumber, contactPerson: result.data?.contactPerson, gstNumber: result.data?.gstNumber, address: result.data?.address, state: result.data?.state
          
        })
      } catch (error) {
        console.log(error)
      }
    

    setSaved(true);
    setForm(initialForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(false);

    const result = customerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Customer data:", result.data);
    await axios.post(`http://localhost:8080/api/customers`,
      {
        customerName: result.data.customerName, customerCode: result.data.customerCode, email:
          result.data.email, mobileNumber: result.data.mobileNumber, contactPerson: result.data.contactPerson, gstNumber: result.data.gstNumber, address: result.data.address, state: result.data.state
      })

    setSaved(true);
    setForm(initialForm);
    console.log("hiiii")
  }
  useEffect(() => {
    setForm(id)
  }, [id])
  return (
    <>
      <div className="min-h-screen relative bg-gray-100 flex justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900">Customer Master</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">Add a new customer record</p>

          {
            id ?

              <form onSubmit={(e) => handleUpdate(e)} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    label="Customer Name"
                    required
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                  />
                  <Field
                    label="Customer Code"
                    required
                    name="customerCode"
                    value={form.customerCode}
                    onChange={handleChange}
                    error={errors.customerCode}
                  />
                  <Field
                    label="Contact Person"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                  />
                  <Field
                    label="Email"
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <Field
                    label="Mobile Number"
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    error={errors.mobileNumber}
                  />
                  <Field
                    label="GST Number"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>

                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-end gap-4">
                  {saved && (
                    <span className="text-sm font-medium text-green-600">
                      Customer Updated
                    </span>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-5 py-2.5"
                  >
                    Update Customer
                  </button>

                  <button
                    onClick={() => setId("")}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md px-5 py-2.5"
                  >
                    Close
                  </button>

                </div>
              </form>
              :
              <form onSubmit={(e) => handleSubmit(e)} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    label="Customer Name"
                    required
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                  />
                  <Field
                    label="Customer Code"
                    required
                    name="customerCode"
                    value={form.customerCode}
                    onChange={handleChange}
                    error={errors.customerCode}
                  />
                  <Field
                    label="Contact Person"
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                  />
                  <Field
                    label="Email"
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <Field
                    label="Mobile Number"
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    error={errors.mobileNumber}
                  />
                  <Field
                    label="GST Number"
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={form.address}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>

                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-end gap-4">
                  {saved && (
                    <span className="text-sm font-medium text-green-600">
                      Customer saved
                    </span>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-5 py-2.5"
                  >
                    Save Customer
                  </button>

                </div>
              </form>
          }
        </div>
      </div>

      <div className="w-full mx-w-[1152px]">
        <CustomerList setId={setId} />
      </div>

    </>
  );
}

function Field({ label, name, value, onChange, required, type = "text", error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`border rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${error ? "border-red-500" : "border-gray-300"
          }`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}