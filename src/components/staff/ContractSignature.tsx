import React, { useState, useEffect, useRef } from 'react';
import { sharedSupabase as supabase } from '@/integrations/supabase/sharedClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Upload, Trash2, Copy, ExternalLink, FileSignature, Loader2, Eye, Edit, PenTool, Download } from 'lucide-react';
import { PDFDocumentViewer } from './PDFDocumentViewer';

interface SignatureContract {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  share_token: string;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  owner_signed_at: string | null;
  owner_field_values: Record<string, any>;
  completed_pdf_url: string | null;
  created_at: string;
}

interface SignatureField {
  id: string;
  contract_id: string;
  field_type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
  label: string | null;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  required: boolean;
  display_order: number;
  signer_party: 'owner' | 'counterparty';
}

const FIELD_TYPES = [
  { value: 'signature', label: 'Signature' },
  { value: 'initial', label: 'Initial' },
  { value: 'date', label: 'Date' },
  { value: 'text', label: 'Text' },
  { value: 'checkbox', label: 'Checkbox' },
];

export const ContractSignature = () => {
  const [contracts, setContracts] = useState<SignatureContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<SignatureContract | null>(null);
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState({ title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (selectedContract) {
      fetchFields(selectedContract.id);
    }
  }, [selectedContract]);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('signature_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error: any) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFields = async (contractId: string) => {
    try {
      const { data, error } = await supabase
        .from('signature_fields')
        .select('*')
        .eq('contract_id', contractId)
        .order('display_order');

      if (error) throw error;
      setFields((data as SignatureField[]) || []);
    } catch (error: any) {
      console.error('Error fetching fields:', error);
      toast.error('Failed to load fields');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleCreateContract = async () => {
    if (!selectedFile || !newContract.title) {
      toast.error('Please provide a title and PDF file');
      return;
    }

    setUploading(true);
    try {
      // Upload PDF
      const timestamp = Date.now();
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `contracts/${timestamp}_${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('signature-contracts')
        .upload(fileName, selectedFile, {
          contentType: 'application/pdf',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('signature-contracts')
        .getPublicUrl(fileName);

      // Create contract record
      const { data: contract, error: createError } = await supabase
        .from('signature_contracts')
        .insert({
          title: newContract.title,
          description: newContract.description || null,
          file_url: publicUrl,
          file_name: selectedFile.name,
          status: 'draft',
        })
        .select()
        .single();

      if (createError) throw createError;

      setContracts([contract, ...contracts]);
      setSelectedContract(contract);
      setCreateDialogOpen(false);
      setNewContract({ title: '', description: '' });
      setSelectedFile(null);
      toast.success('Contract created successfully');
    } catch (error: any) {
      console.error('Error creating contract:', error);
      toast.error(error.message || 'Failed to create contract');
    } finally {
      setUploading(false);
    }
  };

  const handleAddField = async (fieldType: string, signerParty: string) => {
    if (!selectedContract) return;

    try {
      const newField = {
        contract_id: selectedContract.id,
        field_type: fieldType,
        label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
        page_number: 1,
        x_position: 10,
        y_position: 10 + fields.length * 10,
        width: fieldType === 'checkbox' ? 3 : 15,
        height: fieldType === 'checkbox' ? 3 : 5,
        required: true,
        display_order: fields.length,
        signer_party: signerParty,
      };

      const { data, error } = await supabase
        .from('signature_fields')
        .insert(newField)
        .select()
        .single();

      if (error) throw error;

      setFields([...fields, data as SignatureField]);
      toast.success('Field added');
    } catch (error: any) {
      console.error('Error adding field:', error);
      toast.error('Failed to add field');
    }
  };

  const handleFieldsChange = async (updatedFields: SignatureField[]) => {
    setFields(updatedFields);
    
    // Debounced save to database
    const changedField = updatedFields.find((f, i) => 
      f.x_position !== fields[i]?.x_position || f.y_position !== fields[i]?.y_position
    );
    
    if (changedField) {
      await supabase
        .from('signature_fields')
        .update({
          x_position: changedField.x_position,
          y_position: changedField.y_position,
        })
        .eq('id', changedField.id);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('signature_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      setFields(fields.filter(f => f.id !== fieldId));
      toast.success('Field deleted');
    } catch (error: any) {
      console.error('Error deleting field:', error);
      toast.error('Failed to delete field');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedContract) return;

    try {
      const { error } = await supabase
        .from('signature_contracts')
        .update({ status })
        .eq('id', selectedContract.id);

      if (error) throw error;

      setSelectedContract({ ...selectedContract, status: status as any });
      setContracts(contracts.map(c => 
        c.id === selectedContract.id ? { ...c, status: status as any } : c
      ));
      toast.success(`Status updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDuplicate = async () => {
    if (!selectedContract) return;

    try {
      const { data, error } = await supabase
        .from('signature_contracts')
        .insert({
          title: `${selectedContract.title} (Copy)`,
          description: selectedContract.description,
          file_url: selectedContract.file_url,
          file_name: selectedContract.file_name,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      // Duplicate fields
      if (fields.length > 0) {
        const newFields = fields.map(f => ({
          contract_id: data.id,
          field_type: f.field_type,
          label: f.label,
          page_number: f.page_number,
          x_position: f.x_position,
          y_position: f.y_position,
          width: f.width,
          height: f.height,
          required: f.required,
          display_order: f.display_order,
          signer_party: f.signer_party,
        }));

        await supabase
          .from('signature_fields')
          .insert(newFields);
      }

      setContracts([data, ...contracts]);
      toast.success('Contract duplicated');
    } catch (error: any) {
      console.error('Error duplicating contract:', error);
      toast.error('Failed to duplicate contract');
    }
  };

  const copyShareLink = () => {
    if (!selectedContract) return;
    const link = `${window.location.origin}/sign/${selectedContract.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contract Signatures</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                  placeholder="Contract title"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={newContract.description}
                  onChange={(e) => setNewContract({ ...newContract, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <div>
                <Label>PDF Document</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'Select PDF'}
                </Button>
              </div>
              <Button
                onClick={handleCreateContract}
                disabled={uploading || !newContract.title || !selectedFile}
                className="w-full"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Contract
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contract List */}
        <div className="lg:col-span-1 space-y-2">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedContract?.id === contract.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedContract(contract)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{contract.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {contract.file_name}
                    </p>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {contracts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contracts yet. Create your first one!
            </div>
          )}
        </div>

        {/* Contract Detail */}
        <div className="lg:col-span-2">
          {selectedContract ? (
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedContract.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      {isEditMode ? <Eye className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                      {isEditMode ? 'Preview' : 'Edit Fields'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyShareLink}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDuplicate}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Controls */}
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedContract.status}
                    onValueChange={handleUpdateStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedContract.completed_pdf_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedContract.completed_pdf_url!, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Signed
                    </Button>
                  )}
                </div>

                {/* Field Controls (Edit Mode) */}
                {isEditMode && (
                  <div className="p-3 bg-muted rounded-lg space-y-3">
                    <div className="text-sm font-medium">Add Signature Fields</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Owner Fields</div>
                        <div className="flex flex-wrap gap-1">
                          {FIELD_TYPES.map(type => (
                            <Button
                              key={`owner-${type.value}`}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleAddField(type.value, 'owner')}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {type.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Counterparty Fields</div>
                        <div className="flex flex-wrap gap-1">
                          {FIELD_TYPES.map(type => (
                            <Button
                              key={`counter-${type.value}`}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleAddField(type.value, 'counterparty')}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {type.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Field List */}
                    {fields.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <div className="text-xs text-muted-foreground">Current Fields</div>
                        {fields.map((field, i) => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-2 bg-background rounded text-sm"
                          >
                            <span>
                              {field.label || field.field_type} ({field.signer_party})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => handleDeleteField(field.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PDF Viewer */}
                <div className="h-[500px] border rounded-lg overflow-hidden">
                  <PDFDocumentViewer
                    fileUrl={selectedContract.file_url}
                    fields={fields}
                    onFieldsChange={handleFieldsChange}
                    editMode={isEditMode}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a contract to view and manage
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};