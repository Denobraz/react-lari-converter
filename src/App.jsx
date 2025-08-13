import {useState} from "react";
import PaymentForm from './components/PaymentForm.jsx';
import PaymentsTable from './components/PaymentsTable.jsx';
import {Readme} from "./components/Readme.jsx";

function App() {
    const [payments, setPayments] = useState([]);
    const addPayment = (p) => setPayments(prev => [...prev, p]);
    const handleDelete = (idx) => setPayments(prev => prev.filter((_, i) => i !== idx));

    return (
        <div className='min-h-screen w-full flex flex-col justify-center bg-black text-white px-6 py-5'>
            <div className='grid grid-cols-1 gap-6 max-w-4xl mx-auto'>
                <h1 className='text-2xl font-semibold'>Входящие платежи</h1>
                <PaymentForm onAdd={addPayment} />
                <PaymentsTable payments={payments} onDelete={handleDelete} />
                <Readme/>
            </div>
        </div>
    )
}

export default App
