import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EyeIcon = ({ code }: { code: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <Eye className="h-5 w-5" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Code Submission</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-900 dark:text-gray-100 border dark:border-gray-800">
              {code}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EyeIcon;