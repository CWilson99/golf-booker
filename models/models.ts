interface Option {
    site: WebSite;
    date: string;
    time: string;
    slots_available: number;
    price: string;
    num_holes: number;
}

interface FuncResponse {
  options: Option[];
}

interface WebSite {
  name: string;
  url: string;
}