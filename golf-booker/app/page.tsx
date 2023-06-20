import Image from 'next/image'
import AvailableOptions from '@/components/AvailableOptions'

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

const options: Array<Option>=[]

export default function Home() {
  return (
    <div>
      <AvailableOptions></AvailableOptions>
    </div>
  )
}
