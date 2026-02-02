import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Layers, Gauge, Users, Settings, Eye, Edit, Trash2 } from "lucide-react";

export default function AdminSection() {
  const reduceMotion = useReducedMotion();
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const users = [
    { id: 1, name: "Alex Chen", email: "alex@machrou3i.com", role: "Admin", projects: 12, status: "active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@machrou3i.com", role: "Manager", projects: 8, status: "active" },
    { id: 3, name: "Mike Davis", email: "mike@machrou3i.com", role: "User", projects: 5, status: "active" },
    { id: 4, name: "Emma Wilson", email: "emma@machrou3i.com", role: "Manager", projects: 10, status: "active" },
    { id: 5, name: "David Brown", email: "david@machrou3i.com", role: "User", projects: 3, status: "inactive" },
  ];

  const roles = [
    { name: "Admin", permissions: ["Full access", "User management", "System settings", "Audit logs"], color: "destructive" },
    { name: "Manager", permissions: ["Project management", "Team analytics", "Reports", "Limited admin"], color: "gold" },
    { name: "User", permissions: ["View projects", "Create tasks", "Basic reports"], color: "neon" },
  ];

  const filteredUsers = selectedRole === "all" 
    ? users 
    : users.filter(u => u.role.toLowerCase() === selectedRole.toLowerCase());

  return (
    <section id="admin" className="relative min-h-screen px-6 py-16 md:py-20" aria-label="Admin interface">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-2" data-narrate="Admin Cockpit|Glass panels. Clean governance. Total control.">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Admin interface</p>
          </div>

          <motion.h2
            className="mt-5 text-balance text-3xl font-semibold leading-tight md:text-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            data-narrate="Glass panels. Clean governance. Total control|Tables, toggles, roles—presented like a luxury cockpit."
          >
            Glass panels. Clean governance. Total control.
          </motion.h2>
          <p className="mt-3 max-w-xl text-pretty text-base text-muted-foreground">
            Tables, toggles, roles—presented like a luxury cockpit.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Role-Based Access Control */}
          <div className="glass rounded-[2rem] p-6" data-narrate="RBAC|Admin / Manager / User access layers.">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-neon" />
              <h3 className="text-lg font-semibold">Role-Based Access</h3>
            </div>

            <div className="space-y-3">
              {roles.map((role, idx) => (
                <motion.div
                  key={role.name}
                  className="glass glass-hover rounded-xl p-4"
                  initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${role.name} Role|${role.permissions.length} permissions`}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">{role.name}</p>
                    <div className={`h-2 w-2 rounded-full bg-${role.color}`} />
                  </div>
                  <div className="space-y-1.5">
                    {role.permissions.map((perm, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Management Table */}
          <div className="glass rounded-[2rem] p-6 md:col-span-2" data-narrate="User Management|Hover rows—light passes across the table like polished glass.">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex gap-2">
                {["all", "admin", "manager", "user"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                      selectedRole === role
                        ? "bg-primary text-primary-foreground"
                        : "glass glass-hover"
                    }`}
                    data-narrate={`Filter: ${role === "all" ? "All Users" : role.charAt(0).toUpperCase() + role.slice(1)}|Show ${role === "all" ? "all" : role} users`}
                  >
                    {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">Projects</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      className="border-b border-border/30 glass-hover group"
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      data-narrate={`${user.name}|${user.role} • ${user.projects} projects • ${user.status}`}
                    >
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface/60 px-2 py-1 text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-sm">{user.projects}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 text-xs ${
                          user.status === "active" ? "text-neon" : "text-muted-foreground"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "active" ? "bg-neon animate-glow" : "bg-muted-foreground"
                          }`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="glass glass-hover rounded-lg p-1.5" data-narrate="View|View user details">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="glass glass-hover rounded-lg p-1.5" data-narrate="Edit|Edit user">
                            <Edit className="h-3 w-3" />
                          </button>
                          <button className="glass glass-hover rounded-lg p-1.5 text-destructive" data-narrate="Delete|Remove user">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="glass rounded-[2rem] p-6 md:col-span-3" data-narrate="System Health|Operational visibility without noise.">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold">System Health</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { metric: "API Response", value: "98ms", status: "healthy", color: "neon" },
                { metric: "Database", value: "99.9%", status: "healthy", color: "neon" },
                { metric: "Uptime", value: "99.8%", status: "healthy", color: "neon" },
                { metric: "Active Users", value: "1,247", status: "normal", color: "gold" },
              ].map((item, idx) => (
                <motion.div
                  key={item.metric}
                  className="glass glass-hover rounded-xl p-4 text-center"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  data-narrate={`${item.metric}|${item.value} • Status: ${item.status}`}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                >
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <div className={`h-1.5 w-1.5 rounded-full bg-${item.color} animate-glow`} />
                    <span className="text-[10px] text-muted-foreground">{item.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
