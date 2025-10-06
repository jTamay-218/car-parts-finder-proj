import PartInfo from "./PartInfo";

function PartsDisplay({ parts, onPartClick }) {
    if (parts.length === 0) {
        return null;
    }

    return (
        <div style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            marginBottom: "3rem"
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