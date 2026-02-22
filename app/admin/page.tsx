import { columns } from '../components/admin/columns';
import { DataTable } from '../components/admin/data-table';
import { getDocuments } from '@/lib/get-documents';

export default async function AdminPage() {
  const data = await getDocuments();

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
