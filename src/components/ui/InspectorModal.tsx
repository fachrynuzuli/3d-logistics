import React from 'react';
import { 
  X, 
  Package, 
  Bot, 
  Warehouse, 
  Truck, 
  MapPin, 
  Send 
} from 'lucide-react';
import { useLogisticsStore } from '../../store/useLogisticsStore';

export const InspectorModal: React.FC = () => {
  const selectedEntity = useLogisticsStore((s) => s.selectedEntity);
  const setSelectedEntity = useLogisticsStore((s) => s.setSelectedEntity);
  const boxes = useLogisticsStore((s) => s.boxes);
  const agvs = useLogisticsStore((s) => s.agvs);
  const racks = useLogisticsStore((s) => s.racks);
  const dispatchPickOrder = useLogisticsStore((s) => s.dispatchPickOrder);
  const setFollowedAgvId = useLogisticsStore((s) => s.setFollowedAgvId);

  if (!selectedEntity) return null;

  const handleClose = () => setSelectedEntity(null);

  // 1. Box Inspection
  if (selectedEntity.type === 'box') {
    const box = boxes[selectedEntity.id];
    if (!box) return null;

    return (
      <aside className="clay-card" aria-label="Box Inspector">
        <div className="card-header">
          <div className="card-title">
            <Package size={18} color="#f59e0b" />
            <span>Parcel Inspector</span>
          </div>
          <button className="card-close-btn" onClick={handleClose} aria-label="Close Inspector">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            {box.sku}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            {box.name}
          </div>
          <div>
            <span 
              className="category-badge"
              style={{ background: box.color, color: '#0f172a' }}
            >
              {box.category}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(203, 213, 225, 0.4)', paddingTop: 8 }}>
          <div className="info-row">
            <span className="info-label">Rack Location:</span>
            <span className="info-val">{box.rackId.toUpperCase()} (Shelf {box.shelfIndex + 1})</span>
          </div>
          <div className="info-row">
            <span className="info-label">Gross Weight:</span>
            <span className="info-val">{box.weightKg} kg</span>
          </div>
          <div className="info-row">
            <span className="info-label">Stock Units:</span>
            <span className="info-val">{box.quantity} pcs</span>
          </div>
          <div className="info-row">
            <span className="info-label">Pick Frequency:</span>
            <span className="info-val">{box.pickCount} times</span>
          </div>
        </div>

        <button 
          className="clay-btn clay-btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => {
            dispatchPickOrder(box.id);
            handleClose();
          }}
          disabled={box.isPicked}
        >
          <Send size={16} />
          <span>{box.isPicked ? 'Parcel in Transit' : 'Dispatch AGV to Pick'}</span>
        </button>
      </aside>
    );
  }

  // 2. AGV Inspection
  if (selectedEntity.type === 'agv') {
    const agv = agvs.find((a) => a.id === selectedEntity.id);
    if (!agv) return null;

    const batteryColor = agv.battery > 60 ? '#10b981' : (agv.battery > 25 ? '#f59e0b' : '#ef4444');

    return (
      <aside className="clay-card" aria-label="AGV Inspector">
        <div className="card-header">
          <div className="card-title">
            <Bot size={18} color={agv.color} />
            <span>AGV Bot Telemetry</span>
          </div>
          <button className="card-close-btn" onClick={handleClose} aria-label="Close Inspector">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {agv.name}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'capitalize' }}>
            Status: <strong style={{ color: '#0f172a' }}>{agv.status.replace(/_/g, ' ')}</strong>
          </div>
        </div>

        <div>
          <div className="info-row">
            <span className="info-label">Battery Level:</span>
            <span className="info-val" style={{ color: batteryColor }}>{agv.battery}%</span>
          </div>
          <div className="battery-bar-container">
            <div 
              className="battery-bar-fill" 
              style={{ width: `${agv.battery}%`, background: batteryColor }} 
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(203, 213, 225, 0.4)', paddingTop: 8 }}>
          <div className="info-row">
            <span className="info-label">Position:</span>
            <span className="info-val">
              [{agv.position[0].toFixed(1)}, {agv.position[2].toFixed(1)}]
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Carried Cargo:</span>
            <span className="info-val">
              {agv.carriedBoxId ? boxes[agv.carriedBoxId]?.sku || 'Parcel' : 'None'}
            </span>
          </div>
        </div>

        <button 
          className="clay-btn"
          style={{ width: '100%', marginTop: 8 }}
          onClick={() => setFollowedAgvId(agv.id)}
        >
          <MapPin size={16} />
          <span>Follow Bot with Camera</span>
        </button>
      </aside>
    );
  }

  // 3. Rack Inspection
  if (selectedEntity.type === 'rack') {
    const rack = racks.find((r) => r.id === selectedEntity.id);
    if (!rack) return null;

    const occupiedCount = rack.boxIds.filter((bId) => !boxes[bId]?.isPicked).length;
    const capacity = rack.shelves * rack.slotsPerShelf;

    return (
      <aside className="clay-card" aria-label="Rack Inspector">
        <div className="card-header">
          <div className="card-title">
            <Warehouse size={18} color="#0284c7" />
            <span>Storage Rack Bay</span>
          </div>
          <button className="card-close-btn" onClick={handleClose} aria-label="Close Inspector">
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
          Aisle {rack.aisle} — Bay #{rack.bayIndex}
        </div>

        <div style={{ borderTop: '1px solid rgba(203, 213, 225, 0.4)', paddingTop: 8 }}>
          <div className="info-row">
            <span className="info-label">Shelves:</span>
            <span className="info-val">{rack.shelves} Tiers</span>
          </div>
          <div className="info-row">
            <span className="info-label">Capacity Utilized:</span>
            <span className="info-val">{occupiedCount} / {capacity} ({Math.round((occupiedCount / capacity) * 100)}%)</span>
          </div>
          <div className="info-row">
            <span className="info-label">Stored Parcels:</span>
            <span className="info-val">{occupiedCount} items</span>
          </div>
        </div>
      </aside>
    );
  }

  // 4. Zone Inspection
  if (selectedEntity.type === 'zone') {
    const isDock = selectedEntity.id === 'inbound-dock';
    return (
      <aside className="clay-card" aria-label="Zone Inspector">
        <div className="card-header">
          <div className="card-title">
            <Truck size={18} color="#3b82f6" />
            <span>{isDock ? 'Inbound Receiving Dock' : 'Outbound Dispatch Area'}</span>
          </div>
          <button className="card-close-btn" onClick={handleClose} aria-label="Close Inspector">
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
          {isDock 
            ? 'Incoming delivery trucks unload pallets containing newly received inventory. Parcels are inspected and assigned rack slots.'
            : 'Final packaging and pallet shrink-wrap station. Completed pick orders arriving from the conveyor belt are sorted and staged for shipping.'}
        </p>
      </aside>
    );
  }

  return null;
};
