"use client";
import React, { useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    RefreshCw,
    Loader2,
    Mail,
    Calendar,
    UserCheck,
    Users,
} from "lucide-react";
import { useUserList } from "@/hooks/useListUser";
export default function UserListTab() {
    const { users, loadingData, error, fetchUsers } = useUserList();

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Format date helper
    const formatDate = (dateString: string | Date) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };

    // Get recent users (joined in last 7 days)
    const recentUsers = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return userDate >= weekAgo;
    }).length;

    return (
        <div className="w-full space-y-6 p-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <UserIcon className="w-6 h-6" />
                        User List
                    </h1>
                    <p className="text-muted-foreground">
                        View all users who have logged into your website
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Total: {users.length}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        New: {recentUsers}
                    </Badge>
                    <Button
                        onClick={fetchUsers}
                        disabled={loadingData}
                        variant="outline"
                        size="sm"
                    >
                        {loadingData ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            {users.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm text-muted-foreground">New This Week</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {recentUsers}
                                </p>
                            </div>
                            <UserCheck className="w-8 h-8 text-green-600" />
                        </CardContent>
                    </Card>

                    <Card className="">
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Growth Rate</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {users.length > 0
                                        ? Math.round((recentUsers / users.length) * 100)
                                        : 0}
                                    %
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-600" />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Content */}
            <Card className="min-h-screen overflow-y-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        All Registered Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-center py-4 text-red-600">
                            <p>{error}</p>
                            <Button
                                onClick={fetchUsers}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {loadingData ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mr-2" />
                            <span>Loading users...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8">
                            <UserIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                Registered users will appear here once they sign up.
                            </p>
                            <Button onClick={fetchUsers} variant="outline" className="mt-4">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh List
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" />
                                                ID
                                            </div>
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </div>
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Joined Date
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => {
                                        const isRecent = (() => {
                                            const userDate = new Date(user.createdAt);
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return userDate >= weekAgo;
                                        })();

                                        return (
                                            <TableRow key={user.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{user.id}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                                                        {user.name || "No Name"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                                    {formatDate(user.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={isRecent ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {isRecent ? "New" : "Active"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
