import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../Shared/LoadingSpinner';

const BillingPage = () => {

    const [singlebill, setSinglebill] = useState({})
    const [page, setPage] = useState(0)
    const size = 10;



    //loading data using useQuery
    const { data: datas, isLoading, refetch } = useQuery({
        queryKey: ["datas", page],
        queryFn: async () => {
            const res = await fetch(`https://power-hack-server-olive.vercel.app/billing-list?page=${page}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem('Token')}`
                }
            })
            const data = await res.json()
            return data
        }
    })

    const pages = Math.ceil(datas?.count / size);
    // console.log(datas);
    // console.log(pages);

    //using loading
    if (isLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    //handlers
    const handleBill = (e) => {
        e.preventDefault()
        const form = e.target
        const Full_Name = form.name.value
        const Phone = form.phone.value
        const email = form.email.value
        const paid_amount = form.amount.value

        const bill = {
            Full_Name,
            Phone,
            email,
            paid_amount
        }
        console.log(bill);

        //sending data to server
        fetch(`https://power-hack-server-olive.vercel.app/add-billing`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `bearer ${localStorage.getItem('Token')}`
            },
            body: JSON.stringify(bill)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.acknowledged) {
                    toast.success('Your Bill added Successfully')

                }
                else {
                    toast.warn(data.message)
                }
                refetch()
            })

        //reseting form and closing modal
        form.reset()
    }

    //for getting a single bill data
    const handleUpdate = (id) => {
        //console.log(id);

        //getting a single data from server
        fetch(`https://power-hack-server-olive.vercel.app/bill?id=${id}`, {
            headers: {
                authorization: `bearer ${localStorage.getItem('Token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setSinglebill(data)
            })
    }

    //for updating bill
    const handleUpdateBill = (e) => {
        e.preventDefault()
        console.log(singlebill._id);
    }

    // for deleting bill
    const handleDeleteBill = id => {
        const ans = window.confirm('Are you Sure about to delete this bill?')
        if (ans) {
            fetch(`https://power-hack-server-olive.vercel.app/delete-billing/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${localStorage.getItem('Token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        toast.warn('Removed from database and billing list')
                    }
                    refetch()
                })
        }

    }

    return (
        <div>
            {/* heading  */}
            <div>
                <h1 className='text-3xl text-teal-300 font-bold text-center mt-3'>
                    Calculate and list your Bills here.
                </h1>
            </div>
            {/* title  */}
            <div className='mx-8 border border-3 border-green-300 flex justify-between items-center bg-slate-400 p-3 rounded mt-3'>
                <div className='flex items-center'>
                    <p className='mx-2 font-bold'>Billings</p>
                    <fieldset className=" mx-5 w-full space-y-1 dark:text-gray-100">
                        <label htmlFor="Search" className="hidden">Search</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <button type="button" title="search" className="p-1 focus:outline-none focus:ring">
                                    <svg fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4 dark:text-gray-100">
                                        <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                                    </svg>
                                </button>
                            </span>
                            <input type="search" name="Search" placeholder="Search..." className="w-32 py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none" />
                        </div>
                    </fieldset>
                </div>
                <div>
                    <label
                        className='p-3 rounded text-white bg-green-700 font-semibold'
                        htmlFor="billing-modal"
                        onClick={() => setSinglebill({})}
                    >
                        Add new bills
                    </label>
                </div>
            </div>
            {/* table  */}
            <div className=" mx-auto container p-2 rounded-md sm:p-4 dark:text-gray-100 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="w-4/5 mx-auto text-xs">
                        <thead className="rounded-t-lg dark:bg-gray-700">
                            <tr className="text-right">
                                <th title="Ranking" className="p-2 text-left">
                                    {isLoading ? 'Generating id' : 'Billing Id'}
                                </th>
                                <th title="Team name" className="p-2 text-left">Full Name</th>
                                <th title="Wins" className="p-2  text-left">Email</th>
                                <th title="Losses" className="p-2 text-left">Phone</th>
                                <th title="Win percentage" className="p-2 text-left">Paid amount</th>
                                <th title="Games behind" className="p-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                datas?.billList?.map(bill =>
                                    <tr key={bill._id} className="text-right border-b border-opacity-20 ">
                                        <td className="px-2 py-2 text-left">
                                            <span>{bill._id}</span>
                                        </td>
                                        <td className="px-2 py-2 text-left">
                                            <span>{bill.Full_Name}</span>
                                        </td>
                                        <td className="px-2 py-2 text-left">
                                            <span>{bill.email}</span>
                                        </td>
                                        <td className="px-2 py-2 text-left">
                                            <span>{bill.Phone}</span>
                                        </td>
                                        <td className="px-2 py-2 text-left">
                                            <span>{bill.paid_amount}</span>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <div>
                                                <label htmlFor="billingUpdate-modal"
                                                    onClick={() => handleUpdate(bill._id)}
                                                    className='underline'>
                                                    Edit
                                                </label>
                                                <span> || </span>
                                                <button
                                                    onClick={() => handleDeleteBill(bill._id)}
                                                    className='underline'>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {/* pagination */}
            <div className='flex justify-center'>
                <div>
                    <p className='text-center my-3'>
                        Your are in Page No. <span className='font-bold'>{page + 1}</span>
                    </p>
                    {
                        [...Array(pages)?.keys()]?.map((num, idx) => <button
                            key={idx}
                            className={`p-3 rounded bg-green-300 mx-2 hover:bg-green-500 
                            ${page === num ? 'bg-yellow-400' : ''}`}
                            onClick={() => {
                                setPage(num)
                                refetch()
                            }}
                        >
                            {num + 1}
                        </button>)
                    }
                </div>
            </div>
            {/* billing modal  */}
            <div>
                <input type="checkbox" id="billing-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative">
                        <label htmlFor="billing-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg font-bold">Add Your billing Info</h3>
                        <div className=''>
                            <form onSubmit={handleBill} className='grid grid-cols-1 gap-3 mt-10' >
                                <input name='name' type="text" placeholder="Full Name" className="input input-bordered w-full" required />
                                <input name='email' type="email" placeholder="Email" className="input input-bordered w-full" required />
                                <input name='phone' type="text" placeholder="Phone Number" className="input input-bordered w-full" required />
                                <input name='amount' type="text" placeholder="Paid amount" className="input input-bordered w-full" required />
                                <br />
                                <input type="submit" value="Submit" className="btn bg-orange-400 input w-full" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* billing update modal  */}
            <div>
                <input type="checkbox" id="billingUpdate-modal" className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative">
                        <label htmlFor="billingUpdate-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg font-bold">Add Your billing Info</h3>
                        <div className=''>
                            <form onSubmit={() => handleUpdateBill(singlebill._id)} className='grid grid-cols-1 gap-3 mt-10' >
                                <input name='name' type="text" placeholder="Full Name"
                                    defaultValue={singlebill?.Full_Name} className="input input-bordered w-full" />
                                <input name='email' type="email" placeholder="Email"
                                    defaultValue={singlebill?.email} className="input input-bordered w-full" />
                                <input name='phone' type="text" placeholder="Phone Number" defaultValue={singlebill?.Phone} className="input input-bordered w-full" required />
                                <input name='amount' type="text" placeholder="Paid amount" defaultValue={singlebill?.paid_amount} className="input input-bordered w-full" required />
                                <br />
                                <input type="submit" value="Submit" className="btn bg-orange-400 input w-full" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;