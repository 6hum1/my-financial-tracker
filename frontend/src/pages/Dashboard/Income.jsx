import React, { useState, useEffect } from 'react'
import IncomeOverview from '../../components/Income/IncomeOverview'
import DashbardLayout from '../../components/Layout/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast'
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';


const Income = () => {

    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    })

    const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false)

    //get all income details 
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`)

            if (response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong.Please try again later.")
        } finally {
            setLoading(false);
        }
    }

    //handle add income 
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        //validation checks
        if (!source.trim()) {
            toast.error("Source is required");
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
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon
            })

            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
            fetchIncomeDetails();

        } catch (error) {
            console.error("Error adding income :",)
            error.response?.data?.message || error.message
        }
    }

    //delete income

    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully")
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error deleting income .Please try again later.", error.response?.data?.message || error.message);
        }
    }

    //handle download income details
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'income_details.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading income details:', error);
            toast.error("Failed to download income details.");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        return () => { }
    }, [])
    return (
        <DashbardLayout activeMenu='Income'>
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={(() => setOpenAddIncomeModal(true))}
                        />

                    </div>
                </div>

                <IncomeList transactions={incomeData} onDelete={(id) => {
                    setOpenDeleteAlert({ show: true, data: id })
                   
                }}   onDownload = { handleDownloadIncomeDetails }/>

                <Modal isOpen={OpenAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income">
                    <DeleteAlert content="Are you sure you want to delete this income details?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)} />
                </Modal>
            </div>
        </DashbardLayout>
    )
}

export default Income