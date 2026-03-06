"use client";

import { useState, useEffect } from "react";
import {
    useGetAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useToggleFeaturedMutation,
} from "@/redux/api/productApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import type { TVariant, TProduct, TCategory } from "@/types/common";
import {
    Plus, Search, Pencil, Trash2, Star, Package,
    X, Loader2, ChevronLeft, ChevronRight, AlertTriangle, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";



const emptyVariant = (): TVariant => ({ name: "", sku: "", price: 0, stock: 0, isAvailable: true });

const emptyForm = () => ({
    name: "", slug: "", description: "", category: "", thumbnail: "",
    tags: "", status: "active" as "active" | "draft" | "archived",
    variants: [emptyVariant()],
});

const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-500",
};

import { ProductModal, DeleteDialog } from "./product.modal";


// ─── Main Page ────────────────────────────────────────────────────────────────
type SearchField = "name" | "slug" | "tag";

const SEARCH_FIELDS: { value: SearchField; label: string; placeholder: string }[] = [
    { value: "name", label: "Name", placeholder: "Search by product name..." },
    { value: "slug", label: "Slug", placeholder: "Search by slug, e.g. mustard-oil..." },
    { value: "tag", label: "Tag", placeholder: "Search by tag, e.g. spice..." },
];

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<SearchField>("name");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isFetching } = useGetAllProductsQuery(
        { search: search || undefined, page, limit },
        { refetchOnMountOrArgChange: true }
    );
    const { data: categoryData } = useGetAllCategoriesQuery(undefined);
    const categoriesList: TCategory[] = (Array.isArray(categoryData) ? categoryData : categoryData?.data) || [];

    const [createProduct, { isLoading: creating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
    const [toggleFeatured] = useToggleFeaturedMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<TProduct | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TProduct | null>(null);

    const allProducts: TProduct[] = data?.data?.products ?? data?.data ?? [];
    const totalPages: number = data?.data?.totalPages ?? 1;

    // ── Client-side filtering ──────────────────────────────────────────
    const products = allProducts.filter((p) => {
        const q = search.toLowerCase();

        // Search field filter
        const matchesSearch = !q || (() => {
            if (searchField === "name") return p.name.toLowerCase().includes(q);
            if (searchField === "slug") return p.slug.toLowerCase().includes(q);
            if (searchField === "tag") return (p.tags ?? []).some(t => t.toLowerCase().includes(q));
            return true;
        })();

        // Status filter
        const matchesStatus = statusFilter === "all" || (p.status ?? "active") === statusFilter;

        // Category filter
        const catId = typeof p.category === "object" ? (p.category as any)?._id : p.category;
        const matchesCategory = categoryFilter === "all" || catId === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // ── Helpers ──────────────────────────────────────────────────────
    const productToForm = (p: TProduct): ReturnType<typeof emptyForm> => ({
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: typeof p.category === "string" ? p.category : (p.category as any)?._id || "",
        thumbnail: p.thumbnail,
        tags: (p.tags ?? []).join(", "),
        status: p.status ?? "active",
        variants: p.variants.length ? p.variants : [emptyVariant()],
    });

    const formToPayload = (f: ReturnType<typeof emptyForm>) => ({
        name: f.name,
        slug: f.slug,
        description: f.description,
        category: f.category,
        thumbnail: f.thumbnail,
        tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        status: f.status,
        variants: f.variants,
    });

    const getChangedFields = (original: TProduct, formPayload: ReturnType<typeof formToPayload>) => {
        const changes: Record<string, unknown> = {};
        if (original.name !== formPayload.name) changes.name = formPayload.name;
        if (original.slug !== formPayload.slug) changes.slug = formPayload.slug;
        if (original.description !== formPayload.description) changes.description = formPayload.description;
        if (original.category !== formPayload.category) changes.category = formPayload.category;
        if (original.thumbnail !== formPayload.thumbnail) changes.thumbnail = formPayload.thumbnail;
        if (original.status !== formPayload.status) changes.status = formPayload.status;

        const originalTags = (original.tags ?? []).join(",");
        const newTags = formPayload.tags.join(",");
        if (originalTags !== newTags) changes.tags = formPayload.tags;

        // For variants, we currently send all of them if any change, 
        // to keep it simple but ensure required schema for the variant array is met.
        // If variants differ in length or content, we send the whole array.
        const originalVariants = JSON.stringify(original.variants.map(v => ({ ...v, _id: undefined })));
        const newVariants = JSON.stringify(formPayload.variants.map(v => ({ ...v, _id: undefined })));
        if (originalVariants !== newVariants) {
            changes.variants = formPayload.variants;
        }

        return changes;
    };

    const openCreate = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (p: TProduct) => { setEditTarget(p); setModalOpen(true); };

    const handleSave = async (form: ReturnType<typeof emptyForm>) => {
        try {
            const payload = formToPayload(form);
            if (editTarget) {
                const changes = getChangedFields(editTarget, payload);
                if (Object.keys(changes).length === 0) {
                    toast.info("No changes made.");
                    setModalOpen(false);
                    return;
                }
                await updateProduct({ id: editTarget._id, data: changes }).unwrap();
                toast.success("Product updated!");
            } else {
                await createProduct(payload).unwrap();
                toast.success("Product created!");
            }
            setModalOpen(false);
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteProduct(deleteTarget._id).unwrap();
            toast.success("Product deleted.");
            setDeleteTarget(null);
        } catch {
            toast.error("Failed to delete product.");
        }
    };

    const handleToggleFeatured = async (p: TProduct) => {
        try {
            await toggleFeatured(p._id).unwrap();
            toast.success(p.isFeatured ? "Removed from featured." : "Marked as featured!");
        } catch {
            toast.error("Failed to update featured status.");
        }
    };

    // ── Render ────────────────────────────────────────────────────────
    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-6 h-6" style={{ color: "#B5451B" }} />
                        Products
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your product catalogue</p>
                </div>
                <Button onClick={openCreate}
                    className="flex items-center gap-2 text-white rounded-xl px-5"
                    style={{ background: "linear-gradient(135deg, #B5451B, #D4860A)" }}>
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Toolbar: Search + Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search Field Selector + Input */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#B5451B] transition-colors flex-1 min-w-[220px] max-w-sm">
                    <select
                        value={searchField}
                        onChange={(e) => { setSearchField(e.target.value as SearchField); setSearch(""); setPage(1); }}
                        className="text-xs font-semibold text-gray-500 bg-gray-50 border-r border-gray-200 px-3 py-2.5 outline-none cursor-pointer h-full hover:bg-gray-100 transition-colors"
                    >
                        {SEARCH_FIELDS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                    <div className="flex items-center flex-1 px-3 gap-2">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 py-2.5"
                            placeholder={SEARCH_FIELDS.find(f => f.value === searchField)?.placeholder}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 ${statusFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 ${categoryFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                    >
                        <option value="all">All Categories</option>
                        {categoriesList.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear filters */}
                {(search || statusFilter !== "all" || categoryFilter !== "all") && (
                    <button
                        onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); setPage(1); }}
                        className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>


            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading || isFetching ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#B5451B" }} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 font-medium">No products found</p>
                        <button onClick={openCreate}
                            className="mt-3 text-sm font-semibold hover:underline" style={{ color: "#B5451B" }}>
                            Create your first product
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Featured</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Product */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {p.thumbnail ? (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                                        <Image src={p.thumbnail} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-5 h-5" style={{ color: "#B5451B" }} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">{p.name}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[160px]">/{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-4 text-gray-500 hidden md:table-cell text-xs">
                                            {typeof p.category === "object" && p.category !== null
                                                ? (p.category as any).name
                                                : String(p.category).slice(0, 8) + "…"}
                                        </td>

                                        {/* Variants */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                {p.variants.slice(0, 2).map((v, i) => (
                                                    <span key={i} className="text-xs text-gray-600">
                                                        {v.name} — <span className="font-semibold">৳{v.discountPrice ?? v.price}</span>
                                                        {" "}<span className="text-gray-400">(×{v.stock})</span>
                                                    </span>
                                                ))}
                                                {p.variants.length > 2 && (
                                                    <span className="text-xs text-gray-400">+{p.variants.length - 2} more</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status ?? "active"]}`}>
                                                {p.status ?? "active"}
                                            </span>
                                        </td>

                                        {/* Featured */}
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <button onClick={() => handleToggleFeatured(p)} title="Toggle featured"
                                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${p.isFeatured ? "bg-yellow-100 text-yellow-500" : "hover:bg-gray-100 text-gray-300"}`}>
                                                <Star className="w-3.5 h-3.5" fill={p.isFeatured ? "currentColor" : "none"} />
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(p)}
                                                    className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#B5451B] transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(p)}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button key={n} onClick={() => setPage(n)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? "text-white shadow-sm" : "border border-gray-200 hover:bg-gray-50"}`}
                            style={n === page ? { background: "linear-gradient(135deg, #B5451B, #D4860A)" } : {}}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Modals */}
            <ProductModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={editTarget ? productToForm(editTarget) : null}
                onSave={handleSave}
                saving={creating || updating}
                categoriesList={categoriesList}
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
