const KpiCard = ({ titulo, valor, color }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "20px",
        borderRadius: "12px",
        color: "white",
        width: "220px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{titulo}</h3>
      <h1>{valor}</h1>
    </div>
  );
};

export default KpiCard;