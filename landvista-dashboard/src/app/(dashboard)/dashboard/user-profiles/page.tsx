"use client";
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useDisplayAllUsers } from '../hooks/useFetchUsers';
import Link from 'next/link';

const UserProfile: React.FC = () => {
  const { data: users, isLoading, error } = useDisplayAllUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const reversedUsers = users ? [...users].reverse() : [];
  const totalPages = Math.ceil(reversedUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsers = reversedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="bg-white ml-72 overflow-auto 2xl:overflow-visible 2xl:h-auto lg:h-auto">
        <header className="text-[#CA7558]">
          <div className="container">
            <h1 className="text-[40px] lg:text-xl font-bold text-center nest-hub:text-[20px] nest-hub-max:text-[25px]">
              Users Profile
            </h1>
          </div>
        </header>
        <main className="container h-full mx-auto md:mx-0 flex flex-col justify-between relative">
          <section className="mt-4 lg:mt-2 lg:mr-8 flex-grow">
            {currentUsers.length === 0 ? (
              <p>No users available.</p>
            ) : (
              <div className="lg:h-auto">
                {/* Center the table and adjust padding */}
                <table className="min-w-full bg-white shadow-lg rounded-md mt-8 mx-auto ml-8">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-sm font-sm uppercase tracking-wider text-center nest-hub:text-xs nest-hub-max:text-sm lg:text-[12px] border-b-2 border-white">
                        First Name
                      </th>
                      <th className="px-6 py-3 text-sm font-sm uppercase tracking-wider text-center nest-hub:text-xs nest-hub-max:text-sm lg:text-[12px] border-b-2 border-white">
                        Last Name
                      </th>
                      <th className="px-6 py-3 text-sm font-sm uppercase tracking-wider text-center nest-hub:text-xs nest-hub-max:text-sm lg:text-[12px] border-b-2 border-white">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id || user.email || user.first_name || user.last_name} className="hover:bg-teal-50">
                        <td className="px-12 py-4 text-center nest-hub:px-2 lg:px-4 nest-hub:text-xs lg:text-xs nest-hub-max:text-sm border-b border-gray-200">
                          {user.first_name}
                        </td>
                        <td className="px-12 py-4 text-center nest-hub:px-2 lg:px-4 nest-hub:text-xs lg:text-xs nest-hub-max:text-sm border-b border-gray-200">
                          {user.last_name}
                        </td>
                        <td className="px-12 py-4 text-center nest-hub:px-2 lg:px-4 nest-hub:text-xs lg:text-xs nest-hub-max:text-sm border-b border-gray-200">
                          {user.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          <Link href="/add-users-data/">
            <button className="fixed top-4 right-4 bg-teal-600 text-white p-4 rounded-full shadow-md hover:bg-teal-700 transition duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 lg:h-4 lg:w-4 xl:h-4 xl:w-4">
                <path
                  fillRule="evenodd"
                  d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </main>
      </div>
    </Layout>
  );
};

const Pagination: React.FC<{
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex justify-center space-x-2 mb-12">
      <button
        onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : currentPage)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-black hover:bg-teal-700 transition duration-300"
        disabled={currentPage === 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs 
                      ${page === currentPage ? 'bg-teal-600 text-white' : 'bg-gray-200 text-black'}
                      hover:bg-teal-700 transition duration-300`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-black hover:bg-teal-700 transition duration-300"
        disabled={currentPage === totalPages}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default UserProfile;
