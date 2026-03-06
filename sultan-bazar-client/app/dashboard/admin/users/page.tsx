"use client";

import { useState, useEffect } from "react";
import {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useToggleBlockUserMutation,
    useDeleteUserMutation,
} from "@/redux/api/userApi";
import {
    Users, Search, X, ChevronDown, Loader2, AlertTriangle,
    ShieldCheck, ShieldOff, Trash2, UserCog, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUserInfo } from "@/services/auth.services";

// ── Types ─────────────────────────────────────────────────────────────────────
type TUser = {
    _id: string;
    username: string;
    email: string;
    contactNumber?: string;
    role: "user" | "admin" | "superAdmin";
    isBlocked?: boolean;
    createdAt?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
    user: "bg-gray-100 text-gray-700",
    admin: "bg-blue-100 text-blue-700",
    superAdmin: "bg-purple-100 text-purple-700",
};

const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const AVATAR_COLORS = [
    "#B5451B", "#2563eb", "#7c3aed", "#0891b2", "#16a34a", "#ca8a04",
];
const avatarColor = (id: string) =>
    AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

// ── Delete Confirmation Dialog ───────────────────────────────────────────────
function DeleteDialog({ username, onConfirm, onCancel, loading }: {
    username: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete User?</h3>
                <p className="text-sm text-gray-500 mb-5">
                    Are you sure you want to delete <strong>{username}</strong>? This action cannot be undone.
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

// ── Main Page ─────────────────────────────────────────────────────────────────
type SearchField = "username" | "email" | "phone";

const SEARCH_FIELDS: { value: SearchField; label: string; placeholder: string }[] = [
    { value: "username", label: "Username", placeholder: "Search by username..." },
    { value: "email", label: "Email", placeholder: "Search by email address..." },
    { value: "phone", label: "Phone", placeholder: "Search by phone number..." },
];

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<SearchField>("username");
    const [roleFilter, setRoleFilter] = useState("all");
    const [blockFilter, setBlockFilter] = useState("all");
    const [page, setPage] = useState(1);
    const limit = 15;

    const [deleteTarget, setDeleteTarget] = useState<TUser | null>(null);
    const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

    // Detect current viewer's role — superAdmin gets full controls, admin is read-only
    const [viewerRole, setViewerRole] = useState<string>("admin");
    useEffect(() => {
        const info = getUserInfo();
        if (info?.role) setViewerRole((info.role as string).toLowerCase());
    }, []);
    const isSuperAdmin = viewerRole === "superadmin" || viewerRole === "superAdmin";

    const { data, isLoading, isFetching } = useGetAllUsersQuery(
        { search: search || undefined, role: roleFilter !== "all" ? roleFilter : undefined, page, limit },
        { refetchOnMountOrArgChange: true }
    );

    const [updateRole] = useUpdateUserRoleMutation();
    const [toggleBlock, { isLoading: blocking }] = useToggleBlockUserMutation();
    const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

    const raw = data?.data ?? data;
    const users: TUser[] = raw?.users ?? [];
    const totalPages: number = raw?.totalPages ?? 1;

    // Client-side block filter
    const filteredUsers = users.filter((u) =>
        blockFilter === "all" ? true : blockFilter === "blocked" ? u.isBlocked : !u.isBlocked
    );

    const handleRoleChange = async (user: TUser, newRole: string) => {
        setUpdatingRoleId(user._id);
        try {
            await updateRole({ id: user._id, role: newRole }).unwrap();
            toast.success(`Role updated to ${newRole}`);
        } catch {
            toast.error("Failed to update role.");
        } finally {
            setUpdatingRoleId(null);
        }
    };

    const handleToggleBlock = async (user: TUser) => {
        try {
            await toggleBlock(user._id).unwrap();
            toast.success(user.isBlocked ? "User unblocked." : "User blocked.");
        } catch {
            toast.error("Failed to update block status.");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteUser(deleteTarget._id).unwrap();
            toast.success("User deleted.");
            setDeleteTarget(null);
        } catch {
            toast.error("Failed to delete user.");
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6" style={{ color: "#B5451B" }} />
                        Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage all registered users
                    </p>
                </div>
                {raw?.total !== undefined && (
                    <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                        <span className="font-bold text-gray-800">{raw.total}</span> total users
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search field selector + input */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#B5451B] transition-colors flex-1 min-w-[220px] max-w-sm">
                    <select
                        value={searchField}
                        onChange={(e) => { setSearchField(e.target.value as SearchField); setSearch(""); setPage(1); }}
                        className="text-xs font-semibold text-gray-500 bg-gray-50 border-r border-gray-200 px-3 py-2.5 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        {SEARCH_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
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

                {/* Role filter */}
                <div className="relative">
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 ${roleFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superAdmin">Super Admin</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Block status filter */}
                <div className="relative">
                    <select
                        value={blockFilter}
                        onChange={(e) => setBlockFilter(e.target.value)}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 ${blockFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear */}
                {(search || roleFilter !== "all" || blockFilter !== "all") && (
                    <button
                        onClick={() => { setSearch(""); setRoleFilter("all"); setBlockFilter("all"); setPage(1); }}
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
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 font-medium">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                                    {isSuperAdmin && <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className={`hover:bg-gray-50/50 transition-colors ${user.isBlocked ? "opacity-60" : ""}`}>
                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                                    style={{ background: avatarColor(user._id) }}
                                                >
                                                    {getInitials(user.username)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">{user.username}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-4 py-4 text-gray-500 text-xs hidden md:table-cell">
                                            {user.contactNumber || <span className="text-gray-300">—</span>}
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-4">
                                            {isSuperAdmin ? (
                                                <div className="relative inline-flex items-center">
                                                    {updatingRoleId === user._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                    ) : (
                                                        <div className="relative">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleRoleChange(user, e.target.value)}
                                                                className={`text-[11px] font-semibold rounded-full pl-2.5 pr-6 py-1 appearance-none cursor-pointer outline-none border-0 ${ROLE_COLORS[user.role]}`}
                                                            >
                                                                <option value="user">user</option>
                                                                <option value="admin">admin</option>
                                                                <option value="superAdmin">superAdmin</option>
                                                            </select>
                                                            <UserCog className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none opacity-60" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${user.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-4 py-4 text-xs text-gray-400 hidden lg:table-cell">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                                : "—"}
                                        </td>

                                        {/* Actions */}
                                        {isSuperAdmin && (
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleBlock(user)}
                                                        title={user.isBlocked ? "Unblock user" : "Block user"}
                                                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${user.isBlocked ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}
                                                    >
                                                        {user.isBlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                                                        {user.isBlocked ? "Unblock" : "Block"}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(user)}
                                                        title="Delete user"
                                                        className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
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

            {/* Delete confirmation */}
            {deleteTarget && (
                <DeleteDialog
                    username={deleteTarget.username}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}
        </div>
    );
}
