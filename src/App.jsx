import {useEffect, useState} from "react";
import PaymentForm from './components/PaymentForm.jsx';
import PaymentsTable from './components/PaymentsTable.jsx';
import ReportSidebar from './components/ReportSidebar.jsx';
import {Readme} from "./components/Readme.jsx";
import {Footer} from "./components/Footer.jsx";
import {
    createPaymentIdForNew,
    loadPayments,
    loadReportSettings,
    savePayments,
    saveReportSettings,
} from './helpers/paymentsStorage.js';

function App() {
    const [payments, setPayments] = useState(loadPayments);
    const [report, setReport] = useState(loadReportSettings);

    const addPayment = (p) => setPayments(prev => [...prev, {...p, id: createPaymentIdForNew()}]);
    const handleDelete = (id) => setPayments(prev => prev.filter(p => p.id !== id));

    const setReportYear = (year) => setReport(prev => ({...prev, year: Number(year)}));
    const setReportMonth = (month) => setReport(prev => ({...prev, month: Number(month)}));

    const setYearAdjustment = (value) => {
        const amount = value === '' ? 0 : Number(value);
        setReport(prev => ({
            ...prev,
            yearAdjustments: {
                ...prev.yearAdjustments,
                [prev.year]: amount,
            },
        }));
    };

    useEffect(() => {
        savePayments(payments);
    }, [payments]);

    useEffect(() => {
        saveReportSettings(report);
    }, [report]);

    const yearAdjustment = report.yearAdjustments[report.year] ?? 0;

    return (
        <div className='min-h-screen w-full flex flex-col bg-black text-white px-6 py-5'>
            <div className='flex-1 flex flex-col justify-center w-full'>
                <div className='w-full max-w-5xl mx-auto flex flex-col gap-6'>
                    <div className='flex flex-col lg:flex-row gap-6 items-start justify-center'>

                    <main className='flex-1 min-w-0 w-full space-y-6'>
                        <h1 className='text-xl lg:text-2xl font-semibold'>🇬🇪 Входящие платежи в лари</h1>

                        <PaymentForm onAdd={addPayment} />
                        <PaymentsTable
                            payments={payments}
                            reportYear={report.year}
                            reportMonth={report.month}
                            onDelete={handleDelete}
                        />
                        <Readme/>
                    </main>

                    <ReportSidebar
                        payments={payments}
                        reportYear={report.year}
                        reportMonth={report.month}
                        yearAdjustment={yearAdjustment}
                        onReportYearChange={setReportYear}
                        onReportMonthChange={setReportMonth}
                        onYearAdjustmentChange={setYearAdjustment}
                    />
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default App
