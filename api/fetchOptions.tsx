import { NextApiRequest, NextApiResponse } from "next";

interface Option {
  site: {
    name: string;
    url: string;
  };
  date: string;
  time: string;
  slots_available: number;
  price: string;
}

const fetchOptions = async (date: string): Promise<Option[]> => {
  try {
    // Call your Azure Functions endpoint here with the specified date
    // Replace 'https://your-azure-function-url' with the actual URL
    const response = await fetch(`https://golfbookerhelperapp.azurewebsites.net/api/GolfBookerHelperTrigger?code=qOJ00OCbM7xRn2Evj4Lfx5UkjixPEbVN9QhpfgV6-JGxAzFubzpuvQ==&date=${date}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const date = req?.body?.date;
  if (typeof date !== "string") {
    res.status(400).json({ error: "Invalid date" });
    return;
  }

  try {
    const options = await fetchOptions(date);
    res.status(200).json({ options });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch options" });
  }
}
