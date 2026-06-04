import {useEffect, useState} from "react";
import PaymentForm from './components/PaymentForm.jsx';
import PaymentsTable from './components/PaymentsTable.jsx';
import ReportSidebar from './components/ReportSidebar.jsx';
import {Readme} from "./components/Readme.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
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
        <div className='min-h-screen w-full flex flex-col px-4 sm:px-6'>
            <a
                href='#main-content'
                className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-1.5 focus:text-[13px] focus:text-white'
                style={{ backgroundColor: 'var(--apple-blue)' }}
            >
                Перейти к содержимому
            </a>

            <div className='flex-1 flex items-center justify-center py-8 w-full'>
                <div className='w-full max-w-4xl'>
                    <header className='mb-6 flex items-center justify-between gap-4 separator border-b pb-5'>
                        <div>
                            <h1 className='page-title'>
                                🇬🇪 Входящие платежи в лари
                            </h1>
                            <p className='page-subtitle'>
                                Курс НБГ · налоговая отчётность
                            </p>
                        </div>
                        <ThemeToggle />
                    </header>

                    <div className='flex flex-col lg:flex-row gap-4 items-start'>
                        <main id='main-content' className='flex-1 min-w-0 w-full space-y-4'>
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
        </div>
    );
}

export default App;
