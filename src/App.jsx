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
        <div className='min-h-screen w-full flex flex-col px-4 py-6 sm:px-6'>
            <a
                href='#main-content'
                className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-[10px] focus:px-4 focus:py-2 focus:text-[15px] focus:text-white'
                style={{ backgroundColor: 'var(--apple-blue)' }}
            >
                Перейти к содержимому
            </a>

            <div className='flex-1 w-full max-w-5xl mx-auto'>
                <header className='mb-8'>
                    <h1 className='page-title'>
                        🇬🇪 Входящие платежи в лари
                    </h1>
                    <p className='page-subtitle'>
                        Конвертация по курсу НБГ и расчёт итогов для налоговой отчётности
                    </p>
                </header>

                <div className='flex flex-col lg:flex-row gap-5 items-start'>
                    <main id='main-content' className='flex-1 min-w-0 w-full space-y-5'>
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

            <Footer/>
        </div>
    );
}

export default App;
