import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SignatureField {
  id: string;
  field_type: string;
  label?: string;
  page_number: number;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  required: boolean;
  display_order: number;
  signer_party: 'owner' | 'counterparty';
}

interface PDFDocumentViewerProps {
  fileUrl: string;
  fields: SignatureField[];
  onFieldsChange?: (fields: SignatureField[]) => void;
  fieldValues?: Record<string, any>;
  onFieldValueChange?: (fieldId: string, value: any) => void;
  editMode?: boolean;
  signerParty?: 'owner' | 'counterparty';
  onPageChange?: (pageNumber: number) => void;
  onNumPagesChange?: (numPages: number) => void;
}

export const PDFDocumentViewer = ({
  fileUrl,
  fields,
  onFieldsChange,
  fieldValues = {},
  onFieldValueChange,
  editMode = false,
  signerParty,
  onPageChange,
  onNumPagesChange,
}: PDFDocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    onNumPagesChange?.(numPages);
  };

  const onPageLoadSuccess = (page: any) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageSize({ width: viewport.width, height: viewport.height });
  };

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingField(fieldId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingField || !pageRef.current || !editMode) return;

    const pageRect = pageRef.current.getBoundingClientRect();
    const field = fields.find(f => f.id === draggingField);
    if (!field) return;

    // Calculate new position as percentage
    const newX = ((e.clientX - pageRect.left - dragOffset.x) / pageRect.width) * 100;
    const newY = ((e.clientY - pageRect.top - dragOffset.y) / pageRect.height) * 100;

    // Clamp to page bounds
    const clampedX = Math.max(0, Math.min(100 - field.width, newX));
    const clampedY = Math.max(0, Math.min(100 - field.height, newY));

    const updatedFields = fields.map(f =>
      f.id === draggingField
        ? { ...f, x_position: clampedX, y_position: clampedY }
        : f
    );
    onFieldsChange?.(updatedFields);
  };

  const handleMouseUp = () => {
    setDraggingField(null);
  };

  const getFieldColor = (party: string, type: string) => {
    const isOwner = party === 'owner';
    if (type === 'signature' || type === 'initial') {
      return isOwner ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50';
    }
    if (type === 'date') {
      return isOwner ? 'border-purple-500 bg-purple-50' : 'border-orange-500 bg-orange-50';
    }
    return isOwner ? 'border-gray-500 bg-gray-50' : 'border-teal-500 bg-teal-50';
  };

  const currentPageFields = fields.filter(f => f.page_number === pageNumber);

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[80px] text-center">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(s => Math.min(2, s + 0.25))}
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-200 p-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex justify-center">
          <div
            ref={pageRef}
            className="relative bg-white shadow-lg"
            style={{ width: pageSize.width * scale, height: pageSize.height * scale }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* Signature Fields Overlay */}
            {currentPageFields.map((field) => {
              const isActiveParty = !signerParty || field.signer_party === signerParty;
              const fieldValue = fieldValues[field.id];
              
              return (
                <div
                  key={field.id}
                  className={`absolute border-2 border-dashed rounded transition-all ${
                    getFieldColor(field.signer_party, field.field_type)
                  } ${editMode ? 'cursor-move' : isActiveParty ? 'cursor-pointer hover:opacity-80' : 'opacity-50'}`}
                  style={{
                    left: `${field.x_position}%`,
                    top: `${field.y_position}%`,
                    width: `${field.width}%`,
                    height: `${field.height}%`,
                    minWidth: 50 * scale,
                    minHeight: 30 * scale,
                  }}
                  onMouseDown={(e) => handleFieldMouseDown(e, field.id)}
                  onClick={() => {
                    if (!editMode && isActiveParty && onFieldValueChange) {
                      // Handle field click for signing
                      if (field.field_type === 'date') {
                        onFieldValueChange(field.id, new Date().toLocaleDateString());
                      }
                    }
                  }}
                >
                  {/* Field Content */}
                  {fieldValue ? (
                    <div className="w-full h-full flex items-center justify-center p-1">
                      {(field.field_type === 'signature' || field.field_type === 'initial') && (
                        <img
                          src={fieldValue}
                          alt="Signature"
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                      {field.field_type === 'date' && (
                        <span className="text-sm font-medium">{fieldValue}</span>
                      )}
                      {field.field_type === 'text' && (
                        <span className="text-sm">{fieldValue}</span>
                      )}
                      {field.field_type === 'checkbox' && fieldValue === 'true' && (
                        <span className="text-lg">✓</span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-1">
                      {field.label || field.field_type}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </div>
                  )}

                  {/* Party indicator */}
                  {editMode && (
                    <div
                      className={`absolute -top-5 left-0 text-xs px-1 rounded ${
                        field.signer_party === 'owner' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      {field.signer_party === 'owner' ? 'Owner' : 'Counterparty'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};