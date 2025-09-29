function PartInfo({ part, onClick }) {
    return (
        <div 
        onClick={onClick} 
        style ={{border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}
        >
            <h3>{part.name}</h3>
            <p>Price: {part.price}</p>
            <p>Condition: {part.condition}</p>
        </div>
    );
}

export default PartInfo;