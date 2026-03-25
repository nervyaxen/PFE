import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Server, Database, Key, Activity, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
    { id: 'usr_reg123', name: 'Standard User', email: 'user@machrou3i.com', role: 'user', lastActive: '2 mins ago', status: 'Active' },
    { id: 'usr_mgr123', name: 'Project Manager', email: 'manager@machrou3i.com', role: 'manager', lastActive: '1 hr ago', status: 'Active' },
    { id: 'usr_adm123', name: 'System Admin', email: 'admin@machrou3i.com', role: 'admin', lastActive: 'Just now', status: 'Active' },
    { id: 'usr_4452', name: 'External Contributor', email: 'ext@partner.io', role: 'user', lastActive: '3 days ago', status: 'Suspended' },
];

const mockLogs = [
    { id: 1, action: 'FAILED_LOGIN', user: 'unknown@ip.x', time: '10:42 AM', severity: 'high' },
    { id: 2, action: 'ROLE_ELEVATION', user: 'admin@machrou3i.com', time: '09:15 AM', severity: 'medium' },
    { id: 3, action: 'API_KEY_GEN', user: 'manager@machrou3i.com', time: '08:30 AM', severity: 'low' },
    { id: 4, action: 'MASS_EXPORT', user: 'user@machrou3i.com', time: 'Yesterday', severity: 'medium' },
];

export default function AdminControlCenter() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Heavy Security background overlay */}
            <div className="absolute top-0 right-1/4 w-[1000px] h-[500px] bg-destructive/10 rounded-full blur-[200px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto space-y-8 relative">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 glass rounded-2xl flex items-center justify-center border-destructive/40 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]">
                            <ShieldAlert className="w-8 h-8 text-destructive animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                System Cockpit <span className="text-xs uppercase tracking-widest font-bold text-destructive bg-destructive/10 px-2 py-1 rounded-full border border-destructive/30">Level 5 Access</span>
                            </h1>
                            <p className="text-muted-foreground mt-1 text-lg">
                                Authenticated as <span className="text-neon">{user?.email}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="glass border-border hover:bg-surface"
                            onClick={() => navigate('/workspace')}
                        >
                            Return to Base
                        </Button>
                        <Button
                            variant="outline"
                            className="glass border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" /> Disconnect
                        </Button>
                    </div>
                </motion.div>

                {/* Global System Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <AdminMetric title="Active Connections" value="1,204" icon={<Activity className="w-5 h-5 text-neon" />} color="neon" />
                    <AdminMetric title="API Health (90d)" value="99.99%" icon={<Server className="w-5 h-5 text-gold" />} color="gold" />
                    <AdminMetric title="Database Load" value="42%" icon={<Database className="w-5 h-5 text-primary" />} color="primary" />
                    <AdminMetric title="Security Alerts" value="3" icon={<ShieldAlert className="w-5 h-5 text-destructive" />} color="destructive" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* User Management Table */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass cinematic-panel p-6 rounded-2xl depth-shadow-elevated"
                        data-narrate="Entity Database|Control user roles, suspensions, and access levels"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Users className="w-5 h-5 text-neon" /> Entity Management
                            </h2>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input className="glass pl-9 border-border/50" placeholder="Search identities..." />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/20 hidden md:block">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-surface/50 text-muted-foreground border-b border-border/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Identity</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Clearance</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Last Sync</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockUsers.map((u) => (
                                        <tr key={u.id} className="border-b border-border/20 hover:bg-surface/30 transition-colors last:border-0">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">{u.name}</div>
                                                <div className="text-xs text-muted-foreground">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${u.role === 'admin' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                        u.role === 'manager' ? 'bg-gold/10 text-gold border-gold/20' :
                                                            'bg-neon/10 text-neon border-neon/20'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{u.lastActive}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-neon' : 'bg-muted-foreground'}`} />
                                                    {u.status}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile fallback list */}
                        <div className="md:hidden space-y-4">
                            {mockUsers.map(u => (
                                <div key={u.id} className="glass p-4 rounded-xl border border-border/50">
                                    <div className="font-semibold">{u.name}</div>
                                    <div className="text-xs text-muted-foreground mb-2">{u.email}</div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${u.role === 'admin' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                u.role === 'manager' ? 'bg-gold/10 text-gold border-gold/20' :
                                                    'bg-neon/10 text-neon border-neon/20'
                                            }`}>
                                            {u.role}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{u.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </motion.div>

                    {/* Security Audit Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-6 rounded-2xl h-full shadow-lg"
                        data-narrate="Audit Log|Immutable ledger of critical system actions"
                    >
                        <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3">
                            <Key className="w-4 h-4 text-muted-foreground" /> Security Audit
                        </h2>
                        <div className="space-y-4">
                            {mockLogs.map(log => (
                                <div key={log.id} className="p-3 rounded-xl bg-surface/50 border border-border/30 hover:bg-surface transition-colors cursor-default">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${log.severity === 'high' ? 'text-destructive' :
                                                log.severity === 'medium' ? 'text-gold' : 'text-neon'
                                            }`}>
                                            {log.action}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{log.time}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 truncate" title={log.user}>{log.user}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="w-full mt-4 text-muted-foreground hover:text-foreground">
                            View Complete Immutable Ledger
                        </Button>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function AdminMetric({ title, value, icon, color }: any) {
    const colorMap: Record<string, string> = {
        neon: 'bg-neon/10 text-neon border-neon/30',
        gold: 'bg-gold/10 text-gold border-gold/30',
        primary: 'bg-primary border-primary',
        destructive: 'bg-destructive/10 text-destructive border-destructive/30',
    };

    return (
        <div className="glass floating-panel rounded-2xl p-5 border border-border/40 flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
            </div>
        </div>
    );
}
