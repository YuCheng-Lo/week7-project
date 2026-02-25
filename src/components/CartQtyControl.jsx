const CartQtyControl = ({ qty, onIncrease, onDecrease, loading = false }) => {
  return (
    <div className="input-group" style={{ width: "150px" }}>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onDecrease}
        disabled={loading}
      >
        {loading ? "..." : <i className="bi bi-dash"></i>}
      </button>
      <input
        type="text"
        value={qty}
        className="form-control text-center"
        readOnly
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onIncrease}
        disabled={loading}
      >
        {loading ? "..." : <i className="bi bi-plus"></i>}
      </button>
    </div>
  );
};

export default CartQtyControl;
