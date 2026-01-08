import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, PenTool, Upload, Check, FileSignature } from 'lucide-react';
import { PDFDocumentViewer } from '@/components/staff/PDFDocumentViewer';

interface SignatureContract {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  status: string;
  owner_signed_at: string | null;
  owner_field_values: Record<string, any>;
}

interface SignatureField {
  id: string;
  field_type: string;
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

export default function SignContract() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<SignatureContract | null>(null);
  const [fields, setFields] = useState<SignatureField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signerInfo, setSignerInfo] = useState({ name: '', email: '' });
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [signatureTab, setSignatureTab] = useState<'draw' | 'upload' | 'saved'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchContract();
    }
  }, [slug]);

  const fetchContract = async () => {
    try {
      // Find contract by slug (derived from title)
      const { data: contracts, error } = await supabase
        .from('signature_contracts')
        .select('*')
        .in('status', ['pending', 'draft']);

      if (error) throw error;

      // Match by slug
      const matchedContract = contracts?.find(c => {
        const contractSlug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return contractSlug === slug;
      });

      if (!matchedContract) {
        toast.error('Contract not found');
        return;
      }

      setContract({
        ...matchedContract,
        owner_field_values: (matchedContract.owner_field_values as Record<string, any>) || {},
      });

      // Fetch fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('signature_fields')
        .select('*')
        .eq('contract_id', matchedContract.id)
        .order('display_order');

      if (fieldsError) throw fieldsError;
      setFields((fieldsData || []) as SignatureField[]);

      // Pre-fill owner values if already signed
      if (matchedContract.owner_field_values && typeof matchedContract.owner_field_values === 'object') {
        setFieldValues(matchedContract.owner_field_values as Record<string, any>);
      }
    } catch (error: any) {
      console.error('Error fetching contract:', error);
      toast.error('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldClick = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || field.signer_party !== 'counterparty') return;

    if (field.field_type === 'signature' || field.field_type === 'initial') {
      setActiveFieldId(fieldId);
      setSignatureDialogOpen(true);
    } else if (field.field_type === 'date') {
      setFieldValues({
        ...fieldValues,
        [fieldId]: new Date().toLocaleDateString(),
      });
    } else if (field.field_type === 'checkbox') {
      setFieldValues({
        ...fieldValues,
        [fieldId]: fieldValues[fieldId] === 'true' ? 'false' : 'true',
      });
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeFieldId) return;

    const signatureData = canvas.toDataURL('image/png');
    setFieldValues({
      ...fieldValues,
      [activeFieldId]: signatureData,
    });
    setSignatureDialogOpen(false);
    setActiveFieldId(null);
    clearCanvas();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeFieldId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const signatureData = event.target?.result as string;
      setFieldValues({
        ...fieldValues,
        [activeFieldId]: signatureData,
      });
      setSignatureDialogOpen(false);
      setActiveFieldId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!contract || !signerInfo.name) {
      toast.error('Please enter your name');
      return;
    }

    // Check required fields
    const counterpartyFields = fields.filter(f => f.signer_party === 'counterparty' && f.required);
    const missingFields = counterpartyFields.filter(f => !fieldValues[f.id]);
    
    if (missingFields.length > 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Save submission
      const { error: submissionError } = await supabase
        .from('signature_submissions')
        .insert({
          contract_id: contract.id,
          signer_name: signerInfo.name,
          signer_email: signerInfo.email || null,
          field_values: fieldValues,
          user_agent: navigator.userAgent,
        });

      if (submissionError) throw submissionError;

      // Update contract status
      await supabase
        .from('signature_contracts')
        .update({ status: 'completed' })
        .eq('id', contract.id);

      toast.success('Contract signed successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting signature:', error);
      toast.error('Failed to submit signature');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contract Not Found</h2>
            <p className="text-muted-foreground">
              This contract may have been completed or removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{contract.title}</CardTitle>
            {contract.description && (
              <CardDescription>{contract.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Your Name *</Label>
                <Input
                  value={signerInfo.name}
                  onChange={(e) => setSignerInfo({ ...signerInfo, name: e.target.value })}
                  placeholder="Full legal name"
                />
              </div>
              <div>
                <Label>Email (optional)</Label>
                <Input
                  type="email"
                  value={signerInfo.email}
                  onChange={(e) => setSignerInfo({ ...signerInfo, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="h-[600px]">
              <PDFDocumentViewer
                fileUrl={contract.file_url}
                fields={fields}
                fieldValues={fieldValues}
                onFieldValueChange={handleFieldClick}
                signerParty="counterparty"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Sign & Submit
          </Button>
        </div>
      </div>

      {/* Signature Dialog */}
      <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Your Signature</DialogTitle>
          </DialogHeader>
          <Tabs value={signatureTab} onValueChange={(v) => setSignatureTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="draw" className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearCanvas}>
                  Clear
                </Button>
                <Button onClick={saveSignature}>
                  <PenTool className="h-4 w-4 mr-2" />
                  Apply Signature
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="signature-upload"
                />
                <label
                  htmlFor="signature-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload signature image
                  </span>
                </label>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}