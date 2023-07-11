"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";

interface Option {
  site: {
    name: string;
    url: string;
  };
  date: string;
  time: string;
  slots_available: number;
  price: string;
  num_holes: number;
}

interface AvailableOptionsProps {
}

const AvailableOptions: React.FC<AvailableOptionsProps> = () => {
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");


  const fetchData = async () => {
    try {
      const response = await fetch("/api/fetchOptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "date": selectedDate }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAvailableOptions(data.options)
        setFilteredOptions(data.options)
      } else {
        console.error("Failed to fetch options:", response.status);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setSelectedFilter("ALL"); // Reset the filter to "ALL" when the date changes
  };

  const handleFilterClick = () => {
    fetchData();
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  };

  useEffect(() => {
    // Filter the options based on the selected filter
    let filtered = availableOptions;
    if (selectedFilter !== "ALL") {
      filtered = availableOptions.filter((option) => {
        const optionTime = option.time.toLowerCase();
        if (selectedFilter === "AM") {
          return optionTime.includes("am");
        } else if (selectedFilter === "PM") {
          return optionTime.includes("pm");
        }
        return false;
      });
    }
    setFilteredOptions(filtered);
  }, [availableOptions, selectedFilter]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        />
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        >
          <option value="ALL">All</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <button
          onClick={handleFilterClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Filter
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Available Options</h1>
      <ul className="divide-y divide-gray-300">
        {filteredOptions.map((option, index) => (
          <li key={index} className="py-4">
            <div className="flex items-center">
              <div className="w-1/2">
                <h2 className="text-lg font-semibold">
                  {option.site.name} - {option.date} - {option.time}
                </h2>
                <p className="text-gray-600">Price: {option.price}</p>
              </div>
              <div className="w-1/2">
                <h2 className="text-lg font-semibold">
                  {option.site.name} - {option.date} - {option.time}
                </h2>
                <p className="text-gray-600">Price: {option.price}</p>
              </div>
              <div className="w-1/4">
                <p className="text-right text-green-600">
                  Slots Available: {option.slots_available}
                </p>
              </div>
              <div className="w-1/4">
                <a href={option.site.url} className="text-blue-500 underline">
                  Visit Site
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableOptions;
