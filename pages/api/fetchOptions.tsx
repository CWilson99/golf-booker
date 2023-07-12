import { NextApiRequest, NextApiResponse } from "next";

const fetchOptions = async (date: string, url: WebSite): Promise<Option[]> => {
  try {
    // Call your Azure Functions endpoint here with the specified date
    // Replace 'https://your-azure-function-url' with the actual URL
    const response = await fetch(`https://golfbookerhelperapp.azurewebsites.net/api/GolfBookerHelperAppTrigger?code=3uVjX8ei4LBXakTRnCP3QjptwFbWugIpla5gUuWddCUPAzFuUXIv4w==&date=${date}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"site": url })});
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
  const url = req?.body?.url;

  try {
    const options = await fetchOptions(date, url);
    res.status(200).json({ options });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch options" });
  }
}
