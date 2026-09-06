import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import type { RouteResponse, WarehouseResponse } from "@/types";

interface RouteGraphProps {
  warehouses: WarehouseResponse[];
  routes: RouteResponse[];
}

export default function RouteGraph({ warehouses, routes }: RouteGraphProps) {
  const nodes: Node[] = useMemo(() => {
    const count = warehouses.length || 1;
    const radius = 220;
    return warehouses.map((w, i) => {
      const angle = (2 * Math.PI * i) / count;
      return {
        id: String(w.id),
        position: {
          x: 300 + radius * Math.cos(angle),
          y: 250 + radius * Math.sin(angle),
        },
        data: { label: w.name },
        style: {
          background: "rgba(79, 70, 229, 0.15)",
          border: "1px solid rgba(79, 70, 229, 0.5)",
          borderRadius: 12,
          color: "white",
          padding: 10,
          fontSize: 12,
          fontWeight: 500,
          width: 140,
          textAlign: "center" as const,
        },
      };
    });
  }, [warehouses]);

  const edges: Edge[] = useMemo(
    () =>
      routes.map((r) => ({
        id: String(r.id),
        source: String(r.sourceWarehouseId),
        target: String(r.destinationWarehouseId),
        label: `${r.distance} km`,
        labelStyle: { fill: "#94a3b8", fontSize: 11 },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
        style: { stroke: "#4f46e5", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#4f46e5" },
        animated: true,
      })),
    [routes]
  );

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#ffffff10" gap={20} />
        <Controls className="!bg-surface !border-white/10 [&>button]:!bg-white/5 [&>button]:!border-white/10 [&>button]:!text-white" />
      </ReactFlow>
    </div>
  );
}