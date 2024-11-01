import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Check, Cross, Edit3, Edit3Icon, Loader, Trash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/Components/ui/form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { router } from "@inertiajs/react";
import { toast } from "@/hooks/use-toast";
import { formatDateTime } from "@/utils/formatDateTime";
import { WebsiteForm } from "./Actions/WebsiteForm";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination";
import { useWebsites } from "./WebsitesContext";
import { Inertia } from '@inertiajs/inertia';

export const WebsitesTable = ({ websites, openedCount, closedCount }) => {
  const [selectedWebsite, setSelectedWebsite] = useState({
    id: null,
    name: null,
    url: null,
    last_checked_at: null,
    latest_status_log: null,
    pivot_id: null
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleEditClick = (website) => {
    setSelectedWebsite(website);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    return null;
    if (selectedWebsite) {
      await router.delete(route("websites.destroy", { id: selectedWebsite.id }), {
        preserveState: false, // Add this line
        onSuccess: () => {
          toast({
            title: "Website deleted",
            description: "The website has been successfully deleted.",
          });
          setIsDialogOpen(false);
        },
        onError: (errors) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete website. Please try again.",
          });
        },
      });
    }
  };

  return (
    <>
      <Table className="flex-1 ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Confirmed</TableHead>
            <TableHead>is Online</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="text-right hidden md:table-cell">Last Checked</TableHead>
            <TableHead className="text-right hidden md:table-cell">Last Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {websites.map((website) => (
            <TableRow key={website.id}>
              <TableCell className="font-medium">{website.name}</TableCell>
              <TableCell>{
                website.confirmed
                  ? <span className="text-green-700"><Check /></span>
                  : <span className="text-red-600"><X /> </span>
              }</TableCell>
              <TableCell>{
                website.is_online
                  ? <span className="text-green-700">Open</span>
                  : <span className="text-red-600">Closed</span>
              }</TableCell>
              <TableCell className="hidden md:table-cell">{website.url}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{formatDateTime(website.last_checked_at)}</TableCell>
              <TableCell className="text-right hidden md:table-cell">{website.latest_status_log}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditClick(website)}
                >
                  <Edit3Icon size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
      <div className="mt-auto flex justify-end items-end">
        <PaginationContainer />
      </div>
      {/* Show Website Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <WebsiteForm website={selectedWebsite} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
};


const PaginationContainer = ({ }) => {
  const { pagination } = useWebsites();
  const currentPage = pagination.current_page;
  const totalPages = pagination.last_page;
  
  const onPageChange = (page) => {
    Inertia.visit(route('admin.listWebsites', { page: page})); // Adjust your endpoint accordingly
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    // Show first page
    if (currentPage > 1) {
      items.push(
        <PaginationItem key={1} onClick={() => onPageChange(1)}>
          <PaginationLink className="cursor-pointer" isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis if there's a gap between pages
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Display current page and nearby pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i} onClick={() => onPageChange(i)}>
          <PaginationLink className="cursor-pointer" isActive={currentPage === i}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    // Show last page
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
      items.push(
        <PaginationItem key={totalPages} onClick={() => onPageChange(totalPages)}>
          <PaginationLink className="cursor-pointer" isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if(totalPages === 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="cursor-pointer" onClick={handlePrevious}   />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext className="cursor-pointer" onClick={handleNext}  />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
