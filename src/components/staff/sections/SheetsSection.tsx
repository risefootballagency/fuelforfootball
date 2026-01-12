import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Table2, Trash2, Edit2, Save, PlusCircle, MinusCircle, Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StaffSheet {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface SheetData {
  headers: string[];
  rows: string[][];
}

export const SheetsSection = () => {
  const [sheets, setSheets] = useState<StaffSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSheet, setEditingSheet] = useState<StaffSheet | null>(null);
  const [title, setTitle] = useState("");
  const [sheetData, setSheetData] = useState<SheetData>({ headers: ["Column 1", "Column 2", "Column 3"], rows: [["", "", ""]] });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_documents")
        .select("*")
        .eq("doc_type", "sheet")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setSheets(data || []);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseSheetContent = (content: string): SheetData => {
    try {
      return JSON.parse(content);
    } catch {
      return { headers: ["Column 1", "Column 2", "Column 3"], rows: [["", "", ""]] };
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const content = JSON.stringify(sheetData);
      if (editingSheet) {
        const { error } = await supabase
          .from("staff_documents")
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", editingSheet.id);
        if (error) throw error;
        toast.success("Sheet updated");
      } else {
        const { error } = await supabase
          .from("staff_documents")
          .insert({ title, content, doc_type: "sheet" });
        if (error) throw error;
        toast.success("Sheet created");
      }
      resetForm();
      fetchSheets();
    } catch (error) {
      toast.error("Failed to save sheet");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sheet?")) return;
    try {
      const { error } = await supabase.from("staff_documents").delete().eq("id", id);
      if (error) throw error;
      toast.success("Sheet deleted");
      fetchSheets();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSheetData({ headers: ["Column 1", "Column 2", "Column 3"], rows: [["", "", ""]] });
    setEditingSheet(null);
    setIsEditing(false);
  };

  const openEdit = (sheet: StaffSheet) => {
    setEditingSheet(sheet);
    setTitle(sheet.title);
    setSheetData(parseSheetContent(sheet.content));
    setIsEditing(true);
  };

  const openNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...sheetData.headers];
    newHeaders[index] = value;
    setSheetData({ ...sheetData, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...sheetData.rows];
    newRows[rowIndex][colIndex] = value;
    setSheetData({ ...sheetData, rows: newRows });
  };

  const addRow = () => {
    setSheetData({
      ...sheetData,
      rows: [...sheetData.rows, new Array(sheetData.headers.length).fill("")]
    });
  };

  const removeRow = (index: number) => {
    if (sheetData.rows.length <= 1) return;
    setSheetData({ ...sheetData, rows: sheetData.rows.filter((_, i) => i !== index) });
  };

  const addColumn = () => {
    setSheetData({
      headers: [...sheetData.headers, `Column ${sheetData.headers.length + 1}`],
      rows: sheetData.rows.map(row => [...row, ""])
    });
  };

  const removeColumn = (index: number) => {
    if (sheetData.headers.length <= 1) return;
    setSheetData({
      headers: sheetData.headers.filter((_, i) => i !== index),
      rows: sheetData.rows.map(row => row.filter((_, i) => i !== index))
    });
  };

  const filteredSheets = sheets.filter(s => 
    searchQuery ? s.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading sheets...</div>;
  }

  // Full-screen editor view
  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Editor Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={resetForm}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <span className="text-lg font-medium">
            {editingSheet ? "Edit Sheet" : "New Sheet"}
          </span>
        </div>

        {/* Title input */}
        <Input
          placeholder="Sheet title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium max-w-md"
        />

        {/* Table controls */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addColumn}>
            <PlusCircle className="w-3 h-3 mr-1" /> Column
          </Button>
          <Button size="sm" variant="outline" onClick={addRow}>
            <PlusCircle className="w-3 h-3 mr-1" /> Row
          </Button>
        </div>

        {/* Full-screen table */}
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {sheetData.headers.map((header, i) => (
                  <TableHead key={i} className="min-w-[150px]">
                    <div className="flex items-center gap-1">
                      <Input
                        value={header}
                        onChange={(e) => updateHeader(i, e.target.value)}
                        className="h-8 text-sm font-semibold"
                      />
                      {sheetData.headers.length > 1 && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => removeColumn(i)}>
                          <MinusCircle className="w-3 h-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetData.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex} className="p-1">
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="h-9 text-sm"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="p-1">
                    {sheetData.rows.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeRow(rowIndex)}>
                        <MinusCircle className="w-3 h-3 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={resetForm}>Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Sheet
          </Button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button className="gap-2" onClick={openNew}>
          <Plus className="w-4 h-4" /> New Sheet
        </Button>
      </div>

      {/* Sheets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSheets.map((sheet) => {
          const data = parseSheetContent(sheet.content);
          return (
            <Card key={sheet.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => openEdit(sheet)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-base line-clamp-1">{sheet.title}</CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(sheet); }}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(sheet.id); }}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {data.headers.length} columns • {data.rows.length} rows
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {format(new Date(sheet.updated_at), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSheets.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Table2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No sheets found</p>
          <p className="text-sm">Create your first sheet to get started!</p>
        </div>
      )}
    </div>
  );
};
