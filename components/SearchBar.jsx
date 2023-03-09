export const SearchBar = ({ onChange }) => {
  const BarStyle = {
    width: "20rem",
    background: "#F0F0F0",
    border: "none",
    padding: "0.5rem",
    color: "black",
  };
  return (
    <input
      style={BarStyle}
      key="search-bar"
      placeholder={"Search"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
