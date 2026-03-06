"use client";

import { useState, useEffect, useRef } from "react";
import type { TVariant, TProduct, TCategory } from "@/types/common";
import { X, Loader2, Plus, AlertTriangle, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { uploadToImgBB } from "@/helpers/imgbb.uploads";

const emptyVariant = (): TVariant => ({ name: "", sku: "", price: 0, stock: 0, isAvailable: true });

const emptyForm = () => ({
    name: "", slug: "", description: "", category: "", thumbnail: "",
    tags: "", status: "active" as "active" | "draft" | "archived",
    variants: [emptyVariant()],
});

export function ProductModal({
    open, onClose, initial, onSave, saving, categoriesList
}: {
    open: boolean;
    onClose: () => void;
    initial: ReturnType<typeof emptyForm> | null;
    onSave: (data: ReturnType<typeof emptyForm>) => void;
    saving: boolean;
    categoriesList: TCategory[];
}) {
    const [form, setForm] = useState<ReturnType<typeof emptyForm>>(initial ?? emptyForm());
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update form when initial changes (e.g., when Edit button is clicked)
    useEffect(() => {
        if (open) {
            setForm(initial ?? emptyForm());
        }
    }, [open, initial]);

    if (!open) return null;

    const setField = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
    const setVariant = (i: number, k: string, v: unknown) =>
        setForm((f) => {
            const vs = [...f.variants];
            vs[i] = { ...vs[i], [k]: v };
            return { ...f, variants: vs };
        });
    const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
    const removeVariant = (i: number) =>
        setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

    const handleImageUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        try {
            setUploading(true);
            const url = await uploadToImgBB(file);
            setField("thumbnail", url);
        } catch (err: any) {
            alert(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageUpload(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initial?.name ? "Edit Product" : "Create Product"}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                    {/* Basic info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Product Name *</label>
                            <input className="input-field" value={form.name}
                                onChange={(e) => {
                                    setField("name", e.target.value);
                                    if (!initial?.slug) {
                                        setField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                                    }
                                }} placeholder="e.g. Mustard Oil" />
                        </div>
                        <div>
                            <label className="label">Category *</label>
                            <select className="input-field" value={form.category}
                                onChange={(e) => setField("category", e.target.value)}>
                                <option value="" disabled>Select a category</option>
                                {categoriesList.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label">Slug * (used in URL)</label>
                        <input className="input-field" value={form.slug}
                            onChange={(e) => setField("slug", e.target.value)} placeholder="e.g. mustard-oil" />
                    </div>

                    <div>
                        <label className="label">Description *</label>
                        <textarea className="input-field min-h-[80px] resize-none" value={form.description}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="Product description..." />
                    </div>

                    {/* Thumbnail Upload + Tags row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                        <div>
                            <label className="label">Thumbnail *</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {form.thumbnail ? (
                                <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full h-32">
                                    <Image
                                        src={form.thumbnail}
                                        alt="Product thumbnail"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white text-gray-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-100"
                                        >
                                            <Upload className="w-3 h-3" /> Change
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setField("thumbnail", "")}
                                            className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${dragOver ? "border-[#B5451B] bg-orange-50" : "border-gray-200 hover:border-[#B5451B] hover:bg-orange-50/40"
                                        }`}
                                >
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#B5451B" }} />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                            <p className="text-xs font-medium text-gray-400">
                                                {dragOver ? "Drop to upload" : "Click or drag & drop"}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                            {uploading && (
                                <p className="text-xs text-[#B5451B] mt-1 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="label">Tags (comma separated)</label>
                            <input className="input-field" value={form.tags}
                                onChange={(e) => setField("tags", e.target.value)} placeholder="spice, oil, raw" />
                        </div>
                    </div>

                    <div>
                        <label className="label">Status</label>
                        <select className="input-field" value={form.status}
                            onChange={(e) => setField("status", e.target.value)}>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Variants */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="label mb-0">Variants *</label>
                            <button type="button" onClick={addVariant}
                                className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#B5451B" }}>
                                <Plus className="w-3.5 h-3.5" /> Add Variant
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.variants.map((v, i) => (
                                <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                                    {form.variants.length > 1 && (
                                        <button onClick={() => removeVariant(i)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <p className="text-xs font-semibold text-gray-500 mb-3">Variant {i + 1}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="label">Name *</label>
                                            <input className="input-field" value={v.name}
                                                onChange={(e) => setVariant(i, "name", e.target.value)} placeholder="500ml" />
                                        </div>
                                        <div>
                                            <label className="label">SKU *</label>
                                            <input className="input-field" value={v.sku}
                                                onChange={(e) => setVariant(i, "sku", e.target.value)} placeholder="OIL-500ML" />
                                        </div>
                                        <div>
                                            <label className="label">Price (৳) *</label>
                                            <input type="number" className="input-field" value={v.price}
                                                onChange={(e) => setVariant(i, "price", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="label">Discount Price (৳)</label>
                                            <input type="number" className="input-field" value={v.discountPrice ?? ""}
                                                onChange={(e) => setVariant(i, "discountPrice", e.target.value ? Number(e.target.value) : undefined)} />
                                        </div>
                                        <div>
                                            <label className="label">Stock *</label>
                                            <input type="number" className="input-field" value={v.stock}
                                                onChange={(e) => setVariant(i, "stock", Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="label">Weight (g)</label>
                                            <input type="number" className="input-field" value={v.weight ?? ""}
                                                onChange={(e) => setVariant(i, "weight", e.target.value ? Number(e.target.value) : undefined)} />
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                        <input type="checkbox" checked={v.isAvailable !== false}
                                            onChange={(e) => setVariant(i, "isAvailable", e.target.checked)}
                                            className="accent-[#B5451B]" />
                                        <span className="text-sm text-gray-600">Available for purchase</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
                    <Button disabled={saving || uploading} onClick={() => onSave(form)}
                        className="rounded-xl text-white"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function DeleteDialog({ name, onConfirm, onCancel, loading }: {
    name: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Product?</h3>
                <p className="text-sm text-gray-500 mb-5">
                    Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl">Cancel</Button>
                    <Button onClick={onConfirm} disabled={loading}
                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
