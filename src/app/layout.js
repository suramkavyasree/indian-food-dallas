// app/layout.js
// /app/layout.js
'use client';

import React from 'react'; // 👈 Add this line
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';


export default function Layout({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = () => setTriggerSearch((prev) => !prev); // toggle to trigger useEffect

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Indian Food Dallas</title>
      </head>
      <body>
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <main>
          {React.cloneElement(children, { searchQuery, triggerSearch })}
        </main>
        <Footer />
      </body>
    </html>
  );
}
