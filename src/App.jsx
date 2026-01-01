import {useEffect, useState} from "react";
import PaymentForm from './components/PaymentForm.jsx';
import PaymentsTable from './components/PaymentsTable.jsx';
import {Readme} from "./components/Readme.jsx";
import {Footer} from "./components/Footer.jsx";
import {ThemeToggle} from "./components/ThemeToggle.jsx";

function App() {
    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem('payments');
        return saved ? JSON.parse(saved) : [];
    });
    const addPayment = (p) => setPayments(prev => [...prev, p]);
    const handleDelete = (idx) => setPayments(prev => prev.filter((_, i) => i !== idx));

    useEffect(() => {
        localStorage.setItem('payments', JSON.stringify(payments));
    }, [payments]);

    return (
        <div className='min-h-screen w-full flex flex-col justify-center bg-white dark:bg-black text-black dark:text-white px-6 py-5'>
            <div className='grid grid-cols-1 gap-6 max-w-4xl mx-auto'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl lg:text-2xl font-semibold'>🇬🇪 Входящие платежи в лари</h1>
                    <ThemeToggle />
                </div>
                <PaymentForm onAdd={addPayment} />
                <PaymentsTable payments={payments} onDelete={handleDelete} />
                <Readme/>
            </div>
            <Footer/>
        </div>
    )
}

export default App
