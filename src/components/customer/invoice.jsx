import React, { useState } from "react";
import { FileText, Download, Filter, Search } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";

const Invoice = ({ bookingId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  // Sample invoice data (replace this with real data from your backend)
  const [invoices, setInvoices] = useState([
    {
      id: "F303890B-0002",
      status: "Draft",
      amount: "0.00 Pkr",
      frequency: "Monthly",
      customerEmail: "-",
      dueDate: "26 Jun, 11:42",
      createdDate: "26 Jun, 11:42",
    },
  ]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtered invoices based on status and search
  const filteredInvoices = invoices.filter((invoice) => {
    return (
      (filters.status === "" || invoice.status === filters.status) &&
      (filters.search === "" ||
        invoice.id.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Handle downloading an invoice
  const handleDownloadInvoice = async (invoiceId) => {
    setIsLoading(true);
    try {
      // Fetch the invoice from the backend
      const response = await axios.get(
        `http://localhost:3000/api/invoice/${invoiceId}`, // Ensure this matches your backend URL
        {
          responseType: "blob", // Important for downloading files
        }
      );

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${invoiceId}.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>

        {/* Filters and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block appearance-none w-40 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Outstanding">Outstanding</option>
                <option value="Overdue">Overdue</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Filter size={16} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search invoices..."
                className="w-64 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:border-primary"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Search size={16} />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleDownloadInvoice(bookingId)}
            disabled={isLoading}
            className="flex items-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Download size={16} className="mr-2" />
            {isLoading ? "Exporting..." : "Export"}
          </button>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        invoice.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : invoice.status === "Outstanding"
                          ? "bg-blue-100 text-blue-800"
                          : invoice.status === "Overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.frequency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.customerEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.createdDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="text-primary hover:text-primary-dark flex items-center"
                    >
                      <FileText size={16} className="mr-2" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Invoice;
