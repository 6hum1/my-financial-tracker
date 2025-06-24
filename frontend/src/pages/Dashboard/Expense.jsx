import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashbardLayout from '../../components/Layout/DashboardLayout'
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import Modal from '../../components/Modal';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast'
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    })

    const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false)

    //get all expense details 
    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)
            console.log("Fetched expense data:", response.data);

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong.Please try again later.")
        } finally {
            setLoading(false);
        }
    }

    //handle add expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense;

        //validation checks
        if (!category.trim()) {
            toast.error("category is required");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.");
            return;
        }

        if (!date) {
            toast.error("Date is required");
            return;
        }

        try {
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category,
                amount,
                date,
                icon
            })

            setOpenAddExpenseModal(false);
            toast.success("Expense added successfully");
            fetchExpenseDetails();

        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("Error adding expense:", errorMsg);
            toast.error(errorMsg || "Something went wrong. Please try again.");
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense deleted successfully")
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error deleting Expense .Please try again later.", error.response?.data?.message || error.message);
        }
    }

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
                responseType: 'blob', // IMPORTANT
            });

            // Create a blob from the response
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'expense_details.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading Excel:', error);
            toast.error("Failed to download expense details.");
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        return () => { }
    }, [])
    return (
        <DashbardLayout activeMenu='Expense'>
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <ExpenseOverview
                            transactions={expenseData}
                            onAddExpense={(() => setOpenAddExpenseModal(true))}
                        />

                        <ExpenseList transactions={expenseData} onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id })
                             } 
                        } onDownload = { handleDownloadExpenseDetails} />

                    </div>
                </div>

                <Modal isOpen={OpenAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title="Add Expense">
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense">
                    <DeleteAlert content="Are you sure you want to delete this expense details?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)} />
                </Modal>
            </div>
        </DashbardLayout>
    )
}

export default Expense