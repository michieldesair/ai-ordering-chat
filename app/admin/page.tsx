import { Vector } from '@/data/schema';
import { columns } from '../components/admin/columns';
import { DataTable } from '../components/admin/data-table';

async function getData(): Promise<Vector[]> {
  return [
    {
      id: '8782',
      text_content: `Medium frietje stoofvlees. Prijs: €6.50. Allergieën: ['noten']`,
      type: 'menu_item',
      vector: '[]',
    },
    {
      id: '7878',
      text_content: `Klein frietje stoofvlees. Prijs: €6.50. Allergieën: ['noten']`,
      type: 'menu_item',
      vector: '[]',
    },
    {
      id: '7839',
      text_content:
        'Onze openingsuren zijn: maandag tot en met vrijdag van 8:00 - 12:00 en van 15:00 tot 21:00.',
      type: 'opening_hours',
      vector: '[]',
    },
  ];
}

export default async function AdminPage() {
  const data = await getData();

  return (
    // min-h-screen ensures it's centered vertically relative to the whole page
    // w-full ensures it's centered horizontally relative to the screen
    <div className="flex min-h-screen w-full flex-col items-center justify-start p-8">
      <div className="w-full">
        <h1 className="mb-6 text-2xl font-bold font-sans">Vector Database Management</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
