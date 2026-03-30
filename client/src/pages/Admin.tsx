import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Upload, Trash2, Star, StarOff, Loader2, Mail, Plus, Image as ImageIcon } from "lucide-react";
import type { Painting, Enquiry } from "@shared/types";

type Tab = "paintings" | "upload" | "enquiries";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("paintings");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access the admin dashboard.</p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-primary text-primary-foreground py-8 border-b border-primary/20">
        <div className="container">
          <h1 className="font-serif text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-primary-foreground/60 text-sm mt-1">Manage paintings and enquiries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container flex gap-0">
          {([
            { key: "paintings", label: "Paintings", icon: <ImageIcon className="w-4 h-4" /> },
            { key: "upload", label: "Upload New", icon: <Plus className="w-4 h-4" /> },
            { key: "enquiries", label: "Enquiries", icon: <Mail className="w-4 h-4" /> },
          ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-10">
        {tab === "paintings" && <PaintingsList />}
        {tab === "upload" && <UploadForm onSuccess={() => setTab("paintings")} />}
        {tab === "enquiries" && <EnquiriesList />}
      </div>
    </div>
  );
}

// ─── Paintings List ───────────────────────────────────────────────────────────

function PaintingsList() {
  const utils = trpc.useUtils();
  const { data: paintings, isLoading } = trpc.paintings.list.useQuery();

  const deleteMutation = trpc.paintings.delete.useMutation({
    onSuccess: () => {
      utils.paintings.list.invalidate();
      utils.paintings.featured.invalidate();
      toast.success("Painting deleted.");
    },
    onError: (e) => toast.error(e.message),
  });

  const featureMutation = trpc.paintings.setFeatured.useMutation({
    onSuccess: () => {
      utils.paintings.list.invalidate();
      utils.paintings.featured.invalidate();
      toast.success("Featured painting updated.");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  if (!paintings || paintings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No paintings yet. Upload your first one!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">All Paintings ({paintings.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {paintings.map((painting: Painting) => (
          <div key={painting.id} className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <img src={painting.imageUrl} alt={painting.title} className="w-full h-full object-cover" />
              {painting.featured && (
                <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-sm">
                  Featured
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-serif text-sm font-semibold text-foreground line-clamp-1">{painting.title}</p>
              {painting.medium && <p className="text-xs text-muted-foreground">{painting.medium}</p>}
              {painting.price && <p className="text-xs font-medium text-accent">${Number(painting.price).toLocaleString()}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => featureMutation.mutate({ id: painting.id })}
                  disabled={featureMutation.isPending}
                  title={painting.featured ? "Unset featured" : "Set as featured"}
                  className="flex-1 flex items-center justify-center gap-1 text-xs border border-border py-1.5 rounded-sm hover:bg-muted transition-colors"
                >
                  {painting.featured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                  {painting.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${painting.title}"?`)) {
                      deleteMutation.mutate({ id: painting.id });
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex items-center justify-center px-2 py-1.5 border border-destructive/30 text-destructive rounded-sm hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ name: string; type: string; dataUrl: string } | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    medium: "",
    dimensions: "",
    price: "",
    featured: false,
  });

  const uploadImage = trpc.paintings.uploadImage.useMutation();
  const createPainting = trpc.paintings.create.useMutation({
    onSuccess: () => {
      utils.paintings.list.invalidate();
      utils.paintings.featured.invalidate();
      toast.success("Painting uploaded successfully!");
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
      setFileData({ name: file.name, type: file.type, dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) { toast.error("Please select an image."); return; }
    if (!form.title.trim()) { toast.error("Title is required."); return; }

    try {
      const { url, key } = await uploadImage.mutateAsync({
        filename: fileData.name,
        contentType: fileData.type,
        dataUrl: fileData.dataUrl,
      });

      await createPainting.mutateAsync({
        title: form.title,
        description: form.description || undefined,
        medium: form.medium || undefined,
        dimensions: form.dimensions || undefined,
        price: form.price || undefined,
        imageUrl: url,
        imageKey: key,
        featured: form.featured,
      });
    } catch {
      // errors handled by mutation callbacks
    }
  };

  const isLoading = uploadImage.isPending || createPainting.isPending;

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Upload New Painting</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Painting Image <span className="text-destructive">*</span>
          </label>
          <div
            className="border-2 border-dashed border-border rounded-sm p-6 text-center cursor-pointer hover:border-accent transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-sm object-contain" />
            ) : (
              <div className="text-muted-foreground">
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click to select an image</p>
                <p className="text-xs mt-1 opacity-60">JPG, PNG, WEBP — max 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Golden Retriever in Morning Light"
            className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Medium & Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              placeholder="e.g. Oil on canvas"
              className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Dimensions</label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="e.g. 24 × 30 in"
              className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Price (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 1200"
            className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the painting, the dog, the mood, the technique..."
            className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="featured" className="text-sm font-medium text-foreground">
            Set as featured painting (shown in homepage hero)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4" /> Upload Painting</>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Enquiries List ───────────────────────────────────────────────────────────

function EnquiriesList() {
  const { data: enquiries, isLoading } = trpc.enquiries.list.useQuery();

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  if (!enquiries || enquiries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No enquiries received yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Enquiries ({enquiries.length})</h2>
      <div className="space-y-4">
        {enquiries.map((enquiry: Enquiry) => (
          <div key={enquiry.id} className="bg-card border border-border rounded-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-medium text-foreground">{enquiry.name}</p>
                <a href={`mailto:${enquiry.email}`} className="text-sm text-accent hover:underline">{enquiry.email}</a>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                {enquiry.paintingTitle && (
                  <p className="text-xs text-muted-foreground mt-0.5">Re: {enquiry.paintingTitle}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
            <div className="mt-3">
              <a
                href={`mailto:${enquiry.email}?subject=Re: Your Enquiry - Paw & Canvas`}
                className="text-xs font-medium text-accent hover:underline"
              >
                Reply via email →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
