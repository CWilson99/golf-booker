"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";
import * as DateTime from "luxon";

const websites: WebSite[] = [
  {
      "name":"Virginia Golf Club",
      "url":"https://www.virginiagolf.com.au/"
  },
  {
      "name":"Keperra Golf Club",
      "url":"https://www.keperragolf.com.au/"
  },
  {
      "name":"Pine Rivers Golf Club",
      "url":"https://pinerivers.miclub.com.au/"
  },
]

interface AvailableOptionsProps {
}

const AvailableOptions: React.FC<AvailableOptionsProps> = () => {
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("ALL");
  const [slotsFilter, setSlotsFilter] = useState<number>(4);

  const slotsChange = (newVal: number) => {
    if (newVal < 1){
      setSlotsFilter(1)
    }
    else if (newVal > 4){
      setSlotsFilter(4)
    }
    else{
      setSlotsFilter(newVal)
    }
  };


  const fetchData = async () => {
    // Run a fetch for each of our websites
    websites.forEach((website: WebSite) => {
      try {
        fetch("/api/fetchOptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "date": selectedDate, "url": website }),
        }).then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json() as Promise<FuncResponse >
        })
        .then((data) =>  {
          setAvailableOptions(previousState => [...previousState, ...data.options].sort((a: Option, b: Option) => {
            return DateTime.DateTime.fromFormat(a.time, "hh:mm a").valueOf() - DateTime.DateTime.fromFormat(b.time, "hh:mm a").valueOf();
        }))
          setFilteredOptions(previousState => [...previousState, ...data.options].sort((a: Option, b: Option) => {
            return DateTime.DateTime.fromFormat(a.time, "hh:mm a").valueOf() - DateTime.DateTime.fromFormat(b.time, "hh:mm a").valueOf();
        }))
        })
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setTimeFilter("ALL"); // Reset the filter to "ALL" when the date changes
  };

  const handleFilterClick = () => {
    // Clear everything
    setAvailableOptions([])
    setFilteredOptions([])
    //Fetch data
    fetchData();
  };

  const handleTimeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(event.target.value);
  };

  const handleSlotsFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    slotsChange(Number.parseInt(event.target.value));
  };

  useEffect(() => {
    // Filter the options based on the selected filter
    let filtered = availableOptions;
    if (timeFilter !== "ALL") {
      filtered = filtered.filter((option) => {
        const optionTime = option.time.toLowerCase();
        if (timeFilter === "AM") {
          return optionTime.includes("am");
        } else if (timeFilter === "PM") {
          return optionTime.includes("pm");
        }
        return false;
      });
    }
    if (slotsFilter) {
      filtered = filtered.filter((option) => {
        const optionSlots = option.slots_available;
        return optionSlots >= slotsFilter
      });
    }
    setFilteredOptions(filtered);
  }, [availableOptions, timeFilter]);

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
          value={timeFilter}
          onChange={handleTimeFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        >
          <option value="ALL">All</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <input
          value={slotsFilter}
          onChange={handleSlotsFilterChange}
          type="number"
          className="px-4 py-2 border border-gray-300 rounded-md mr-4"
        />
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
              <div className="w-1/6">
                <h2 className="text-center text-2xl font-semibold">
                {option.num_holes}
                </h2>
                <p className="text-center text-gray-600">Holes</p>
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
