
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios';

interface PropsType{
    setId:Dispatch<SetStateAction<string>>
}

export const CustomerList = ({setId}:PropsType) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const res = await fetch("http://localhost:8080/api/customers");

                if (!res.ok) {
                    throw new Error("Failed to fetch customers");
                }

                const data = await res.json();
                console.log(data.result);
                setCustomers(data.result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    
    return (
        <>
        <Table className='p-20'>
            <TableCaption>A list of your Data.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">customerName</TableHead>
                    <TableHead>customerCode</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>mobileNumber</TableHead>
                    <TableHead>contactPerson</TableHead>
                    <TableHead>gstNumber</TableHead>
                    <TableHead>address</TableHead>
                    <TableHead>state</TableHead>
                    <TableHead>Update</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    customers.map((cur) => (
                        <TableRow>
                            <TableCell className="font-medium">{cur.customerName}</TableCell>
                            <TableCell>{cur.customerCode}</TableCell>
                            <TableCell>{cur.email}</TableCell>
                            <TableCell>{cur.mobileNumber}</TableCell>
                            <TableCell>{cur.contactPerson}</TableCell>
                            <TableCell>{cur.gstNumber}</TableCell>
                            <TableCell>{cur.address}</TableCell>
                            <TableCell>{cur.state}</TableCell>
                            <TableCell>
                                <button onClick={()=>setId(cur)} className='bg-amber-300 py-2 px-4 cursor-progress rounded-2xl'>Update</button>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
        </>
    )
}
