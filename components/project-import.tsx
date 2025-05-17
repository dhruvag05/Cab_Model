import { useState } from 'react';
import { read, utils } from 'xlsx';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/projects';

interface ProjectImportProps {
  onImport: (projects: Project[]) => void;
}

export function ProjectImport({ onImport }: ProjectImportProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      
      if (!file) {
        toast({
          title: "No file selected",
          description: "Please select an Excel file to import",
          variant: "destructive",
        });
        return;
      }

      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }

      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const projects: Project[] = jsonData.map((row: any, index) => ({
        id: String(index + 1),
        name: row.name || row.Name || '',
        category: (row.category || row.Category || 'clone').toLowerCase() as 'paid' | 'clone',
        description: row.description || row.Description || ''
      })).filter(project => project.name && project.category);

      if (projects.length === 0) {
        toast({
          title: "No valid projects found",
          description: "Please check your Excel file format",
          variant: "destructive",
        });
        return;
      }

      onImport(projects);
      toast({
        title: "Projects imported successfully",
        description: `Imported ${projects.length} projects`,
      });

    } catch (error) {
      console.error('Error importing projects:', error);
      toast({
        title: "Import failed",
        description: "There was an error importing the projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        id="project-import"
        disabled={loading}
      />
      <label htmlFor="project-import">
        <Button 
          variant="outline" 
          disabled={loading}
          className="cursor-pointer"
          asChild
        >
          <span>
            {loading ? 'Importing...' : 'Import Projects'}
          </span>
        </Button>
      </label>
    </div>
  );
}