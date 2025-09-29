import PartInfo from "./PartInfo";

function PartsDisplay({ parts, onPartClick }) {
    if (parts.length === 0) {
        return <p>No parts found.</p>;
    }

    return (
    <div
        style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}>
        
        {parts.map((part) => (
            <PartInfo 
            key={part.id} 
            part={part} 
            onClick={() => onPartClick && onPartClick(part)}
            />
        ))}
    </div>
  );
}

export default PartsDisplay;
