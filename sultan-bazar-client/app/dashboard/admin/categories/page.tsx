"use client";

import { useState, useEffect } from "react";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useToggleCategoryStatusMutation,
} from "@/redux/api/categoryApi";
import {
    Plus, Search, Pencil, Trash2, Tags,
    X, Loader2, AlertTriangle, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TCategory } from "@/types/common";

const emptyForm = () => ({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    order: 0,
});

// ─── Modal ────────────────────────────────────────────────────────────────────
function CategoryModal({
    open, onClose, initial, onSave, saving,
}: {
    open: boolean;
    onClose: () => void;
    initial: ReturnType<typeof emptyForm> | null;
    onSave: (data: ReturnType<typeof emptyForm>) => void;
    saving: boolean;
}) {
    const [form, setForm] = useState<ReturnType<typeof emptyForm>>(initial ?? emptyForm());

    useEffect(() => {
        if (open) {
            setForm(initial ?? emptyForm());
        }
    }, [open, initial]);

    if (!open) return null;

    const setField = (k: keyof typeof form, v: string | boolean | number) => setForm((f) => ({ ...f, [k]: v }));

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
                    <Button disabled={saving} onClick={() => onSave(form)}
                        className="rounded-xl text-white"
                        style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteDialog({ name, onConfirm, onCancel, loading }: {
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
    const [search, setSearch] = useState("");

    const { data, isLoading, isFetching } = useGetAllCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });

    const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();
    const [toggleStatus] = useToggleCategoryStatusMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<TCategory | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TCategory | null>(null);

    const categories: TCategory[] = (Array.isArray(data) ? data : data?.data) || [];

    console.log('categories', data);
    // Client-side search (since category API might not support ?search= yet)
    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    ).sort((a, b) => a.order - b.order);

    // ── Helpers ──────────────────────────────────────────────────────
    const categoryToForm = (c: TCategory): ReturnType<typeof emptyForm> => ({
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        isActive: c.isActive,
        order: c.order,
    });

    const openCreate = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (c: TCategory) => { setEditTarget(c); setModalOpen(true); };

    const handleSave = async (form: ReturnType<typeof emptyForm>) => {
        try {
            if (editTarget) {
                // Determine changed fields
                const changes: Record<string, unknown> = {};
                if (form.name !== editTarget.name) changes.name = form.name;
                if (form.slug !== editTarget.slug) changes.slug = form.slug;
                if (form.description !== editTarget.description) changes.description = form.description;
                if (form.isActive !== editTarget.isActive) changes.isActive = form.isActive;
                if (form.order !== editTarget.order) changes.order = form.order;

                if (Object.keys(changes).length === 0) {
                    toast.info("No changes made.");
                    setModalOpen(false);
                    return;
                }

                await updateCategory({ id: editTarget._id, data: changes }).unwrap();
                toast.success("Category updated!");
            } else {
                await createCategory(form).unwrap();
                toast.success("Category created!");
            }
            setModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCategory(deleteTarget._id).unwrap();
            toast.success("Category deleted.");
            setDeleteTarget(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete category.");
        }
    };

    const handleToggleStatus = async (c: TCategory) => {
        try {
            await toggleStatus(c._id).unwrap();
            toast.success(`Category is now ${c.isActive ? 'hidden' : 'visible'}.`);
        } catch {
            toast.error("Failed to update status.");
        }
    };

    // ── Render ────────────────────────────────────────────────────────
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Tags className="w-6 h-6" style={{ color: "#B5451B" }} />
                        Categories
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage product categories and collections</p>
                </div>
                <Button onClick={openCreate}
                    className="flex items-center gap-2 text-white rounded-xl px-5"
                    style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                    <Plus className="w-4 h-4" />
                    Create Category
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-6 focus-within:border-[#B5451B] transition-colors max-w-sm">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading || isFetching ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#B5451B" }} />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-20">
                        <Tags className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 font-medium">No categories found</p>
                        <button onClick={openCreate}
                            className="mt-3 text-sm font-semibold hover:underline" style={{ color: "#B5451B" }}>
                            Create your first category
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredCategories.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Category Info */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900">{c.name}</span>
                                                <span className="text-xs text-gray-400">/{c.slug}</span>
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="px-4 py-4 text-gray-500 hidden md:table-cell text-sm max-w-xs truncate">
                                            {c.description || <span className="text-gray-300 italic">No description</span>}
                                        </td>

                                        {/* Order */}
                                        <td className="px-4 py-4 text-gray-500 font-medium">
                                            #{c.order}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <button onClick={() => handleToggleStatus(c)} title={c.isActive ? "Hide category" : "Make visible"}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors
                                                ${c.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                                {c.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {c.isActive ? "Visible" : "Hidden"}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(c)}
                                                    className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#B5451B] transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(c)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CategoryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={editTarget ? categoryToForm(editTarget) : null}
                onSave={handleSave}
                saving={creating || updating}
            />
            {deleteTarget && (
                <DeleteDialog
                    name={deleteTarget.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </div>
    );
}
