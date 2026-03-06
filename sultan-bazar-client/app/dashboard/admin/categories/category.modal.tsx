"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { TCategory } from "@/types/common";
import { uploadToImgBB } from "@/helpers/imgbb.uploads";

const emptyForm = () => ({
    name: "",
    slug: "",
    description: "",
    thumbnail: "",
    isActive: true,
    order: 0,
});

export function CategoryModal({
    open, onClose, initial, onSave, saving,
}: {
    open: boolean;
    onClose: () => void;
    initial: ReturnType<typeof emptyForm> | null;
    onSave: (data: ReturnType<typeof emptyForm>) => void;
    saving: boolean;
}) {
    const [form, setForm] = useState<ReturnType<typeof emptyForm>>(initial ?? emptyForm());
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setForm(initial ?? emptyForm());
        }
    }, [open, initial]);

    if (!open) return null;

    const setField = (k: keyof typeof form, v: string | boolean | number) => setForm((f) => ({ ...f, [k]: v }));

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initial?.name ? "Edit Category" : "Create Category"}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                    <div>
                        <label className="label">Category Name *</label>
                        <input className="input-field" value={form.name}
                            onChange={(e) => {
                                setField("name", e.target.value);
                                if (!initial?.slug) {
                                    setField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                                }
                            }} placeholder="e.g. Spices" />
                    </div>

                    <div>
                        <label className="label">Slug * (used in URL)</label>
                        <input className="input-field" value={form.slug}
                            onChange={(e) => setField("slug", e.target.value)} placeholder="e.g. spices" />
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea className="input-field min-h-[80px] resize-none" value={form.description}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="Brief description of the category..." />
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="label">Thumbnail</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {form.thumbnail ? (
                            <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full h-36">
                                <Image
                                    src={form.thumbnail}
                                    alt="Category thumbnail"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-100"
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Change
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setField("thumbnail", "")}
                                        className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600"
                                    >
                                        <X className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? "border-[#B5451B] bg-orange-50" : "border-gray-200 hover:border-[#B5451B] hover:bg-orange-50/40"}`}
                            >
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#B5451B" }} />
                                ) : (
                                    <>
                                        <ImageIcon className="w-7 h-7 text-gray-300" />
                                        <p className="text-sm font-medium text-gray-400">
                                            {dragOver ? "Drop to upload" : "Click or drag & drop to upload"}
                                        </p>
                                        <p className="text-xs text-gray-300">PNG, JPG, WEBP supported</p>
                                    </>
                                )}
                            </div>
                        )}
                        {uploading && (
                            <p className="text-xs text-[#B5451B] mt-1.5 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Display Order</label>
                            <input type="number" className="input-field" value={form.order}
                                onChange={(e) => setField("order", Number(e.target.value))} />
                        </div>
                        <div className="flex flex-col justify-end pb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isActive}
                                    onChange={(e) => setField("isActive", e.target.checked)}
                                    className="accent-[#B5451B]" />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                    <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
                    <Button disabled={saving || uploading} onClick={() => onSave(form)}
                        className="rounded-xl text-white"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
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
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Category?</h3>
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
