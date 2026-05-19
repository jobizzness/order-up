"use client";

const projects = [
  { label: "Kitchen", color: "bg-green-500" },
  { label: "Dispatcher", color: "bg-blue-500" },
  { label: "Bar", color: "bg-purple-500" },
];

export function SidebarProjects() {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
        Views
      </h3>
      <div className="flex flex-col gap-0.5">
        {projects.map((project) => (
          <a
            key={project.label}
            href="#"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${project.color}`} />
            <span>{project.label}</span>
          </a>
        ))}
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span>+</span>
          <span>Add New</span>
        </button>
      </div>
    </div>
  );
}
