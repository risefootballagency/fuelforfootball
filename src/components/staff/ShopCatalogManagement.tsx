import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Upload, Download, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ShopProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  badge: string | null;
  ribbon: string | null;
  visible: boolean;
  display_order: number;
  file_url: string | null;
  product_type: string;
}

const categories = [
  "E-Books",
  "Templates",
  "Training Plans",
  "Guides",
  "Other",
];

interface ShopCatalogManagementProps {
  isAdmin: boolean;
}

export const ShopCatalogManagement = ({ isAdmin }: ShopCatalogManagementProps) => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "E-Books",
    price: 0,
    image_url: "",
    badge: "",
    ribbon: "",
    visible: true,
    file_url: "",
    product_type: "digital",
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching shop products:', error);
      toast.error('Failed to load shop products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: ShopProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      image_url: product.image_url || "",
      badge: product.badge || "",
      ribbon: product.ribbon || "",
      visible: product.visible,
      file_url: product.file_url || "",
      product_type: product.product_type || "digital",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "E-Books",
      price: 0,
      image_url: "",
      badge: "",
      ribbon: "",
      visible: true,
      file_url: "",
      product_type: "digital",
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `shop-products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setFormData({ ...formData, file_url: urlData.publicUrl });
      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        price: formData.price,
        image_url: formData.image_url || null,
        badge: formData.badge || null,
        ribbon: formData.ribbon || null,
        visible: formData.visible,
        file_url: formData.file_url || null,
        product_type: formData.product_type,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('shop_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
        
        toast.success('Product updated successfully');
      } else {
        const { data, error } = await supabase
          .from('shop_products')
          .insert({
            ...productData,
            display_order: products.length,
          })
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          setProducts(prev => [...prev, data]);
        }
        
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('shop_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('shop_products')
        .update({ visible: !currentVisible })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, visible: !currentVisible } : p
      ));
      
      toast.success(currentVisible ? 'Product hidden' : 'Product visible');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bebas uppercase tracking-wider flex items-center gap-2">
          <Package className="w-6 h-6" />
          Shop Catalogue
        </h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Name</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Category</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Price</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">File</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Status</th>
              <th className="text-right p-3 font-bebas uppercase tracking-wider text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground text-sm">{product.category}</td>
                <td className="p-3">£{(product.price ?? 0).toLocaleString()}</td>
                <td className="p-3">
                  {product.file_url ? (
                    <a href={product.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">No file</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${product.visible ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {product.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {product.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleVisibility(product.id, product.visible)}>
                      {product.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No shop products yet. Add your first product to get started.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl uppercase tracking-wider">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (£)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="BESTSELLER"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ribbon">Ribbon (e.g., New)</Label>
                <Input
                  id="ribbon"
                  value={formData.ribbon}
                  onChange={(e) => setFormData({ ...formData, ribbon: e.target.value })}
                  placeholder="New"
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `shop-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                          const { error: uploadError } = await supabase.storage
                            .from('catalog-images')
                            .upload(fileName, file);
                          if (uploadError) throw uploadError;
                          const { data: urlData } = supabase.storage
                            .from('catalog-images')
                            .getPublicUrl(fileName);
                          setFormData({ ...formData, image_url: urlData.publicUrl });
                          toast.success('Image uploaded');
                        } catch (err: any) {
                          console.error(err);
                          toast.error('Failed to upload image');
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.image_url && (
                  <div className="flex items-center gap-2 mt-1">
                    <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, image_url: '' })} className="text-destructive h-6">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Digital File Upload */}
            <div className="space-y-2">
              <Label>Digital File (E-Book, PDF, etc.)</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="flex-1"
                  accept=".pdf,.epub,.zip,.docx"
                />
                {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
              </div>
              {formData.file_url && (
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  File uploaded: {formData.file_url.split('/').pop()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (HTML supported)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={6}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label htmlFor="visible">Visible on shop</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
