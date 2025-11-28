import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import type { HospitalNode } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom White Rhombus Icon for Hospitals - Elongated
const createRhombusIcon = (status: string) => {
  const color = status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';
  return L.divIcon({
    className: 'custom-rhombus-icon',
    html: `<div style="
      background-color: white;
      width: 18px;
      height: 29px;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      border: 2px solid ${color};
      box-shadow: 0 4px 6px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [18, 29],
    iconAnchor: [9, 14.5],
    popupAnchor: [0, -15]
  });
};

// Red "Thing" for Patients - Smaller
const patientIcon = L.divIcon({
  className: 'patient-icon',
  html: `<div style="
    background-color: #ef4444;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1.5px solid white;
    box-shadow: 0 0 8px #ef4444;
    animation: pulse 2s infinite;
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Small Red Dot for Hotspots - Smaller
const hotspotIcon = L.divIcon({
  className: 'hotspot-icon',
  html: `<div style="
    background-color: #ef4444;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    opacity: 0.8;
  "></div>`,
  iconSize: [6, 6],
  iconAnchor: [3, 3]
});

interface MapVizProps {
  nodes: HospitalNode[];
  loading: boolean;
  epidemicData?: {
    patients: any[];
    hotspots: any[];
  };
}

const Legend = () => {
  return (
    <div className="leaflet-bottom leaflet-left m-4 z-[1000]">
      <div className="bg-[#0c0c0c]/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-[#222] text-xs space-y-2 min-w-[150px] font-mono">
        <h4 className="font-bold mb-1 text-[#ededed] uppercase tracking-wider">Legend</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-3 bg-white border border-green-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <span className="text-[#999]">Normal Hospital</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-3 bg-white border border-amber-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <span className="text-[#999]">Warning State</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-3 bg-white border border-red-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <span className="text-[#999]">Critical State</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm"></div>
          <span className="text-[#999]">Patient Zero</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-80"></div>
          <span className="text-[#999]">Predicted Hotspot</span>
        </div>
      </div>
    </div>
  );
};

const PulsingMarker = ({ node }: { node: HospitalNode }) => {
  const color = node.status === 'critical' ? '#ef4444' : node.status === 'warning' ? '#f59e0b' : '#10b981';
  
  return (
    <>
      <Marker position={[node.lat, node.lng]} icon={createRhombusIcon(node.status)}>
        <Popup className="custom-popup">
          <div className="p-3 min-w-[220px] vitals-card rounded-lg">
            <div className="flex items-center justify-between mb-3 border-b border-[#222] pb-2">
              <h3 className="font-bold text-base font-grotesk tracking-tight text-white">{node.name}</h3>
              <span className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold text-black uppercase tracking-wider ${
                node.status === 'critical' ? 'bg-red-500' : 
                node.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
              }`}>{node.status}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="metric-label">Occupancy</span>
                <span className="metric-value">{node.occupancy}%</span>
              </div>
              <div className="w-full bg-[#222] h-1">
                <div 
                  className={`h-1 ${
                    node.occupancy > 90 ? 'bg-red-500' : 'bg-green-500'
                  }`} 
                  style={{ width: `${node.occupancy}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="metric-label">Oxygen</p>
                  <p className="metric-value">{node.resources.oxygen}%</p>
                </div>
                <div>
                  <p className="metric-label">Staff</p>
                  <p className="metric-value">{node.resources.staff}%</p>
                </div>
              </div>

              {node.criticality !== undefined && (
                <div className="pt-2 border-t border-[#222]">
                  <div className="flex justify-between items-center">
                    <span className="metric-label text-red-400">Criticality Idx</span>
                    <span className="metric-value text-red-400">{node.criticality.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
      <Circle 
        center={[node.lat, node.lng]}
        pathOptions={{ 
          color: color,
          fillColor: color,
          fillOpacity: 0.05,
          weight: 1,
          dashArray: '5, 5'
        }}
        radius={node.occupancy * 20}
      />
    </>
  );
};

export function MapViz({ nodes, loading, epidemicData }: MapVizProps) {
  const center = { lat: 19.0760, lng: 72.8777 }; // Mumbai

  return (
    <Card className="h-[600px] flex flex-col border-none shadow-lg overflow-hidden relative group bg-[#09090b]">
      {/* Title Card - Moved to Bottom Right */}
      <CardHeader className="absolute bottom-0 right-0 z-[400] bg-[#0c0c0c]/90 backdrop-blur-sm m-4 rounded-lg shadow-xl border border-[#222] p-4 max-w-xs text-right">
        <CardTitle className="text-lg font-grotesk text-white">Epidemic Diffusion Map</CardTitle>
        <p className="text-xs text-[#666] font-mono uppercase tracking-wider mt-1">Real-time node status & viral spread</p>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative h-full">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#09090b]">
            <p className="text-[#666] font-mono animate-pulse">INITIALIZING MAP DATA...</p>
          </div>
        ) : (
          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={11} 
            scrollWheelZoom={true} 
            className="h-full w-full z-0 bg-[#09090b]"
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Hospital Nodes */}
            {nodes.map((node) => (
              <PulsingMarker key={node.id} node={node} />
            ))}

            {/* Epidemic Data Layers */}
            {epidemicData?.patients.map((patient) => (
              <Marker 
                key={patient.id} 
                position={[patient.lat, patient.lng]} 
                icon={patientIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-2 vitals-card">
                    <div className="metric-label text-red-500 mb-1">Patient Zero</div>
                    <div className="metric-value text-xs">{patient.address}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {epidemicData?.hotspots.map((hotspot) => (
              <Marker 
                key={hotspot.id} 
                position={[hotspot.lat, hotspot.lng]} 
                icon={hotspotIcon}
              />
            ))}

            <Legend />
          </MapContainer>
        )}
      </CardContent>
    </Card>
  );
}
