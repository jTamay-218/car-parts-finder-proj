import PartInfo from "./PartInfo";

function PartsDisplay({ parts, onPartClick }) {
    if (parts.length === 0) {
        return <p>No parts found.</p>;
    }

    return (
    <div
        style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
