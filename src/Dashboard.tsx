import { useState } from 'react'
import { AiFillMedicineBox } from 'react-icons/ai'
import MedicineList from './features/MedicineList'
import UploadForm from './features/UploadForm'
import { clsx } from 'clsx'
import { Link } from "react-router-dom"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Floating Icon (always visible) */}
      <div className=" bg-white p-2 rounded-full shadow-md">
        <AiFillMedicineBox
          size={32}
          className="text-red-600 cursor-pointer hover:green-red-800"
          title="Add Medicine"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
        <div
        className={clsx(
            'fixed top-0 right-0 h-full w-[60%] bg-white shadow-lg transform transition-transform duration-300 z-50',
            isSidebarOpen ? 'translate-x-0' : 'translate-x-[100%]'
        )}
        >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add Medicine</h2>
            <button
              onClick={toggleSidebar}
              className="text-red-500 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <UploadForm />
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
        />
      )}
      <Link to="dispense"><img className="w-[6%] ml-[auto]" src="./images/medical.png"/></Link>
      {/* Main content */}
      <div className="p-4">
        
        <MedicineList />
      </div>
    </div>
  )
}
